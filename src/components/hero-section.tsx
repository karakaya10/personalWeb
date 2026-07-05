"use client";

import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialIcon, platformLabel } from "@/components/social-icon";
import type { SocialLink } from "@/generated/prisma/client";

export function HeroSection({
  fullName,
  title,
  tagline,
  resumeUrl,
  socialLinks,
}: {
  fullName: string;
  title: string;
  tagline: string;
  resumeUrl: string | null;
  socialLinks: SocialLink[];
}) {
  return (
    <section
      id="top"
      className="relative flex min-h-[92vh] flex-col items-start justify-center overflow-hidden px-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_oklch,var(--brand)_18%,transparent),transparent)]"
      />
      <div className="mx-auto w-full max-w-5xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono text-sm text-brand"
        >
          Hi, my name is
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
        >
          {fullName}
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-2 text-2xl font-semibold text-muted-foreground sm:text-4xl"
        >
          {title}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mt-6 max-w-xl text-lg text-muted-foreground"
        >
          {tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button
            size="lg"
            className="bg-brand text-brand-foreground hover:bg-brand/90"
            nativeButton={false}
            render={<a href="#projects">View my work</a>}
          />
          {resumeUrl ? (
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={
                <a href={resumeUrl} download>
                  <Download className="size-4" />
                  Download CV
                </a>
              }
            />
          ) : null}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 flex items-center gap-5"
        >
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target={link.platform === "email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={platformLabel(link.platform)}
              className="text-muted-foreground transition-colors hover:text-brand"
            >
              <SocialIcon platform={link.platform} className="size-5" />
            </a>
          ))}
        </motion.div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to about section"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-brand"
      >
        <ArrowDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
