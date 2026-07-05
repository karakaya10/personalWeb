import Link from "next/link";
import { Sparkles, FolderGit2, Briefcase, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const [skillCount, projectCount, experienceCount, unreadCount, totalMessages] =
    await Promise.all([
      prisma.skill.count(),
      prisma.project.count(),
      prisma.experience.count(),
      prisma.message.count({ where: { read: false } }),
      prisma.message.count(),
    ]);

  const stats = [
    { label: "Skills", value: skillCount, icon: Sparkles, href: "/admin/skills" },
    { label: "Projects", value: projectCount, icon: FolderGit2, href: "/admin/projects" },
    { label: "Experience entries", value: experienceCount, icon: Briefcase, href: "/admin/experience" },
    {
      label: "Unread messages",
      value: unreadCount,
      sub: `${totalMessages} total`,
      icon: Mail,
      href: "/admin/messages",
    },
  ];

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Dashboard</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Overview of your portfolio content.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-colors hover:border-brand/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-4 text-brand" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.sub ? (
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                ) : null}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
