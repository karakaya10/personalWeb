import { prisma } from "@/lib/prisma";
import { MessagesManager } from "@/components/admin/messages-manager";

export default async function AdminMessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="mb-1 text-xl font-semibold text-foreground">Messages</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Submissions from your public contact form.
      </p>
      <MessagesManager messages={messages} />
    </div>
  );
}
