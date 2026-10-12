import { Ticket } from "../model/ticket";
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authUser";

export const createTicket = async (req: AuthenticatedRequest, res: Response) => {
  const userID = req.userID;

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

export const getTicketsByUserId = async (req: AuthenticatedRequest, res: Response) => {
  const userID = req.userID;

  if (!userID) {
    return res
      .status(400)
      .json({ message: "userID are required." });
  }

  try {
    const tickets = await Ticket.find({userID: userID}).sort({createdAt: -1}).lean()
    res.status(200).json(tickets);
  } catch (ticketRetrievalError) {
    console.error("[!] Error retrieving tickets for user: ", ticketRetrievalError);
  }
};
