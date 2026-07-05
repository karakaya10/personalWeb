export function SectionHeading({ number, title }: { number: string; title: string }) {
  return (
    <h2 className="mb-12 flex items-center gap-3 text-2xl font-bold text-foreground sm:text-3xl">
      <span className="font-mono text-lg text-brand sm:text-xl">{number}.</span>
      {title}
      <span className="h-px flex-1 bg-border" aria-hidden />
    </h2>
  );
}
