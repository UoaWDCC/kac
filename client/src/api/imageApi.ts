import api from "./index";

const imageCacheTtlMs = 14 * 60 * 1000;

type CacheEntry<T> = {
  data?: T;
  expiresAt: number;
  promise?: Promise<T>;
};

const imageCache = new Map<string, CacheEntry<unknown>>();

function getCachedImage<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const cached = imageCache.get(key) as CacheEntry<T> | undefined;

  if (cached?.data !== undefined && cached.expiresAt > now) {
    return Promise.resolve(cached.data);
  }

  if (cached?.promise) {
    return cached.promise;
  }

  const promise = fetcher()
    .then((data) => {
      imageCache.set(key, {
        data,
        expiresAt: Date.now() + imageCacheTtlMs,
      });

      return data;
    })
    .catch((error) => {
      imageCache.delete(key);
      throw error;
    });

  imageCache.set(key, {
    expiresAt: now + imageCacheTtlMs,
    promise,
  });

  return promise;
}

export function invalidateImageByTag(tag: string) {
  imageCache.delete(`image:tag:${tag}`);
}

export function refreshImageByTag(tag: string) {
  invalidateImageByTag(tag);
  return getImageByTag(tag);
}

export function getImageByTag(tag: string) {
  return getCachedImage(`image:tag:${tag}`, () => {
    const res = api.get(`/images/tag/${encodeURIComponent(tag)}`);
    return res.then((response) => response.data);
  });
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
  return res.then((response) => {
    invalidateImageByTag(tag);
    return response.data;
  });
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
