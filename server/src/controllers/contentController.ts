import { RequestHandler } from "express";
import { Content } from "../model/content";

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

let contentCache: { data: unknown[]; expiresAt: number } | null = null;
let contentCacheStale = false;

const markContentCacheStale = () => {
  contentCacheStale = true;
};

export const getContents: RequestHandler = async (req, res) => {
  try {
    if (
      contentCache &&
      !contentCacheStale &&
      Date.now() < contentCache.expiresAt
    ) {
      res.json(contentCache.data);
      return;
    }
    const contents = await Content.find().lean();
    contentCache = { data: contents, expiresAt: Date.now() + CACHE_TTL_MS };
    contentCacheStale = false;
    res.json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ message: "Failed to fetch contents" });
  }
};

export const createContent: RequestHandler = async (req, res) => {
  try {
    const content = await Content.create(req.body);
    markContentCacheStale();
    res.status(201).json(content);
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Failed to create content" });
  }
};

export const updateContent: RequestHandler = async (req, res) => {
  try {
    const updated = await Content.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    }).lean();
    if (!updated) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    markContentCacheStale();
    res.json(updated);
  } catch (error) {
    console.error("Error updating content: ", error);
    res.status(500).json({ message: "Failed to update content" });
  }
};

export const deleteContent: RequestHandler = async (req, res) => {
  try {
    const deleted = await Content.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    markContentCacheStale();
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content: ", error);
    res.status(500).json({ message: "Failed to delete content" });
  }
};

export const deleteAllContents: RequestHandler = async (req, res) => {
  try {
    const result = await Content.deleteMany({});
    markContentCacheStale();
    res.json({
      message: "All contents deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting all contents: ", error);
    res.status(500).json({ message: "Failed to delete all contents" });
  }
};
