// api/imageApi.ts
import axios from "axios";

export async function fetchImageByTag(tag: string) {
  try {
    const res = await axios.get(`/api/images/tag/${encodeURIComponent(tag)}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Fetch image error status:", error.response?.status);
      console.error("Fetch image error data:", error.response?.data);
    }

    throw new Error("Failed to fetch image");
  }
}

export async function uploadImage(file: File, tag: string) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("tag", tag);

  try {
    const res = await axios.post("/api/images", formData);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Upload error status:", error.response?.status);
      console.error("Upload error data:", error.response?.data);
      console.error("Upload raw error:", error);

      throw new Error(
        error.response?.data?.message ||
          error.message ||
          "Upload failed at server"
      );
    }

    throw new Error("Upload failed");
  }
}
