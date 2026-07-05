"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { skillSchema } from "@/lib/validation";

export type SkillFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function saveSkill(
  _prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  await requireAdminSession();

  const id = formData.get("id");
  const parsed = skillSchema.safeParse({
    name: formData.get("name"),
    category: formData.get("category"),
    level: formData.get("level"),
    order: formData.get("order"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  if (typeof id === "string" && id) {
    await prisma.skill.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.skill.create({ data: parsed.data });
  }

  revalidatePath("/");
  revalidatePath("/admin/skills");

  return { status: "success", message: `Skill ${id ? "updated" : "created"}.` };
}

export async function deleteSkill(id: string) {
  await requireAdminSession();
  await prisma.skill.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/skills");
}
