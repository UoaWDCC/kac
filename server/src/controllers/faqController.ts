import { RequestHandler } from "express";
import { Faq } from "../model/faq";

export const listFaqs: RequestHandler = async (requestAnimationFrame, res) => {
    const faqs = await Faq.find().lean();
    res.json(faqs);
}