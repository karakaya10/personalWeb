import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getProfile = cache(async () => {
  return prisma.profile.findUnique({ where: { id: "profile" } });
});

export const getSocialLinks = cache(async () => {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
});

export const getSkills = cache(async () => {
  return prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
});

export const getProjects = cache(async () => {
  return prisma.project.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
});

export const getExperience = cache(async () => {
  return prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
});

export const getUnreadMessageCount = cache(async () => {
  return prisma.message.count({ where: { read: false } });
});
