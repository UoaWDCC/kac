import { Executive } from "../model/executive";
import { RequestHandler } from "express";

export const addExec: RequestHandler = async (req, res, next) => {
  try {
    const newExec = new Executive(req.body);
    const savedExec = await newExec.save();
    res.status(201).json(savedExec);
  } catch (err) {
    console.error("[!] Error adding executive: ", err);
    res.status(500).json({
      message: "Error adding executive.",
      error: err,
    });
  }
};

export const editExec: RequestHandler = async (req, res, next) => {
  try {
    const updatedExec = await Executive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after" }
    ).lean();

    if (!updatedExec) {
      return res.status(404).json({ message: "Executive not found." });
    }

    res.status(200).json(updatedExec);
  } catch (err) {
    console.error("[!] Error editing executive: ", err);
    res.status(500).json({
      message: "Error editing executive.",
      error: err,
    });
  }
};

export const deleteExec: RequestHandler = async (req, res, next) => {
  try {
    const deletedExec = await Executive.findByIdAndDelete(req.params.id);
    if (!deletedExec) {
      return res.status(404).json({ message: "Executive not found." });
    }
    res.status(200).json({ message: "Executive deleted successfully." });
  } catch (err) {
    console.error("[!] Error deleting executive: ", err);
    res.status(500).json({
      message: "Error deleting executive.",
      error: err,
    });
  }
};

export const getAllExecs: RequestHandler = async (req, res, next) => {
  try {
    const executives = await Executive.find().lean();
    res.status(200).json(executives);
  } catch (err) {
    console.error("[!] Error fetching executives: ", err);
    res.status(500).json({
      message: "Error fetching executives.",
      error: err,
    });
  }
};
