export function SiteFooter({ fullName }: { fullName: string }) {
  return (
    <footer className="border-t border-border/60 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center font-mono text-xs text-muted-foreground">
        <p>
          Designed & built by {fullName} · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
