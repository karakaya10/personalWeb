import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/admin/profile-form";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findUnique({ where: { id: "profile" } });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Profile</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        This information powers the hero and about sections on your public site.
      </p>
      <ProfileForm profile={profile} />
    </div>
  );
}
