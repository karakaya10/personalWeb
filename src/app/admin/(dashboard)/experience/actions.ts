"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { experienceSchema } from "@/lib/validation";

export type ExperienceFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function saveExperience(
  _prevState: ExperienceFormState,
  formData: FormData,
): Promise<ExperienceFormState> {
  await requireAdminSession();

  const id = formData.get("id");
  const parsed = experienceSchema.safeParse({
    company: formData.get("company"),
    role: formData.get("role"),
    description: formData.get("description"),
    location: formData.get("location"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    order: formData.get("order"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const startDate = new Date(parsed.data.startDate);
  const endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : null;

  if (Number.isNaN(startDate.getTime()) || (endDate && Number.isNaN(endDate.getTime()))) {
    return { status: "error", message: "Please provide valid dates." };
  }

  const data = {
    company: parsed.data.company,
    role: parsed.data.role,
    description: parsed.data.description,
    location: parsed.data.location || null,
    startDate,
    endDate,
    order: parsed.data.order,
  };

  if (typeof id === "string" && id) {
    await prisma.experience.update({ where: { id }, data });
  } else {
    await prisma.experience.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/experience");

  return { status: "success", message: `Experience ${id ? "updated" : "created"}.` };
}

export async function deleteExperience(id: string) {
  await requireAdminSession();
  await prisma.experience.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/experience");
}
