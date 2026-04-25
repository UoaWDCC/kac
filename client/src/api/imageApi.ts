// api/imageApi.ts
export async function fetchImage(imageId: string) {
    const res = await fetch(`/api/images/${imageId}`);  // GET /api/images/:id
    if (!res.ok) throw new Error("Failed to fetch image");
    return res.json();
}

export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/images", { method: "POST", body: formData });  // POST /api/images/
    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "Upload failed");
    }
    return res.json();
}