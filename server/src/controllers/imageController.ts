import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { RequestHandler } from "express";
import { randomUUID } from "crypto";
import { Image } from "../model/image";
import { s3BucketName, s3Client } from "../config/aws";

const signedUrlExpirySeconds = 60 * 15;

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }

    const fileExtension = req.file.originalname.includes(".")
      ? req.file.originalname.split(".").pop()
      : "";
    const s3Key = `images/${randomUUID()}${fileExtension ? `.${fileExtension}` : ""}`;

    // create mongo record
    const image = await Image.create({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      s3Key,
      bucket: s3BucketName,
    });

    // Upload to S3, roll back the Mongo record if it fails
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3BucketName,
          Key: s3Key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );
    } catch (s3Error) {
      console.error("S3 upload failed, rolling back Mongo record:", s3Error);
      await image.deleteOne();
      res.status(500).json({ message: "Failed to upload image to storage" });
      return;
    }

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: s3BucketName,
        Key: s3Key,
      }),
      { expiresIn: signedUrlExpirySeconds }
    );

    res.status(201).json({
      id: image._id,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: image.size,
      s3Key: image.s3Key,
      uploadedAt: image.uploadedAt,
      signedUrl,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};

export const getImageById: RequestHandler = async (req, res, next) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({
        Bucket: image.bucket,
        Key: image.s3Key,
      }),
      { expiresIn: signedUrlExpirySeconds }
    );

    res.json({
      id: image._id,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: image.size,
      s3Key: image.s3Key,
      uploadedAt: image.uploadedAt,
      signedUrl,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
};

export const listImages: RequestHandler = async (req, res, next) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 }).lean();

    res.json(images);
  } catch (error) {
    console.error("Error listing images:", error);
    res.status(500).json({ message: "Failed to list images" });
  }
};
