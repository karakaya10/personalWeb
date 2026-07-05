"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { socialLinkSchema } from "@/lib/validation";

export type SocialLinkFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function saveSocialLink(
  _prevState: SocialLinkFormState,
  formData: FormData,
): Promise<SocialLinkFormState> {
  await requireAdminSession();

  const id = formData.get("id");
  const parsed = socialLinkSchema.safeParse({
    platform: formData.get("platform"),
    url: formData.get("url"),
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
    await prisma.socialLink.update({ where: { id }, data: parsed.data });
  } else {
    await prisma.socialLink.create({ data: parsed.data });
  }

  revalidatePath("/");
  revalidatePath("/admin/social");

  return { status: "success", message: `Link ${id ? "updated" : "created"}.` };
}

export async function deleteSocialLink(id: string) {
  await requireAdminSession();
  await prisma.socialLink.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/social");
}
