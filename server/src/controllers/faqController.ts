import { RequestHandler } from "express";
import { Faq } from "../model/faq";

const CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 7;

let faqCache: { data: unknown[]; expiresAt: number } | null = null;
let faqCacheStale = false;

const markFaqCacheStale = () => {
  faqCacheStale = true;
};

export const getFaqs: RequestHandler = async (req, res) => {
  try {
    if (faqCache && !faqCacheStale && Date.now() < faqCache.expiresAt) {
      res.json(faqCache.data);
      return;
    }
    const faqs = await Faq.find().lean();
    faqCache = { data: faqs, expiresAt: Date.now() + CACHE_TTL_MS };
    faqCacheStale = false;
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};

export const createFaq: RequestHandler = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    markFaqCacheStale();
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
    markFaqCacheStale();
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
    markFaqCacheStale();
    res.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Error deleting FAQ: ", error);
    res.status(500).json({ message: "Failed to delete FAQ" });
  }
};

export const deleteAllFaqs: RequestHandler = async(req, res) => {
  try {
    const result = await Faq.deleteMany({});
    markFaqCacheStale();
    res.json({message: "All FAQs deleted successfully", deletedCount: result.deletedCount });
  } catch (error) {
    console.error("Error deleting all FAQs: ", error);
    res.status(500).json({message: "Failed to delete all FAQs"});
  }
};
