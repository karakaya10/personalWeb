"use client";

import { useActionState, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  saveExperience,
  deleteExperience,
  type ExperienceFormState,
} from "@/app/admin/(dashboard)/experience/actions";
import type { Experience } from "@/generated/prisma/client";

const initialState: ExperienceFormState = { status: "idle" };

function toDateInputValue(date: Date | null | undefined) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

export function ExperienceManager({ experience }: { experience: Experience[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{experience.length} entries</p>
        <Button
          size="sm"
          className="bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add experience
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead className="w-20 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experience.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.role}</TableCell>
                <TableCell className="text-muted-foreground">{item.company}</TableCell>
                <TableCell className="text-muted-foreground">
                  {format(item.startDate, "MMM yyyy")} —{" "}
                  {item.endDate ? format(item.endDate, "MMM yyyy") : "Present"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Edit ${item.role}`}
                      onClick={() => {
                        setEditing(item);
                        setDialogOpen(true);
                      }}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Delete ${item.role}`}
                      onClick={() => setDeleteTarget(item)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {experience.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No experience entries yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>

      <ExperienceDialog
        key={dialogOpen ? (editing?.id ?? "new") : "closed"}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        experience={editing}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{deleteTarget?.role}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={async () => {
                if (!deleteTarget) return;
                await deleteExperience(deleteTarget.id);
                toast.success("Experience deleted.");
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

function ExperienceDialog({
  open,
  onOpenChange,
  experience,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience | null;
}) {
  const [state, formAction, pending] = useActionState(saveExperience, initialState);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
      onOpenChange(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{experience ? "Edit experience" : "Add experience"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="id" value={experience?.id ?? ""} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" name="role" defaultValue={experience?.role} required maxLength={160} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" defaultValue={experience?.company} required maxLength={160} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={experience?.location ?? ""} maxLength={160} />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={experience?.description}
              required
              rows={4}
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={toDateInputValue(experience?.startDate)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate">End date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={toDateInputValue(experience?.endDate)}
              />
              <p className="text-xs text-muted-foreground">Leave empty for &quot;Present&quot;.</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="order">Order</Label>
            <Input id="order" name="order" type="number" min={0} defaultValue={experience?.order ?? 0} />
          </div>

          {state.status === "error" && state.message ? (
            <p className="text-sm text-destructive">{state.message}</p>
          ) : null}

          <DialogFooter>
            <Button
              type="submit"
              disabled={pending}
              className="bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {pending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
