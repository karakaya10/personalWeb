"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, type ProfileFormState } from "@/app/admin/(dashboard)/profile/actions";
import type { Profile } from "@/generated/prisma/client";

const initialState: ProfileFormState = { status: "idle" };

export function ProfileForm({ profile }: { profile: Profile | null }) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.status === "success" && state.message) toast.success(state.message);
    if (state.status === "error" && state.message && !state.errors) toast.error(state.message);
  }, [state]);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" defaultValue={profile?.fullName} error={state.errors?.fullName} />
        <Field label="Title" name="title" defaultValue={profile?.title} error={state.errors?.title} />
      </div>

      <Field label="Tagline" name="tagline" defaultValue={profile?.tagline} error={state.errors?.tagline} />

      <div className="flex flex-col gap-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={5} defaultValue={profile?.bio} required />
        {state.errors?.bio ? <p className="text-xs text-destructive">{state.errors.bio[0]}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Location" name="location" defaultValue={profile?.location} error={state.errors?.location} />
        <Field label="Contact email" name="email" type="email" defaultValue={profile?.email} error={state.errors?.email} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Resume URL"
          name="resumeUrl"
          defaultValue={profile?.resumeUrl ?? ""}
          error={state.errors?.resumeUrl}
          placeholder="/resume.pdf"
        />
        <Field
          label="Avatar URL"
          name="avatarUrl"
          defaultValue={profile?.avatarUrl ?? ""}
          error={state.errors?.avatarUrl}
          placeholder="/avatar.jpg"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-fit bg-brand text-brand-foreground hover:bg-brand/90"
      >
        {pending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  error,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  error?: string[];
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={!["resumeUrl", "avatarUrl"].includes(name)}
      />
      {error ? <p className="text-xs text-destructive">{error[0]}</p> : null}
    </div>
  );
}
