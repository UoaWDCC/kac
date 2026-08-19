import { Event } from "../model/event";
import { RequestHandler } from "express";
import { isAdminRequest } from "../middlewares/adminGuard";

export const addEvent: RequestHandler = async (req, res, next) => {
  try {
    const newEvent = new Event(req.body);
    newEvent.imageUrl = `event-image:${newEvent._id}`;
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error("[!] Error adding event: ", err);
    res.status(500).json({
      message: "Error adding event.",
      error: err,
    });
  }
};

export const deleteEvent: RequestHandler = async (req, res, _next) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found." });
    }
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("[!] Error deleting event: ", err);
    res.status(500).json({
      message: "Error deleting event.",
      error: err,
    });
  }
};

export const getEventById: RequestHandler = async (req, res, _next) => {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    const isAdmin = await isAdminRequest(req);
    const isReleased =
      !event.releaseDatetime || event.releaseDatetime <= new Date();

    if (!isAdmin && !isReleased) {
      // Unreleased events do not exists to non-admins.
      return res.status(404).json({ message: "Event not found." });
    }

    res.status(200).json(event);
  } catch (err) {
    console.error("[!] Error fetching event: ", err);
    res.status(500).json({
      message: "Error fetching event.",
      error: err,
    });
  }
};

// Helper function: format a Date object to a string with YYYY-MM-DD format in NZ timezone
function getNZDateString(date: Date): string {
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Pacific/Auckland",
  }).format(date);
}

export const getAllEvents: RequestHandler = async (req, res, _next) => {
  try {
    const now = new Date();
    const isAdmin = await isAdminRequest(req);

    const filter = isAdmin
      ? {}
      : {
          $or: [{ releaseDatetime: null }, { releaseDatetime: { $lte: now } }],
        };

    const events = await Event.find(filter).sort({ datetime: 1 }).lean();

    const todayNZ = getNZDateString(now);

    const mappedEvents = events.reduce<{ upcoming: any[]; past: any[] }>(
      (acc, event) => {
        const formattedEvent = {
          ...event,
          id: event._id,
        };

        const eventDate = new Date(event.datetime);

        // Legacy/malformed objects without a usable datetime will be treated as a past event
        if (Number.isNaN(eventDate.getTime())) {
          acc.past.push(formattedEvent);
          return acc;
        }

        const eventDateNZ = getNZDateString(eventDate);

        if (eventDateNZ >= todayNZ) {
          acc.upcoming.push(formattedEvent);
        } else {
          acc.past.push(formattedEvent);
        }

        return acc;
      },
      { upcoming: [], past: [] }
    );

    // reverse the past events to have the most recent first
    mappedEvents.past.reverse();

    res.status(200).json(mappedEvents);
  } catch (err) {
    console.error("[!] Error fetching events: ", err);
    res.status(500).json({
      message: "Error fetching events.",
      error: err,
    });
  }
};
