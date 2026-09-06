import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { RequestHandler } from "express";
import { Executive } from "../model/executive";
import { Image } from "../model/image";
import { s3Client } from "../config/aws";

const normaliseRoleGroup = (value?: string) =>
  (value || "other")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-");

const deleteImagesForExecutive = async (imageTag?: string) => {
  if (!imageTag?.startsWith("exec-image:")) return 0;

  const images = await Image.find({ tag: imageTag }).lean();
  const deletedImageIds = [];
  let failedDeletes = 0;

  for (const image of images) {
    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: image.bucket,
          Key: image.s3Key,
        })
      );
      deletedImageIds.push(image._id);
    } catch (error) {
      failedDeletes += 1;
      console.error("Failed to delete executive image from S3:", error);
    }
  }

  if (deletedImageIds.length > 0) {
    await Image.deleteMany({ _id: { $in: deletedImageIds } });
  }

  return failedDeletes;
};

export const addExec: RequestHandler = async (req, res, next) => {
  try {
    req.body.roleGroup = normaliseRoleGroup(req.body.roleGroup);
    const newExec = new Executive(req.body);
    newExec.imageURL = `exec-image:${newExec._id}`;
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
    const executive = await Executive.findById(req.params.id);
    if (!executive) {
      return res.status(404).json({ message: "Executive not found." });
    }

    const failedImageDeletes = await deleteImagesForExecutive(
      executive.imageURL
    );
    await executive.deleteOne();

    res.status(200).json({
      message: "Executive deleted successfully.",
      imageCleanupWarning:
        failedImageDeletes > 0
          ? `${failedImageDeletes} image(s) could not be deleted from storage.`
          : undefined,
    });
  } catch (err) {
    console.error("[!] Error deleting executive and image: ", err);
    res.status(500).json({
      message: "Error deleting executive and image.",
      error: err,
    });
  }
};

export const getAllExecs: RequestHandler = async (req, res, next) => {
  try {
    const executives = await Executive.find().sort({ createdAt: 1 }).lean();
    const mappedExecs = executives.map((exec) => ({
      ...exec,
      id: exec._id,
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
