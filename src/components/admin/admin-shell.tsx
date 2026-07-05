"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { LogOut, Menu, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { logout } from "@/app/admin/login/actions";

export function AdminShell({
  children,
  adminEmail,
}: {
  children: ReactNode;
  adminEmail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col gap-6 border-r border-border bg-background p-5 md:flex">
          <Link href="/admin" className="font-mono text-sm font-semibold text-foreground">
            <span className="text-brand">{`{`}</span>Admin<span className="text-brand">{`}`}</span>
          </Link>
          <SidebarNav />
          <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
            <p className="truncate text-xs text-muted-foreground">{adminEmail}</p>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start px-0 text-muted-foreground hover:text-foreground"
              nativeButton={false}
              render={
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4" />
                  View site
                </a>
              }
            />
            <form action={logout}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start px-0 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="size-4" />
                Sign out
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="size-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-64">
                <SheetTitle className="sr-only">Admin navigation</SheetTitle>
                <div className="mt-8 flex flex-col gap-6 px-1">
                  <SidebarNav onNavigate={() => setOpen(false)} />
                  <form action={logout}>
                    <Button type="submit" variant="outline" size="sm" className="w-full">
                      <LogOut className="size-4" />
                      Sign out
                    </Button>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
            <span className="font-mono text-sm font-semibold">Admin</span>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
