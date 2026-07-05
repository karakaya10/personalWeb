import { format } from "date-fns";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import type { Experience } from "@/generated/prisma/client";

function formatRange(start: Date, end: Date | null) {
  const startLabel = format(start, "MMM yyyy");
  const endLabel = end ? format(end, "MMM yyyy") : "Present";
  return `${startLabel} — ${endLabel}`;
}

export function ExperienceSection({ experience }: { experience: Experience[] }) {
  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <SectionHeading number="04" title="Experience" />
      </Reveal>
      <ol className="relative flex flex-col gap-10 border-l border-border pl-8">
        {experience.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.06}>
            <li className="relative">
              <span className="absolute top-1.5 -left-[2.28rem] size-3 rounded-full border-2 border-brand bg-background" />
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {item.role} <span className="text-brand">@ {item.company}</span>
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatRange(item.startDate, item.endDate)}
                </span>
              </div>
              {item.location ? (
                <p className="mb-2 text-xs text-muted-foreground">{item.location}</p>
              ) : null}
              <p className="leading-relaxed text-muted-foreground">{item.description}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
