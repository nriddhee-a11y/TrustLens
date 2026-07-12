"use client";

import Link from "next/link";
import { Authenticated, Unauthenticated } from "convex/react";

const NAV_LINKS = ["Features", "How It Works", "Evidence Locker", "FAQ"];

export default function LandingPage() {
  return (
    <div className="bg-landing min-h-screen text-ink">
      <Nav />
      <Hero />
    </div>
  );
}

function Nav() {
  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-white/5">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-sm bg-mint/90 rotate-45 inline-block" />
        <span className="font-display font-bold tracking-tightest text-lg">
          TRUST<span className="text-mint">LENS</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm text-muted font-medium">
        {NAV_LINKS.map((link) => (
          <span key={link} className="hover:text-ink transition cursor-default">
            {link}
          </span>
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
          <span className="w-1.5 h-1.5 rounded-full bg-mint inline-block" />
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
          <Stat value="100%" label="Explainable" />
          <Stat value="0" label="Black boxes" />
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
    <div className="relative rounded-xl border border-white/10 overflow-hidden bg-landingPanel">
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
          <span className="text-mint">● live</span>
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
        <span className="text-mint">ANALYZING…</span>
      </div>
    </div>
  );
}

