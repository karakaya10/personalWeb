"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string[]>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`contact:${ip}`);
  if (!allowed) {
    return { status: "error", message: "Too many submissions. Please try again later." };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot triggered: silently pretend success so bots don't learn.
  if (parsed.data.company) {
    return { status: "success", message: "Thanks! Your message has been sent." };
  }

  await prisma.message.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    },
  });

  return { status: "success", message: "Thanks! Your message has been sent." };
}
