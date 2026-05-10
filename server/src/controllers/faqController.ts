import { RequestHandler } from "express";
import { Faq } from "../model/faq";

const CACHE_TTL_MS = 60 * 60 * 1000

let faqCache: { data: unknown[]; expiresAt: number} | null = null

export const listFaqs: RequestHandler = async (req, res) => {
  try {
    if (faqCache && Date.now() < faqCache.expiresAt) {
      res.json(faqCache.data);
      return;
    }
    const faqs = await Faq.find().lean();
    faqCache = { data: faqs, expiresAt: Date.now() + CACHE_TTL_MS};
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};
