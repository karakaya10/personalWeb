import { prisma } from "@/lib/prisma";
import { ProjectsManager } from "@/components/admin/projects-manager";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Projects</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Showcase featured work with GitHub and live demo links.
      </p>
      <ProjectsManager projects={projects} />
    </div>
  );
}
