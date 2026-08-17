import api from "./index";

export function getImageByTag(tag: string) {
  const res = api.get(`/images/tag/${encodeURIComponent(tag)}`);
  return res.then((response) => response.data);
}

export function getGalleryImages(tag: string, year: number) {
  const res = api.get("/images/gallery", { params: { tag, year } });
  return res.then((response) => response.data);
}

export function postImage(file: File, tag: string, galleryKey = false) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("tag", tag);
  formData.append("galleryKey", String(galleryKey));

  const res = api.post("/images", formData);
  return res.then((response) => response.data);
}

export function getCurrentProfileImage() {
  const res = api.get("/images/profile/me");
  return res.then((response) => response.data);
}

export function postCurrentProfileImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const res = api.post("/images/profile/me", formData);
  return res.then((response) => response.data);
}
