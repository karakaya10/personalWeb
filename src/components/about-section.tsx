import { MapPin, Mail } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";

export function AboutSection({
  bio,
  location,
  email,
}: {
  bio: string;
  location: string;
  email: string;
}) {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <SectionHeading number="01" title="About Me" />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="grid gap-10 md:grid-cols-3">
          <p className="text-balance leading-relaxed text-muted-foreground md:col-span-2">
            {bio}
          </p>
          <div className="flex flex-col gap-3 font-mono text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-brand" />
              {location}
            </div>
            <div className="flex items-center gap-2">
              <Mail className="size-4 text-brand" />
              <a href={`mailto:${email}`} className="hover:text-brand">
                {email}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
