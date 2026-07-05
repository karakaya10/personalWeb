import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { decryptSession, getSessionToken } from "@/lib/session";

export const verifySession = cache(async () => {
  const token = await getSessionToken();
  const session = await decryptSession(token);

  if (!session) {
    return null;
  }

  return session;
});

export async function requireAdminSession() {
  const session = await verifySession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
