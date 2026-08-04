import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { Image } from "../model/image";
import { s3BucketName, s3Client } from "../config/aws";

const signedUrlExpirySeconds = 60 * 15;

const normaliseOptionalString = (value: unknown) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }

    const tag = normaliseOptionalString(req.body.tag);
    const galleryKey = normaliseOptionalString(req.body.galleryKey);

    if (!tag && !galleryKey) {
      res.status(400).json({
        message:
          "Either tag (slot mode) or galleryKey (gallery mode) is required",
      });
      return;
    }

    // Slot mode: no galleryKey means one image per slot tag. Replace older slot images for that tag.
    if (!galleryKey && tag) {
      const existingSlotImages = await Image.find({
        tag,
        galleryKey: null,
      }).lean();

      for (const existing of existingSlotImages) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: existing.bucket,
              Key: existing.s3Key,
            })
          );
        } catch (s3Error) {
          console.error("Failed to delete old S3 object:", s3Error);
        }

        await Image.deleteOne({ _id: existing._id });
      }
    }

    const fileExtension = req.file.originalname.includes(".")
      ? req.file.originalname.split(".").pop()
      : "";
    const fileSuffix = fileExtension ? `.${fileExtension}` : "";
    const s3Key = `images/${randomUUID()}${fileSuffix}`;

    const image = await Image.create({
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      s3Key,
      bucket: s3BucketName,
      tag,
      galleryKey,
    });

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
      tag: image.tag,
      galleryKey: image.galleryKey,
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
      tag: image.tag,
      galleryKey: image.galleryKey,
      signedUrl,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
};

export const getImageByTag: RequestHandler = async (req, res) => {
  try {
    const image = await Image.findOne({ tag: req.params.tag }).sort({
      uploadedAt: -1,
    });

    if (!image) {
      res.json({ signedUrl: null });
      return;
    }

    const signedUrl = await getSignedUrl(
      s3Client,
      new GetObjectCommand({ Bucket: image.bucket, Key: image.s3Key }),
      { expiresIn: signedUrlExpirySeconds }
    );

    res.json({
      id: image._id,
      originalName: image.originalName,
      signedUrl,
    });
  } catch (error) {
    console.error("Error fetching image by tag:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
};

export const getImagesByGalleryKey: RequestHandler = async (req, res) => {
  try {
    const galleryKey = req.params.galleryKey;
    const images = await Image.find({ galleryKey })
      .sort({ uploadedAt: 1 })
      .lean();

    if (!images.length) {
      res.json([]);
      return;
    }

    const mappedImages = await Promise.all(
      images.map(async (image) => {
        const signedUrl = await getSignedUrl(
          s3Client,
          new GetObjectCommand({ Bucket: image.bucket, Key: image.s3Key }),
          { expiresIn: signedUrlExpirySeconds }
        );

        return {
          id: image._id,
          originalName: image.originalName,
          uploadedAt: image.uploadedAt,
          signedUrl,
        };
      })
    );

    res.json(mappedImages);
  } catch (error) {
    console.error("Error fetching images by gallery key:", error);
    res.status(500).json({ message: "Failed to fetch gallery images" });
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
