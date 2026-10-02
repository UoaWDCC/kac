import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

import mongoose from "mongoose";
import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import { Image } from "../src/model/image";
import { s3Client, s3BucketName } from "../src/config/aws";

const mongoUser = encodeURIComponent(process.env.MONGODB_USER ?? "");
const mongoPassword = encodeURIComponent(process.env.MONGODB_PASSWORD ?? "");
const mongoSrvUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@kac-prod.cf1fyh5.mongodb.net/?appName=kac-prod`;
const mongoStandardUrl =
  `mongodb://${mongoUser}:${mongoPassword}` +
  "@ac-pcfgzmm-shard-00-00.cf1fyh5.mongodb.net:27017," +
  "ac-pcfgzmm-shard-00-01.cf1fyh5.mongodb.net:27017," +
  "ac-pcfgzmm-shard-00-02.cf1fyh5.mongodb.net:27017/" +
  "?tls=true&replicaSet=atlas-b12118-shard-0&authSource=admin&appName=kac-prod";

async function run() {
  console.log("Connecting to MongoDB...");
  try {
    await mongoose.connect(mongoSrvUrl);
  } catch (err) {
    console.warn("MongoDB SRV connect failed, trying standard...");
    await mongoose.connect(mongoStandardUrl);
  }
  console.log("Connected.");

  console.log("Fetching images from DB...");
  const images = await Image.find({});
  console.log(`Found ${images.length} images.`);

  for (const image of images) {
    if (image.mimeType === "image/webp") {
      console.log(`Skipping ${image.originalName} (${image.s3Key}) as it is already WebP.`);
      continue;
    }

    if (!image.mimeType.startsWith("image/") || image.mimeType.includes("svg")) {
      console.log(`Skipping ${image.originalName} (${image.s3Key}) because it is not a compressible image (mimeType: ${image.mimeType}).`);
      continue;
    }

    console.log(`Processing ${image.originalName} (${image.s3Key})...`);
    try {
      // 1. Download from S3
      const getResponse = await s3Client.send(
        new GetObjectCommand({
          Bucket: s3BucketName,
          Key: image.s3Key,
        })
      );

      if (!getResponse.Body) {
        console.warn(`No body found for ${image.s3Key}`);
        continue;
      }

      // Convert stream to buffer
      const stream = getResponse.Body as NodeJS.ReadableStream;
      const chunks: Buffer[] = [];
      for await (const chunk of stream) {
        chunks.push(Buffer.from(chunk));
      }
      const originalBuffer = Buffer.concat(chunks);

      // 2. Compress to WebP
      const webpBuffer = await sharp(originalBuffer).webp({ quality: 80 }).toBuffer();

      // 3. Determine new names
      const oldKey = image.s3Key;
      const newKey = oldKey.includes(".") ? oldKey.split(".").slice(0, -1).join(".") + ".webp" : oldKey + ".webp";
      const oldOriginalName = image.originalName;
      const newOriginalName = oldOriginalName.includes(".") ? oldOriginalName.split(".").slice(0, -1).join(".") + ".webp" : oldOriginalName + ".webp";

      // 4. Upload to S3
      console.log(`Uploading to ${newKey}...`);
      await s3Client.send(
        new PutObjectCommand({
          Bucket: s3BucketName,
          Key: newKey,
          Body: webpBuffer,
          ContentType: "image/webp",
        })
      );

      // 5. Update MongoDB
      console.log(`Updating DB record for ${newOriginalName}...`);
      image.s3Key = newKey;
      image.originalName = newOriginalName;
      image.mimeType = "image/webp";
      image.size = webpBuffer.length;
      await image.save();

      // 6. Delete old file from S3
      console.log(`Deleting old file ${oldKey} from S3...`);
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: s3BucketName,
          Key: oldKey,
        })
      );

      console.log(`Successfully migrated ${oldOriginalName} to WebP.`);
    } catch (err) {
      console.error(`Error processing ${image.s3Key}:`, err);
    }
  }

  console.log("Migration complete.");
  process.exit(0);
}

run().then(() => {});
