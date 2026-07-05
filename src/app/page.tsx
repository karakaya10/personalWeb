import {
  getProfile,
  getSocialLinks,
  getSkills,
  getProjects,
  getExperience,
} from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { SkillsSection } from "@/components/skills-section";
import { ProjectsSection } from "@/components/projects-section";
import { ExperienceSection } from "@/components/experience-section";
import { ContactSection } from "@/components/contact-section";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, socialLinks, skills, projects, experience] = await Promise.all([
    getProfile(),
    getSocialLinks(),
    getSkills(),
    getProjects(),
    getExperience(),
  ]);

  if (!profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-semibold">No profile data yet</h1>
        <p className="max-w-md text-muted-foreground">
          Run <code className="font-mono">npm run db:seed</code> or sign in to{" "}
          <a href="/admin/login" className="text-brand hover:underline">
            /admin
          </a>{" "}
          to add your profile information.
        </p>
      </main>
    );
  }

  return (
    <>
      <SiteHeader fullName={profile.fullName} />
      <main>
        <HeroSection
          fullName={profile.fullName}
          title={profile.title}
          tagline={profile.tagline}
          resumeUrl={profile.resumeUrl}
          socialLinks={socialLinks}
        />
        <AboutSection bio={profile.bio} location={profile.location} email={profile.email} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experience={experience} />
        <ContactSection email={profile.email} />
      </main>
      <SiteFooter fullName={profile.fullName} />
    </>
  );
}
