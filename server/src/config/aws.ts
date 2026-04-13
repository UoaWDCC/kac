import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const region = process.env.AWS_REGION;

if (!region) {
  throw new Error("AWS_REGION is required");
}

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are required");
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const s3BucketName = process.env.S3_BUCKET_NAME;

if (!s3BucketName) {
  throw new Error("S3_BUCKET_NAME is required");
}

console.log(`S3 client connected — region: ${region}, bucket: ${s3BucketName}`);