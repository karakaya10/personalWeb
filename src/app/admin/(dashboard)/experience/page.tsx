import { prisma } from "@/lib/prisma";
import { ExperienceManager } from "@/components/admin/experience-manager";

export default async function AdminExperiencePage() {
  const experience = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Experience</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Your work history, shown as a timeline on your public site.
      </p>
      <ExperienceManager experience={experience} />
    </div>
  );
}
