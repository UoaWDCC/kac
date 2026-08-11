import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { Image } from "../model/image";
import { User } from "../model/user";
import { s3BucketName, s3Client } from "../config/aws";

const signedUrlExpirySeconds = 60 * 15;

const normaliseOptionalString = (value: unknown) => {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getProfileImageTag = (userId: unknown) =>
  `profile-image:${String(userId)}`;

const buildSignedImageResponse = async (image: any) => {
  const signedUrl = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: image.bucket,
      Key: image.s3Key,
    }),
    { expiresIn: signedUrlExpirySeconds }
  );

  return {
    id: image._id,
    originalName: image.originalName,
    mimeType: image.mimeType,
    size: image.size,
    s3Key: image.s3Key,
    uploadedAt: image.uploadedAt,
    tag: image.tag,
    galleryKey: image.galleryKey,
    signedUrl,
  };
};

const replaceImageForTag = async (
  file: Express.Multer.File,
  tag: string | null
) => {
  const existing = tag ? await Image.findOne({ tag }) : null;

  const fileExtension = file.originalname.includes(".")
    ? file.originalname.split(".").pop()
    : "";
  const s3Key = `images/${randomUUID()}${fileExtension ? `.${fileExtension}` : ""}`;

  const image = await Image.create({
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    s3Key,
    bucket: s3BucketName,
    tag,
  });

  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: s3BucketName,
        Key: s3Key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
  } catch (s3Error) {
    console.error("S3 upload failed, rolling back Mongo record:", s3Error);
    await image.deleteOne();
    throw new Error("Failed to upload image to storage");
  }

  if (existing) {
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

    await existing.deleteOne();
  }

  return buildSignedImageResponse(image);
};

const getAuthenticatedUser = async (req: Parameters<RequestHandler>[0]) => {
  if (!req.isAuthenticated()) return null;

  const profile = req.user as { id?: string } | undefined;
  if (!profile?.id) return null;

  return User.findOne({ googleUid: profile.id });
};

export const uploadImage: RequestHandler = async (req, res) => {
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

    const newImage = await Image.create({
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
      await newImage.deleteOne();
      res.status(500).json({ message: "Failed to upload image to storage" });
      return;
    }

    const response = await buildSignedImageResponse(newImage);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to upload image",
    });
  }
};

export const getImageById: RequestHandler = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    const response = await buildSignedImageResponse(image);
    res.json(response);
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

    res.json(await buildSignedImageResponse(image));
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

export const getCurrentProfileImage: RequestHandler = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    const image = await Image.findOne({
      tag: getProfileImageTag(user._id),
    }).sort({ uploadedAt: -1 });

    if (!image) {
      res.json({ signedUrl: null });
      return;
    }

    res.json(await buildSignedImageResponse(image));
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ message: "Failed to fetch profile image" });
  }
};

export const uploadCurrentProfileImage: RequestHandler = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ message: "Image file is required" });
      return;
    }

    const image = await replaceImageForTag(
      req.file,
      getProfileImageTag(user._id)
    );

    res.status(201).json(image);
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to upload profile image",
    });
  }
};

export const listImages: RequestHandler = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 }).lean();
    res.json(images);
  } catch (error) {
    console.error("Error listing images:", error);
    res.status(500).json({ message: "Failed to list images" });
  }
};
