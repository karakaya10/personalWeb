import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { Skill } from "@/generated/prisma/client";

export function SkillsSection({ skills }: { skills: Skill[] }) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <SectionHeading number="02" title="Skills" />
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((category, i) => (
          <Reveal key={category} delay={i * 0.06}>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="mb-4 font-mono text-sm font-semibold text-brand">{category}</h3>
              <ul className="flex flex-col gap-4">
                {skills
                  .filter((s) => s.category === category)
                  .map((skill) => (
                    <li key={skill.id}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-foreground">{skill.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
