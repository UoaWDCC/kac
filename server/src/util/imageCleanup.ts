import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Image } from "../model/image";
import { s3Client } from "../config/aws";

// Deletes every image stored under a given tag from S3 and Mongo.
// Returns how many S3 deletions failed; those Mongo records are kept so a retry can clean them up later.
export const deleteImagesByTag = async (tag: string): Promise<number> => {
  const images = await Image.find({ tag }).lean();
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
      console.error("Failed to delete image from S3:", error);
    }
  }

  if (deletedImageIds.length > 0) {
    await Image.deleteMany({ _id: { $in: deletedImageIds } });
  }

  return failedDeletes;
};
