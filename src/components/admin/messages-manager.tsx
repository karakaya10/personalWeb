"use client";

import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { setMessageRead, deleteMessage } from "@/app/admin/(dashboard)/messages/actions";
import type { Message } from "@/generated/prisma/client";

export function MessagesManager({ messages }: { messages: Message[] }) {
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);

  if (messages.length === 0) {
    return <p className="text-sm text-muted-foreground">No messages yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className="rounded-lg border border-border bg-card p-4"
        >
          <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-foreground">
                {message.name}{" "}
                {!message.read ? <Badge variant="secondary">New</Badge> : null}
              </p>
              <a href={`mailto:${message.email}`} className="text-sm text-brand hover:underline">
                {message.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {format(message.createdAt, "MMM d, yyyy HH:mm")}
              </span>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={message.read ? "Mark as unread" : "Mark as read"}
                onClick={async () => {
                  await setMessageRead(message.id, !message.read);
                  toast.success(message.read ? "Marked as unread." : "Marked as read.");
                }}
              >
                {message.read ? <Mail className="size-4" /> : <MailOpen className="size-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Delete message"
                onClick={() => setDeleteTarget(message)}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
          <p className="whitespace-pre-wrap text-sm text-muted-foreground">{message.message}</p>
        </div>
      ))}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (!deleteTarget) return;
                await deleteMessage(deleteTarget.id);
                toast.success("Message deleted.");
                setDeleteTarget(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
