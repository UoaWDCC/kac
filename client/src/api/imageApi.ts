import api from "./index";

export function getImageByTag(tag: string) {
  const res = api.get(`/images/tag/${encodeURIComponent(tag)}`);
  return res.then((response) => response.data);
}

export function postImage(file: File, tag: string, galleryKey?: string | null) {
  const formData = new FormData();
  formData.append("image", file);
  if (tag) {
    formData.append("tag", tag);
  }
  if (galleryKey) {
    formData.append("galleryKey", galleryKey);
  }

  const res = api.post("/images", formData);
  return res.then((response) => response.data);
}
