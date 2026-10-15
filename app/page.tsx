"use client";

import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";

const NAV_LINKS = [
  { label: "The Problem", href: "#problem" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Evidence Locker", href: "#evidence-locker" },
];

export default function LandingPage() {
  return (
    <div className="bg-landing min-h-screen text-ink">
      <Nav />
      <Hero />
      <Problem />
      <HowItWorks />
      <EvidenceLocker />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="w-6 h-6 rounded-sm bg-mint/90 rotate-45 inline-block" />
        <span className="font-display font-bold tracking-tightest text-lg">
          TRUST<span className="text-mint">LENS</span>
        </span>
      </div>

      <nav aria-label="Primary" className="hidden md:flex items-center gap-8 text-sm text-muted font-medium">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="hover:text-ink transition"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm font-mono uppercase tracking-wideish px-4 py-2 rounded-md border border-white/10 hover:border-white/25 transition"
        >
          Sign in
        </Link>
        <CTAButton
          className="text-sm font-mono uppercase tracking-wideish px-4 py-2 rounded-md bg-mint text-landing font-semibold hover:brightness-110 transition"
          label="Launch Scanner"
        />
      </div>
    </header>
  );
}

function CTAButton({ label, className }: { label: string; className: string }) {
  return (
    <>
      <Authenticated>
        <Link href="/dashboard" className={className}>
          {label}
        </Link>
      </Authenticated>
      <Unauthenticated>
        <Link href="/login" className={className}>
          {label}
        </Link>
      </Unauthenticated>
    </>
  );
}

function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-20 grid md:grid-cols-2 gap-14 items-center">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wideish text-mint mb-6">
          <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
          Explainable synthetic media detection
        </div>

        <h1 className="font-display font-bold text-5xl md:text-6xl leading-[1.05] tracking-tightest mb-6">
          Don&apos;t ask if it&apos;s fake.
          <br />
          Ask if you can{" "}
          <span className="text-mint [text-shadow:0_0_28px_rgba(52,245,160,0.35)]">
            trust
          </span>{" "}
          it.
        </h1>

        <p className="text-muted text-lg leading-relaxed mb-8 max-w-md">
          TrustLens analyzes images, video, and audio for manipulation
          signals, then shows its work — a trust score, flagged regions, and
          a plain-English explanation, not just a verdict.
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-10">
          <CTAButton
            label="▶ Run a scan"
            className="px-6 py-3 rounded-md bg-mint text-landing font-mono font-semibold uppercase tracking-wideish text-sm hover:brightness-110 transition"
          />
          <a
            href="#how-it-works"
            className="px-6 py-3 rounded-md border border-white/10 font-mono uppercase tracking-wideish text-sm text-muted hover:text-ink hover:border-white/25 transition"
          >
            See how it works
          </a>
        </div>

        <div className="flex items-center gap-10">
          <Stat value="3" label="Media types" />
          <Stat value="SHA-256" label="File fingerprint" />
          <Stat value="JSON" label="Evidence report" />
        </div>
      </div>

      <ScanPanel />
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-mono text-2xl font-semibold text-mint">{value}</p>
      <p className="text-xs text-faint uppercase tracking-wideish mt-1">
        {label}
      </p>
    </div>
  );
}

function ScanPanel() {
  return (
    <div
      role="img"
      aria-label="Illustrative sample of a TrustLens result: trust score 92 out of 100, with facial geometry 96%, compression consistency 88% and metadata integrity 91%."
      className="relative rounded-xl border border-white/10 overflow-hidden bg-landingPanel"
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(52,245,160,0.12), transparent 55%)",
        }}
      />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-6 text-xs font-mono text-faint uppercase tracking-wideish">
          <span>Trust analysis</span>
          <span className="text-mint">Sample result</span>
        </div>

        <div className="flex items-end gap-6 mb-8">
          <div>
            <p className="font-mono text-5xl font-bold text-mint">92</p>
            <p className="text-xs text-faint uppercase tracking-wideish mt-1">
              Trust score
            </p>
          </div>
          <div className="flex-1 h-16 flex items-end gap-1.5">
            {[40, 65, 30, 80, 55, 90, 70, 95, 60, 88, 75, 92].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-mint/70 rounded-sm"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "Facial geometry", v: 96 },
            { label: "Compression consistency", v: 88 },
            { label: "Metadata integrity", v: 91 },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs font-mono text-muted mb-1">
                <span>{row.label}</span>
                <span>{row.v}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-mint/80"
                  style={{ width: `${row.v}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-between px-6 py-3 border-t border-white/10 bg-black/30 text-xs font-mono">
        <span className="text-faint">TRUST_ANALYSIS.EXE</span>
        <span className="text-mint">SAMPLE</span>
      </div>
    </div>
  );
}


function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="max-w-7xl mx-auto px-6 md:px-10 py-16 border-t border-white/5 scroll-mt-4"
    >
      <p className="text-xs font-mono uppercase tracking-wideish text-mint mb-3">
        {eyebrow}
      </p>
      <h2
        id={`${id}-title`}
        className="font-display font-bold text-3xl md:text-4xl tracking-tightest mb-8 max-w-2xl"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Problem() {
  const items = [
    {
      h: "Who is affected",
      p: "Everyday people, students, journalists and small organisations who receive images, videos and voice notes they have no way to verify before trusting or forwarding them.",
    },
    {
      h: "Why current tools fall short",
      p: "Most detectors return a bare \"real\" or \"fake\" label. Without reasons, a verdict is hard to trust, hard to challenge and impossible to hand to someone else as evidence.",
    },
    {
      h: "What TrustLens does differently",
      p: "It reports a trust score with plain-English reasons, flags what looked inconsistent, fingerprints the file with SHA-256, and packages everything into a report anyone can review.",
    },
  ];
  return (
    <Section
      id="problem"
      eyebrow="Open Innovation · AI & emerging technologies"
      title="Synthetic media is easy to make and hard to verify."
    >
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((i) => (
          <article
            key={i.h}
            className="rounded-xl border border-white/10 bg-landingPanel p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-2">{i.h}</h3>
            <p className="text-muted leading-relaxed">{i.p}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const steps = [
    ["Upload", "Add an image, video or audio file."],
    ["Analyse", "The file is fingerprinted and checked for manipulation signals."],
    ["Explain", "You get a trust score, flagged findings and a plain-English summary."],
    ["Share", "Download the evidence report so others can verify your result."],
  ];
  return (
    <Section id="how-it-works" eyebrow="How it works" title="From upload to evidence in four steps.">
      <ol className="grid md:grid-cols-4 gap-6">
        {steps.map(([h, p], i) => (
          <li key={h} className="rounded-xl border border-white/10 bg-landingPanel p-6">
            <span className="font-mono text-mint text-sm">0{i + 1}</span>
            <h3 className="font-display font-semibold text-lg mt-2 mb-2">{h}</h3>
            <p className="text-muted leading-relaxed">{p}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function EvidenceLocker() {
  return (
    <Section id="evidence-locker" eyebrow="Evidence Locker" title="Results you can hand to someone else.">
      <p className="text-muted text-lg leading-relaxed max-w-2xl mb-4">
        Every scan is saved to your history. Each report includes the file&apos;s
        SHA-256 fingerprint, the trust score, the verdict and every finding, so
        the result can be checked independently.
      </p>
      <p className="text-muted leading-relaxed max-w-2xl">
        <strong className="text-ink">Prototype note:</strong> without a detection
        API key, TrustLens runs in a clearly labelled demo mode that simulates the
        score. Add a provider key to switch to live detection.
      </p>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-6 md:px-10 py-8 border-t border-white/5 text-xs text-faint">
      TrustLens — explainable synthetic media detection.
    </footer>
  );
}
