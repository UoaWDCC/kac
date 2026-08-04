import { RequestHandler } from "express";
import { Content } from "../model/content";

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

let contentCache: Record<string, { data: any; ts: number }> = {};

export const getContent: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);

    const cached = contentCache[id];
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      res.json(cached.data);
      return;
    }

    const contents = await Content.findById(id).lean();

    if (!contents) {
      res.status(404).json({ message: "Content not found" });
      return;
    }

    contentCache[id] = { data: contents, ts: Date.now() };
    res.json(contents);
  } catch (error) {
    console.error("Error fetching contents:", error);
    res.status(500).json({ message: "Failed to fetch contents" });
  }
};

export const createContent: RequestHandler = async (req, res) => {
  try {
    const content = await Content.create(req.body);
    res.status(201).json(content);
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({ message: "Failed to create content" });
  }
};

export const updateContent: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);
    const updated = await Content.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    }).lean();
    if (!updated) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    contentCache[id] = { data: updated, ts: Date.now() };
    res.json(updated);
  } catch (error) {
    console.error("Error updating content: ", error);
    res.status(500).json({ message: "Failed to update content" });
  }
};

export const deleteContent: RequestHandler = async (req, res) => {
  try {
    const id = String(req.params.id);
    const deleted = await Content.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    delete contentCache[id];
    res.json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content: ", error);
    res.status(500).json({ message: "Failed to delete content" });
  }
};
