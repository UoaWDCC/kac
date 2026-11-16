import { Content } from "../model/content";

export const DIGITAL_CARD_LINK_CONTENT_ID = "digital-card-link";

export async function getDigitalCardLink(): Promise<string | null> {
  const content = await Content.findById(DIGITAL_CARD_LINK_CONTENT_ID).lean();
  const link = content?.content?.trim();

  return link || null;
}
