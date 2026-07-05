"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

export async function setMessageRead(id: string, read: boolean) {
  await requireAdminSession();
  await prisma.message.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireAdminSession();
  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
