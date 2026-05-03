import { RequestHandler } from "express";
import { Faq } from "../model/faq";

export const listFaqs: RequestHandler = async (req, res) => {
  try {
    const faqs = await Faq.find().lean();
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ message: "Failed to fetch FAQs" });
  }
};
