"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/section-heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactForm, type ContactFormState } from "@/app/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export function ContactSection({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  useEffect(() => {
    if (state.status === "success" && state.message) {
      toast.success(state.message);
    } else if (state.status === "error" && state.message && !state.errors) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-24">
      <Reveal>
        <SectionHeading number="05" title="Contact" />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-8 text-muted-foreground">
          I&apos;m currently open to new opportunities. Whether you have a question or just want
          to say hi, my inbox is always open — or reach me directly at{" "}
          <a href={`mailto:${email}`} className="text-brand hover:underline">
            {email}
          </a>
          .
        </p>
      </Reveal>
      <Reveal delay={0.16}>
        <form action={formAction} className="flex flex-col gap-5">
          {/* Honeypot field, hidden from real users via CSS */}
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required maxLength={120} autoComplete="name" />
              {state.errors?.name ? (
                <p className="text-xs text-destructive">{state.errors.name[0]}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
              />
              {state.errors?.email ? (
                <p className="text-xs text-destructive">{state.errors.email[0]}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" required minLength={10} maxLength={4000} rows={6} />
            {state.errors?.message ? (
              <p className="text-xs text-destructive">{state.errors.message[0]}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={pending}
            className="w-fit bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {pending ? "Sending..." : "Send message"}
          </Button>
        </form>
      </Reveal>
    </section>
  );
}
