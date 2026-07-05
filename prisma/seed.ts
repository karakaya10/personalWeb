import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });

  await prisma.profile.upsert({
    where: { id: "profile" },
    update: {},
    create: {
      id: "profile",
      fullName: "Samet Karakaya",
      title: "Full Stack Developer",
      tagline: "I build fast, accessible, and reliable web products.",
      bio: "Full stack developer focused on TypeScript, React, and Node.js. I enjoy turning complex problems into simple, well-tested software, from database schema to pixel-perfect UI. Currently exploring modern web architecture, developer tooling, and performance engineering.",
      location: "Istanbul, Turkiye",
      email: "karakayasamet997@gmail.com",
      resumeUrl: "/resume.pdf",
      avatarUrl: null,
    },
  });

  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "github", url: "https://github.com/sametkarakaya", order: 0 },
      { platform: "linkedin", url: "https://linkedin.com/in/sametkarakaya", order: 1 },
      { platform: "email", url: "mailto:karakayasamet997@gmail.com", order: 2 },
      { platform: "x", url: "https://x.com/sametkarakaya", order: 3 },
    ],
  });

  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      { name: "TypeScript", category: "Languages", level: 92, order: 0 },
      { name: "JavaScript", category: "Languages", level: 95, order: 1 },
      { name: "Python", category: "Languages", level: 78, order: 2 },
      { name: "React", category: "Frontend", level: 93, order: 3 },
      { name: "Next.js", category: "Frontend", level: 90, order: 4 },
      { name: "Tailwind CSS", category: "Frontend", level: 88, order: 5 },
      { name: "Node.js", category: "Backend", level: 88, order: 6 },
      { name: "PostgreSQL", category: "Backend", level: 82, order: 7 },
      { name: "Prisma", category: "Backend", level: 85, order: 8 },
      { name: "Docker", category: "DevOps", level: 75, order: 9 },
      { name: "AWS", category: "DevOps", level: 68, order: 10 },
      { name: "Git", category: "Tools", level: 90, order: 11 },
    ],
  });

  await prisma.project.deleteMany();
  await prisma.project.createMany({
    data: [
      {
        title: "DevMetrics",
        description:
          "A real-time analytics dashboard for engineering teams, aggregating CI/CD, deployment, and incident data into a single view. Built with Next.js, WebSockets, and PostgreSQL.",
        githubUrl: "https://github.com/sametkarakaya/devmetrics",
        liveUrl: "https://devmetrics.example.com",
        tags: "Next.js,TypeScript,PostgreSQL,WebSockets",
        featured: true,
        order: 0,
      },
      {
        title: "Taskflow API",
        description:
          "A production-style task management REST/GraphQL API with role-based access control, background job processing, and full test coverage.",
        githubUrl: "https://github.com/sametkarakaya/taskflow-api",
        liveUrl: null,
        tags: "Node.js,GraphQL,Redis,Docker",
        featured: true,
        order: 1,
      },
      {
        title: "Shelfie",
        description:
          "A minimalist personal library and reading tracker with offline-first support and a clean, animated mobile UI.",
        githubUrl: "https://github.com/sametkarakaya/shelfie",
        liveUrl: "https://shelfie.example.com",
        tags: "React Native,SQLite,Expo",
        featured: false,
        order: 2,
      },
      {
        title: "This Portfolio",
        description:
          "This very site: a modern personal portfolio with a custom-built admin panel for managing content, powered by Next.js, Prisma, and a hand-rolled secure auth layer.",
        githubUrl: "https://github.com/sametkarakaya/personal-website",
        liveUrl: null,
        tags: "Next.js,TypeScript,Prisma,Tailwind CSS",
        featured: true,
        order: 3,
      },
    ],
  });

  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: "Nimbus Software",
        role: "Full Stack Developer",
        description:
          "Led development of internal tooling and customer-facing dashboards. Migrated legacy services to a modern Next.js + Prisma stack, cutting page load times by 40%.",
        location: "Istanbul, Turkiye (Hybrid)",
        startDate: new Date("2023-03-01"),
        endDate: null,
        order: 0,
      },
      {
        company: "Vertex Labs",
        role: "Backend Developer",
        description:
          "Built and maintained REST APIs serving mobile and web clients. Improved test coverage from 30% to 85% and introduced CI/CD pipelines with automated deployments.",
        location: "Remote",
        startDate: new Date("2021-06-01"),
        endDate: new Date("2023-02-28"),
        order: 1,
      },
      {
        company: "Freelance",
        role: "Web Developer",
        description:
          "Delivered small business websites and internal tools for local clients, handling everything from design to deployment.",
        location: "Remote",
        startDate: new Date("2020-01-01"),
        endDate: new Date("2021-05-31"),
        order: 2,
      },
    ],
  });

  console.log("Seed complete.");
  console.log(`Admin login -> email: ${adminEmail} / password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
