"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { projectSchema } from "@/lib/validation";

export type ProjectFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function saveProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdminSession();

  const id = formData.get("id");
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    githubUrl: formData.get("githubUrl"),
    liveUrl: formData.get("liveUrl"),
    tags: formData.get("tags"),
    featured: formData.get("featured") === "on",
    order: formData.get("order"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = {
    ...parsed.data,
    imageUrl: parsed.data.imageUrl || null,
    githubUrl: parsed.data.githubUrl || null,
    liveUrl: parsed.data.liveUrl || null,
  };

  if (typeof id === "string" && id) {
    await prisma.project.update({ where: { id }, data });
  } else {
    await prisma.project.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/admin/projects");

  return { status: "success", message: `Project ${id ? "updated" : "created"}.` };
}

export async function deleteProject(id: string) {
  await requireAdminSession();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/projects");
}
