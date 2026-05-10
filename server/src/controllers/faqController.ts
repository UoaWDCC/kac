import { RequestHandler } from "express";
import { Faq } from "../model/faq";

const CACHE_TTL_MS = 60 * 60 * 1000;

let faqCache: { data: unknown[]; expiresAt: number } | null = null;

export const getFaqs: RequestHandler = async (req, res) => {
  try {
    if (faqCache && Date.now() < faqCache.expiresAt) {
      res.json(faqCache.data);
      return;
    }
    const faqs = await Faq.find().lean();
    faqCache = { data: faqs, expiresAt: Date.now() + CACHE_TTL_MS };
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

export const createFaq: RequestHandler = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ message: "Failed to create FAQ" });
  }
};

export const updateFaq: RequestHandler = async (req, res) => {
  try {
    const updated = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    }).lean();
    if (!updated) {
      res.status(404).json({ message: "FAQ not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Error updating FAQ: ", error);
    res.status(500).json({ message: "Failed to update FAQ" });
  }
};

export const deleteFaq: RequestHandler = async (req, res) => {
  try {
    const deleted = await Faq.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "FAQ not found" });
      return;
    }
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ: ", error);
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
};
