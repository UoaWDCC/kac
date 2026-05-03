// api/imageApi.ts
export async function fetchImageByTag(tag: string) {
  const res = await fetch(`/api/images/tag/${tag}`);
  if (!res.ok) throw new Error("Failed to fetch image");
  return res.json(); // { id, signedUrl, originalName } or { signedUrl: null }
}

export async function uploadImage(file: File, tag: string) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("tag", tag); // send tag with upload
  const res = await fetch("/api/images", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json();
    throw new Error(body.message || "Upload failed");
  }
  return res.json();
}
