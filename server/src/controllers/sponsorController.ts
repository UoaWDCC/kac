import mongoose from "mongoose";
import { RequestHandler } from "express";
import { Sponsor } from "../model/sponsors";
import { deleteImagesByTag } from "../util/imageCleanup";

const sponsorCategories = ["cbd", "newmarket", "other"] as const;

type SponsorInput = {
  name: string;
  description: string;
  category: (typeof sponsorCategories)[number];
};

const isSponsorCategory = (value: string): value is SponsorInput["category"] =>
  sponsorCategories.includes(value as SponsorInput["category"]);

const sponsorImageTag = (name: string) =>
  `sponsor-${name.toLowerCase().replace(/\s+/g, "-")}`;

const validateSponsorInput = (
  body: unknown,
  partial = false
): { data: Partial<SponsorInput>; errors: string[] } => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { data: {}, errors: ["Sponsor data must be an object."] };
  }

  const input = body as Record<string, unknown>;
  const data: Partial<SponsorInput> = {};
  const errors: string[] = [];

  for (const field of ["name", "description", "category"] as const) {
    if (!(field in input)) {
      if (!partial) errors.push(`${field} is required.`);
      continue;
    }

    const value = input[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors.push(`${field} must not be blank.`);
      continue;
    }

    const trimmedValue = value.trim();
    if (field === "category") {
      if (!isSponsorCategory(trimmedValue)) {
        errors.push("category must be cbd, newmarket, or other.");
        continue;
      }
      data.category = trimmedValue;
    } else {
      data[field] = trimmedValue;
    }
  }

  if (partial && Object.keys(data).length === 0 && errors.length === 0) {
    errors.push("At least one sponsor field must be provided.");
  }

  return { data, errors };
};

const sendSponsorError = (
  res: Parameters<RequestHandler>[1],
  operation: string,
  error: unknown
) => {
  console.error(`Error ${operation} sponsor:`, error);

  if (error instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(error.errors).map(({ message }) => message);
    res.status(400).json({ message: errors.join(" "), errors });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: "Invalid sponsor ID." });
    return;
  }

  res.status(500).json({ message: `Failed to ${operation} sponsor.` });
};

const sendInputErrors = (
  res: Parameters<RequestHandler>[1],
  errors: string[]
) => {
  res.status(400).json({
    message: errors.join(" "),
    errors,
  });
};

export const createSponsor: RequestHandler = async (req, res) => {
  const { data, errors } = validateSponsorInput(req.body);
  if (errors.length > 0) {
    sendInputErrors(res, errors);
    return;
  }

  try {
    const sponsor = await Sponsor.create(data);
    res.status(201).json(sponsor);
  } catch (error) {
    sendSponsorError(res, "creating", error);
  }
};

export const getSponsors: RequestHandler = async (_req, res) => {
  try {
    const sponsors = await Sponsor.find().lean();
    res.status(200).json(sponsors);
  } catch (error) {
    sendSponsorError(res, "fetching", error);
  }
};

export const updateSponsor: RequestHandler = async (req, res) => {
  const { data, errors } = validateSponsorInput(req.body, true);
  if (errors.length > 0) {
    sendInputErrors(res, errors);
    return;
  }

  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, data, {
      returnDocument: "after",
      runValidators: true,
    }).lean();

    if (!sponsor) {
      res.status(404).json({ message: "Sponsor not found." });
      return;
    }

    res.status(200).json(sponsor);
  } catch (error) {
    sendSponsorError(res, "updating", error);
  }
};

export const deleteSponsor: RequestHandler = async (req, res) => {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) {
      res.status(404).json({ message: "Sponsor not found." });
      return;
    }

    const failedImageDeletes = await deleteImagesByTag(
      sponsorImageTag(sponsor.name)
    );

    res.status(200).json({
      message: "Sponsor deleted successfully.",
      imageCleanupWarning:
        failedImageDeletes > 0
          ? `${failedImageDeletes} image(s) could not be deleted from storage.`
          : undefined,
    });
  } catch (error) {
    sendSponsorError(res, "deleting", error);
  }
};
