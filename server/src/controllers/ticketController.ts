import { Ticket } from "../model/ticket";
import { Request, Response } from "express";
import { User } from "../model/user";

export const createTicket = async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not Authenticated." });
  }

  const profile = req.user as any;
  const user = await User.findOne({ googleUid: profile.id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const userID = user._id;

  const { eventID, paymentID, groupBuddy, dietaryRequirements } = req.body;

  if (!userID || !eventID || !paymentID) {
    return res
      .status(400)
      .json({ message: "userID, eventID and paymentID are required." });
  }

  try {
    const newTicket = await Ticket.create({
      userID: userID,
      eventID: eventID,
      paymentID: paymentID,
      groupBuddy: groupBuddy,
      dietaryRequirements: dietaryRequirements,
    });
    res.status(201).json(newTicket);
  } catch (ticketCreationError) {
    console.error("[!] Error creating ticket: ", ticketCreationError);
  }
};

export const getTicketsByUserID = async (req: Request, res: Response) => {};
