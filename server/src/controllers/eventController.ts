import { Event } from "../model/event";
import { RequestHandler } from "express";

export const addEvent: RequestHandler = async (req, res, next) => {
  try {
    if (req.body.datetime) {
      const d = new Date(req.body.datetime);
      const year = d.getUTCFullYear();
      const month = d.getUTCMonth();
      const dateVal = d.getUTCDate();

      // Start with 11:59 PM NZST represented in UTC (23:59 - 12h = 11:59 UTC)
      const candidate = new Date(Date.UTC(year, month, dateVal, 11, 59, 59));

      // Convert to NZ time to check the local hour.
      // In daylight savings (NZDT, UTC+13), 11:59 UTC becomes 12:59 AM next day (hour 0 instead of 23).
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "Pacific/Auckland",
        hour: "numeric",
        hourCycle: "h23",
      }).formatToParts(candidate);
      const nzHour = parseInt(
        parts.find((p) => p.type === "hour")?.value || "23",
        10
      );

      // If daylight savings pushed the hour past 11 PM, roll UTC back 1 hour to keep it at 11:59 PM NZDT
      if (nzHour !== 23) {
        candidate.setUTCHours(candidate.getUTCHours() - 1);
      }
      req.body.datetime = candidate;
    }

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

    const mappedEvents = events.reduce<{ upcoming: any[]; past: any[] }>(
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
