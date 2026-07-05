import { ExternalLink, FolderGit2 } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { GithubGlyph } from "@/components/social-icon";
import type { Project } from "@/generated/prisma/client";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <Reveal>
        <SectionHeading number="03" title="Projects" />
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.06}>
            <article className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-brand/50">
              <div className="mb-4 flex items-center justify-between">
                <FolderGit2 className="size-8 text-brand" />
                <div className="flex items-center gap-3 text-muted-foreground">
                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} on GitHub`}
                      className="transition-colors hover:text-brand"
                    >
                      <GithubGlyph className="size-5" />
                    </a>
                  ) : null}
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} live demo`}
                      className="transition-colors hover:text-brand"
                    >
                      <ExternalLink className="size-5" />
                    </a>
                  ) : null}
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-brand">
                {project.title}
                {project.featured ? (
                  <Badge variant="secondary" className="ml-2 align-middle">
                    Featured
                  </Badge>
                ) : null}
              </h3>
              <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
                {project.tags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
