import { prisma } from "@/lib/prisma";
import { SocialManager } from "@/components/admin/social-manager";

export default async function AdminSocialPage() {
  const links = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Social Links</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Shown in the hero section and footer of your public site.
      </p>
      <SocialManager links={links} />
    </div>
  );
}
