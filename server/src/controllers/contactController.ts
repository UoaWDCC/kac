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

export const updateContact: RequestHandler = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        message: req.body.message,
        name: req.body.name,
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      res.status(404).json({ message: "Contact response not found" });
      return;
    }

    res.status(200).json(contact);
  } catch (error) {
    console.error("Error updating contact: ", error);
    res.status(500).json({
      message: "Error updating contact.",
      error: error,
    });
  }
};

export const deleteContact: RequestHandler = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      res.status(404).json({ message: "Contact response not found" });
      return;
    }

    res.status(200).json({ message: "Contact response deleted" });
  } catch (error) {
    console.error("Error deleting contact: ", error);
    res.status(500).json({
      message: "Error deleting contact.",
      error: error,
    });
  }
};
