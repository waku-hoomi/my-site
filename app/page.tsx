import Link from "next/link";

export default function Home() {
  return (
    <div className="editorial-shell">
      <main className="editorial-panel grain-overlay relative overflow-hidden px-6 py-12 md:px-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <section>
            <p className="editorial-kicker mb-4">Cloud & AI Notes</p>
            <h1 className="editorial-title text-5xl leading-[0.95] md:text-7xl">Armin&apos;s Blog</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
              Long-form notes about cloud computing, AI infrastructure, and product thinking — presented in an
              editorial reading experience.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                className="cursor-pointer border border-[var(--foreground)] bg-[var(--foreground)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--surface)] transition-colors duration-200 hover:bg-[var(--accent-dark)] hover:border-[var(--accent-dark)]"
                href="/blog"
              >
                Enter Journal
              </Link>
              <a
                className="cursor-pointer border border-[var(--rule)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--foreground)] transition-colors duration-200 hover:border-[var(--accent)] hover:text-[var(--accent-dark)]"
                href="https://github.com/waku-hoomi"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </section>

          <aside className="border-l border-[var(--rule)] pl-0 md:pl-6">
            <p className="editorial-kicker mb-3">Issue 01</p>
            <p className="editorial-title text-2xl">Field Dispatches</p>
            <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
              Practical breakdowns of architecture choices, integration pitfalls, and production-ready learnings.
            </p>
            <div className="mt-8 border-t border-[var(--rule)] pt-4 text-sm leading-relaxed text-[var(--muted)]">
              Updated continuously from Notion workspace.
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
