import { Contact } from "../model/contact";
import { RequestHandler } from "express";

export const addContact: RequestHandler = async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error("Error adding contact: ", error);
    res.status(500).json({
      message: "Error adding contact.",
      error: error,
    });
  }
};

export const getContacts: RequestHandler = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts: ", error);
    res.status(500).json({
      message: "Error fetching contacts.",
      error: error,
    });
  }
};
