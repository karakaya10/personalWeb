"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation";
import { createSession, destroySession } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request";

export type LoginFormState = {
  error?: string;
};

export async function login(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`login:${ip}`);
  if (!allowed) {
    return { error: "Too many login attempts. Please try again in a few minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  // Generic error message: never reveal which field was wrong.
  const genericError = "Invalid email or password.";

  if (!parsed.success) {
    return { error: genericError };
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email },
  });

  if (!admin) {
    // Run a hash comparison anyway to keep response time consistent
    // regardless of whether the account exists.
    await bcrypt.compare(
      parsed.data.password,
      "$2b$12$EFK..2gakXJNtnvXWZ.1geRoIHdURskyvfgOe5dEfF6QroNwbUCeW",
    );
    return { error: genericError };
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!passwordMatches) {
    return { error: genericError };
  }

  await createSession({ adminId: admin.id, email: admin.email });
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
