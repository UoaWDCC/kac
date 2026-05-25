import { Executive } from "../model/executive";
import { RequestHandler } from "express";

const normaliseRoleGroup = (value?: string) =>
  (value || "other")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-");

export const addExec: RequestHandler = async (req, res, next) => {
  try {
    req.body.roleGroup = normaliseRoleGroup(req.body.roleGroup);
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
    if ("roleGroup" in req.body) {
      req.body.roleGroup = normaliseRoleGroup(req.body.roleGroup);
    }

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
    const mappedExecs = executives.map((exec) => ({
      ...exec,
      id: exec._id,
      roleGroup: normaliseRoleGroup(exec.roleGroup),
    }));
    res.status(200).json(mappedExecs);
  } catch (err) {
    console.error("[!] Error fetching executives: ", err);
    res.status(500).json({
      message: "Error fetching executives.",
      error: err,
    });
  }
};
