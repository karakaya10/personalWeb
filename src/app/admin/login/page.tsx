"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type LoginFormState } from "./actions";

const initialState: LoginFormState = {};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Lock className="size-5" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Admin sign in</h1>
          <p className="text-sm text-muted-foreground">Manage your portfolio content</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="username"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>

          {state.error ? <p className="text-sm text-destructive">{state.error}</p> : null}

          <Button
            type="submit"
            disabled={pending}
            className="mt-2 bg-brand text-brand-foreground hover:bg-brand/90"
          >
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
