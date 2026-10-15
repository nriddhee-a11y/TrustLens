import { describe, it, expect } from "vitest";
import {
  clampScore,
  verdictFromScore,
  scoreFromSeed,
  buildFindings,
  buildDemoAnalysis,
  buildReport,
  VERDICT_SUMMARIES,
} from "../convex/lib/scoring";

describe("clampScore", () => {
  it("clamps to 0-100 and rounds", () => {
    expect(clampScore(-5)).toBe(0);
    expect(clampScore(150)).toBe(100);
    expect(clampScore(42.6)).toBe(43);
  });
  it("treats NaN as 0", () => {
    expect(clampScore(NaN)).toBe(0);
  });
});

describe("verdictFromScore", () => {
  it("uses 70 and 40 as boundaries", () => {
    expect(verdictFromScore(100)).toBe("trusted");
    expect(verdictFromScore(70)).toBe("trusted");
    expect(verdictFromScore(69)).toBe("caution");
    expect(verdictFromScore(40)).toBe("caution");
    expect(verdictFromScore(39)).toBe("manipulated");
    expect(verdictFromScore(0)).toBe("manipulated");
  });
});

describe("scoreFromSeed", () => {
  it("maps 0-255 onto 0-100", () => {
    expect(scoreFromSeed(0)).toBe(0);
    expect(scoreFromSeed(255)).toBe(100);
    expect(scoreFromSeed(128)).toBe(50);
  });
});

describe("buildFindings", () => {
  it("only reports a metadata check for trusted content", () => {
    const f = buildFindings(90, "trusted");
    expect(f.map((x) => x.type)).toEqual(["metadata_check"]);
  });
  it("adds a compression finding for caution", () => {
    const f = buildFindings(55, "caution");
    expect(f.map((x) => x.type)).toEqual([
      "compression_artifact_inconsistency",
      "metadata_check",
    ]);
    expect(f[0].confidence).toBe(45);
  });
  it("adds facial landmark finding for manipulated, capped at 95%", () => {
    const f = buildFindings(2, "manipulated");
    const face = f.find((x) => x.type === "facial_landmark_irregularity")!;
    expect(face.confidence).toBe(95);
    expect(f).toHaveLength(3);
  });
  it("keeps every confidence within 0-100", () => {
    for (let s = 0; s <= 100; s++) {
      for (const x of buildFindings(s, verdictFromScore(s))) {
        expect(x.confidence).toBeGreaterThanOrEqual(0);
        expect(x.confidence).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe("buildDemoAnalysis", () => {
  it("is deterministic for the same seed", () => {
    expect(buildDemoAnalysis(200, 1234)).toEqual(buildDemoAnalysis(200, 1234));
  });
  it("is consistent between score, verdict and summary", () => {
    for (const seed of [0, 60, 120, 180, 255]) {
      const r = buildDemoAnalysis(seed, 10);
      expect(r.verdict).toBe(verdictFromScore(r.trustScore));
      expect(r.summary).toBe(VERDICT_SUMMARIES[r.verdict]);
    }
  });
  it("is clearly labelled as demo mode and records file size", () => {
    const r = buildDemoAnalysis(10, 999);
    expect(r.metadata.note).toMatch(/DEMO MODE/);
    expect(r.metadata.fileSizeBytes).toBe(999);
    expect(r.sourceVerification).toBe("not_checked_demo_mode");
  });
});

describe("buildReport", () => {
  const base = {
    trustScore: 33,
    verdict: "manipulated" as const,
    createdAt: Date.UTC(2026, 9, 15, 4, 30),
    fileName: "clip.mp4",
    fileHash: "abc123",
    summary: "s",
  };
  it("produces an ISO timestamp and includes the hash", () => {
    const r = buildReport({ ...base, evidence: { findings: [], provider: "demo" } });
    expect(r.analyzedAt).toBe("2026-10-15T04:30:00.000Z");
    expect(r.fileHash).toBe("abc123");
    expect(r.provider).toBe("demo");
  });
  it("falls back to an empty findings list", () => {
    expect(buildReport({ ...base, evidence: null }).findings).toEqual([]);
    expect(buildReport(base).findings).toEqual([]);
  });
});
