"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { profileSchema } from "@/lib/validation";

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[] | undefined>;
};

export async function updateProfile(
  _prevState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  await requireAdminSession();

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
    title: formData.get("title"),
    tagline: formData.get("tagline"),
    bio: formData.get("bio"),
    location: formData.get("location"),
    email: formData.get("email"),
    resumeUrl: formData.get("resumeUrl"),
    avatarUrl: formData.get("avatarUrl"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.profile.upsert({
    where: { id: "profile" },
    create: { id: "profile", ...parsed.data },
    update: { ...parsed.data },
  });

  revalidatePath("/");
  revalidatePath("/admin/profile");

  return { status: "success", message: "Profile updated." };
}
