import mongoose, { ClientSession } from "mongoose";
import { Request, RequestHandler, Response } from "express";
import { Ticket } from "../model/ticket";
import { User } from "../model/user";
import { Event } from "../model/event";

class TicketError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function objectId(value: unknown, label: string): string {
  if (typeof value !== "string" || !/^[a-f\d]{24}$/i.test(value)) {
    throw new TicketError(400, `Invalid ${label}.`);
  }

  return value;
}

function text(value: unknown, fallback = "N/A"): string {
  if (value === undefined || value === null) return fallback;

  if (typeof value !== "string") {
    throw new TicketError(400, "Ticket fields must be strings.");
  }

  return value.trim() || fallback;
}

async function requestUser(req: Request) {
  if (!req.isAuthenticated()) {
    throw new TicketError(401, "Not authenticated.");
  }

  const profile = req.user as { id?: string } | undefined;

  if (!profile?.id) {
    throw new TicketError(401, "Not authenticated.");
  }

  const user = await User.findOne({ googleUid: profile.id });

  if (!user) {
    throw new TicketError(404, "User not found.");
  }

  return user;
}

function ticketError(res: Response, error: unknown) {
  if (error instanceof TicketError) {
    res.status(error.status).json({ message: error.message });
  } else if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: error.message });
  } else if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({
      message: "You already have a registration.",
    });
  } else {
    console.error("Ticket request failed:", error);

    res.status(500).json({
      message: "Could not complete the ticket request.",
    });
  }
}

async function withEventTransaction<T>(
  eventId: string,
  work: (session: ClientSession) => Promise<T>
): Promise<T> {
  return mongoose.connection.transaction(async (session) => {
    const result = await Event.updateOne(
      { _id: eventId },
      { $inc: { registrationVersion: 1 } },
      { session }
    );

    if (result.matchedCount === 0) {
      throw new TicketError(404, "Event not found.");
    }

    return work(session);
  });
}

export const createTicket: RequestHandler = async (req, res) => {
  try {
    const user = await requestUser(req);
    const body = req.body ?? {};
    const eventId = objectId(body.eventID, "event ID");

    const details = {
      paymentID: text(body.paymentID),
      groupBuddy: text(body.groupBuddy),
      dietaryRequirements: text(body.dietaryRequirements),
    };

    const ticket = await withEventTransaction(eventId, async (session) => {
      const event = await Event.findById(eventId).session(session);

      if (!event) {
        throw new TicketError(404, "Event not found.");
      }

      const now = new Date();

      if (
        event.datetime <= now ||
        (event.releaseDatetime && event.releaseDatetime > now)
      ) {
        throw new TicketError(409, "Signups are not open for this event.");
      }

      const existing = await Ticket.findOne({
        eventID: eventId,
        userID: user._id,
      }).session(session);

      if (existing && existing.status !== "cancelled") {
        throw new TicketError(
          409,
          "You are already registered for this event."
        );
      }

      if (
        event.capacity != null &&
        (!Number.isInteger(event.capacity) || event.capacity < 1)
      ) {
        throw new TicketError(
          409,
          "This event needs a valid capacity before signup."
        );
      }

      const confirmed = await Ticket.countDocuments({
        eventID: eventId,
        status: "confirmed",
      }).session(session);

      const waiting = await Ticket.exists({
        eventID: eventId,
        status: "waitlisted",
      }).session(session);

      const hasSpace = event.capacity == null || confirmed < event.capacity;

      const status = hasSpace && !waiting ? "confirmed" : "waitlisted";

      const values = {
        ...details,
        status,
        registeredAt: now,
        waitlistedAt: status === "waitlisted" ? now : null,
        attended: false,
        cancelledAt: null,
        cancelledBy: null,
      };

      const registration =
        existing ??
        new Ticket({
          eventID: eventId,
          userID: user._id,
        });

      registration.set(values);
      await registration.save({ session });

      return registration;
    });

    res.status(201).json(ticket);
  } catch (error) {
    ticketError(res, error);
  }
};

// Retrieve tickets by event ID or user ID
type SignupUser = {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
};

export const getTicketsByEventID: RequestHandler = async (req, res) => {
  try {
    const eventId = objectId(req.params.eventId, "event ID");

    if (!(await Event.exists({ _id: eventId }))) {
      throw new TicketError(404, "Event not found.");
    }

    const tickets = await Ticket.find({
      eventID: eventId,
      status: { $in: ["confirmed", "waitlisted"] },
    })
      .sort({ registeredAt: 1, _id: 1 })
      .populate<{ userID: SignupUser | null }>(
        "userID",
        "firstName lastName email"
      )
      .lean();

    res.json(
      tickets.map((ticket) => ({
        _id: ticket._id.toString(),
        userID: ticket.userID?._id.toString() ?? null,
        eventID: ticket.eventID.toString(),
        status: ticket.status,
        registeredAt: (ticket.registeredAt ?? ticket.createdAt).toISOString(),
        waitlistedAt: ticket.waitlistedAt?.toISOString() ?? null,
        attended: ticket.attended,
        groupBuddy: ticket.groupBuddy,
        dietaryRequirements: ticket.dietaryRequirements,
        user: ticket.userID
          ? {
              _id: ticket.userID._id.toString(),
              firstName: ticket.userID.firstName,
              lastName: ticket.userID.lastName,
              email: ticket.userID.email,
            }
          : null,
      }))
    );
  } catch (error) {
    ticketError(res, error);
  }
};

export const getTicketsByUserID: RequestHandler = async (req, res) => {
  try {
    const user = await requestUser(req);
    const eventId = objectId(req.query.eventId, "event ID");

    const ticket = await Ticket.findOne({
      eventID: eventId,
      userID: user._id,
      status: { $in: ["confirmed", "waitlisted"] },
    }).lean();

    res.json(ticket);
  } catch (error) {
    ticketError(res, error);
  }
};

// Attendance, removal and promotion handlers
export const updateTicketAttendance: RequestHandler = async (req, res) => {
  try {
    const eventId = objectId(req.params.eventId, "event ID");
    const ticketId = objectId(req.params.ticketId, "ticket ID");

    if (typeof req.body?.attended !== "boolean") {
      throw new TicketError(400, "attended must be a boolean.");
    }

    const ticket = await Ticket.findOneAndUpdate(
      {
        _id: ticketId,
        eventID: eventId,
        status: "confirmed",
      },
      {
        $set: { attended: req.body.attended },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ticket) {
      throw new TicketError(
        409,
        "A confirmed registration could not be found."
      );
    }

    res.sendStatus(204);
  } catch (error) {
    ticketError(res, error);
  }
};

export const cancelTicket: RequestHandler = async (req, res) => {
  try {
    const admin = await requestUser(req);
    const eventId = objectId(req.params.eventId, "event ID");
    const ticketId = objectId(req.params.ticketId, "ticket ID");

    await withEventTransaction(eventId, async (session) => {
      const ticket = await Ticket.findOne({
        _id: ticketId,
        eventID: eventId,
      }).session(session);

      if (!ticket) {
        throw new TicketError(404, "Registration not found.");
      }

      if (ticket.status === "cancelled") return;

      ticket.status = "cancelled";
      ticket.cancelledAt = new Date();
      ticket.cancelledBy = admin._id;

      await ticket.save({ session });
    });

    res.sendStatus(204);
  } catch (error) {
    ticketError(res, error);
  }
};

export const promoteTicket: RequestHandler = async (req, res) => {
  try {
    const eventId = objectId(req.params.eventId, "event ID");
    const ticketId = objectId(req.params.ticketId, "ticket ID");

    await withEventTransaction(eventId, async (session) => {
      const event = await Event.findById(eventId).session(session);

      if (!event) {
        throw new TicketError(404, "Event not found.");
      }

      const now = new Date();

      if (
        event.datetime <= now ||
        (event.releaseDatetime && event.releaseDatetime > now)
      ) {
        throw new TicketError(409, "This event is not open for promotion.");
      }

      const ticket = await Ticket.findOne({
        _id: ticketId,
        eventID: eventId,
        status: "waitlisted",
      }).session(session);

      if (!ticket) {
        throw new TicketError(409, "Registration is not waitlisted.");
      }

      if (!(await User.exists({ _id: ticket.userID }).session(session))) {
        throw new TicketError(409, "This member no longer exists.");
      }

      const first = await Ticket.findOne({
        eventID: eventId,
        status: "waitlisted",
      })
        .sort({ waitlistedAt: 1, _id: 1 })
        .session(session);

      if (!first || !first._id.equals(ticket._id)) {
        throw new TicketError(409, "Promote the first person on the waitlist.");
      }

      if (
        event.capacity != null &&
        (!Number.isInteger(event.capacity) || event.capacity < 1)
      ) {
        throw new TicketError(
          409,
          "This event needs a valid capacity before promotion."
        );
      }

      const confirmed = await Ticket.countDocuments({
        eventID: eventId,
        status: "confirmed",
      }).session(session);

      if (event.capacity != null && confirmed >= event.capacity) {
        throw new TicketError(409, "This event is full.");
      }

      ticket.status = "confirmed";
      ticket.attended = false;

      await ticket.save({ session });
    });

    res.sendStatus(204);
  } catch (error) {
    ticketError(res, error);
  }
};
