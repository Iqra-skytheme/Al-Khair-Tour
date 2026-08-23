export function PageHeader({ eyebrow, title, desc }) {
  return (
    <section className="border-b border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <div className="text-xs uppercase tracking-widest text-primary">{eyebrow}</div>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">{title}</h1>
        {desc && <p className="mt-3 max-w-2xl text-muted-foreground">{desc}</p>}
      </div>
    </section>
  );
}
