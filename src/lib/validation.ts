import { z } from "zod";

// FormData.get() returns null for fields absent from the form; treat that
// the same as an empty string for optional text fields.
function optionalText(max: number) {
  return z.preprocess((v) => v ?? "", z.string().trim().max(max));
}

// Blocks javascript:/data:/vbscript: etc. so a stored URL can never turn into
// a click-triggered script (these fields are rendered back out as href/src).
const DANGEROUS_URL_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
function isSafeUrl(value: string) {
  if (!value) return true;
  if (value.startsWith("/") || value.startsWith("#")) return true;
  if (/^https?:\/\//i.test(value) || /^mailto:/i.test(value)) return true;
  return !DANGEROUS_URL_SCHEME.test(value);
}

function optionalUrl(max: number) {
  return optionalText(max).refine(isSafeUrl, { error: "Enter a valid URL." });
}

function requiredUrl(max: number) {
  return z
    .string()
    .trim()
    .min(1)
    .max(max)
    .refine(isSafeUrl, { error: "Enter a valid URL." });
}

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email." }).trim(),
  password: z.string().min(1, { error: "Password is required." }),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, { error: "Name must be at least 2 characters." }).max(120),
  email: z.email({ error: "Enter a valid email." }).trim().max(200),
  message: z
    .string()
    .trim()
    .min(10, { error: "Message must be at least 10 characters." })
    .max(4000),
  // Honeypot field: real users never fill this; bots typically do.
  company: z.string().max(0).optional().or(z.literal("")),
});

export const profileSchema = z.object({
  fullName: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  tagline: z.string().trim().min(1).max(240),
  bio: z.string().trim().min(1).max(4000),
  location: z.string().trim().min(1).max(160),
  email: z.email().trim().max(200),
  resumeUrl: optionalUrl(500),
  avatarUrl: optionalUrl(500),
});

export const socialLinkSchema = z.object({
  platform: z.enum(["github", "linkedin", "x", "email", "website", "other"]),
  url: requiredUrl(500),
  order: z.coerce.number().int().min(0).max(1000).default(0),
});

export const skillSchema = z.object({
  name: z.string().trim().min(1).max(80),
  category: z.string().trim().min(1).max(80),
  level: z.coerce.number().int().min(0).max(100).default(80),
  order: z.coerce.number().int().min(0).max(1000).default(0),
});

export const projectSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(2000),
  imageUrl: optionalUrl(500),
  githubUrl: optionalUrl(500),
  liveUrl: optionalUrl(500),
  tags: z.string().trim().max(300),
  featured: z.coerce.boolean().default(false),
  order: z.coerce.number().int().min(0).max(1000).default(0),
});

export const experienceSchema = z.object({
  company: z.string().trim().min(1).max(160),
  role: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(2000),
  location: optionalText(160),
  startDate: z.string().trim().min(1),
  endDate: optionalText(40),
  order: z.coerce.number().int().min(0).max(1000).default(0),
});
