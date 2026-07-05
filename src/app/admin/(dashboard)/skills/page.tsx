import { prisma } from "@/lib/prisma";
import { SkillsManager } from "@/components/admin/skills-manager";

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Skills</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Grouped by category and shown with a proficiency level on your public site.
      </p>
      <SkillsManager skills={skills} />
    </div>
  );
}
