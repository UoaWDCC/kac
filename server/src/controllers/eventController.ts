import { Event } from "../model/event";
import { RequestHandler } from "express";

export const addEvent: RequestHandler = async (req, res, next) => {
  try {
    const newEvent = new Event(req.body);
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

export const getAllEvents: RequestHandler = async (req, res, _next) => {
  try {
    const events = await Event.find().lean();
    const now = new Date();

    const mappedEvents = events.reduce(
      (acc, event) => {
        const formattedEvent = {
          ...event,
          id: event._id,
        };

        if (new Date(event.datetime) >= now) {
          acc.upcoming.push(formattedEvent);
        } else {
          acc.past.push(formattedEvent);
        }

        return acc;
      },
      { upcoming: [], past: [] }
    );

    res.status(200).json(mappedEvents);
  } catch (err) {
    console.error("[!] Error fetching events: ", err);
    res.status(500).json({
      message: "Error fetching events.",
      error: err,
    });
  }
};
