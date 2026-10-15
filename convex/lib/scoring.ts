// Pure scoring / report helpers for TrustLens.
// Kept free of Node, Convex and React imports so they can be unit tested
// and shared between the Convex backend and the Next.js frontend.

export type Verdict = "trusted" | "caution" | "manipulated";

export type Finding = {
  type: string;
  confidence: number;
  explanation: string;
  region?: { x: number; y: number; w: number; h: number };
};

export const TRUSTED_THRESHOLD = 70;
export const CAUTION_THRESHOLD = 40;

/** Clamp any number into the 0-100 range and round to an integer. */
export function clampScore(score: number): number {
  if (Number.isNaN(score)) return 0;
  return Math.round(Math.min(100, Math.max(0, score)));
}

/** Map a 0-100 trust score to a verdict. */
export function verdictFromScore(score: number): Verdict {
  const s = clampScore(score);
  if (s >= TRUSTED_THRESHOLD) return "trusted";
  if (s >= CAUTION_THRESHOLD) return "caution";
  return "manipulated";
}

/** Convert a first hash byte (0-255) into a stable 0-100 demo score. */
export function scoreFromSeed(seed: number): number {
  return clampScore((seed / 255) * 100);
}

export const VERDICT_SUMMARIES: Record<Verdict, string> = {
  trusted:
    "No strong signs of manipulation detected. This content appears consistent with an unedited capture.",
  caution:
    "Some inconsistencies were found. This content warrants a closer look before you trust or share it.",
  manipulated:
    "Multiple strong indicators of manipulation were detected. Treat this content as untrustworthy until verified through another source.",
};

/** Build the explainable findings list for a given score + verdict. */
export function buildFindings(trustScore: number, verdict: Verdict): Finding[] {
  const findings: Finding[] = [];

  if (verdict !== "trusted") {
    findings.push({
      type: "compression_artifact_inconsistency",
      confidence: clampScore(100 - trustScore),
      explanation:
        "Regions of this file show compression/noise patterns that differ from the rest of the image, which can indicate an area was edited or generated separately from the surrounding content.",
      region: { x: 0.2, y: 0.15, w: 0.35, h: 0.3 },
    });
  }
  if (verdict === "manipulated") {
    findings.push({
      type: "facial_landmark_irregularity",
      confidence: Math.min(95, clampScore(100 - trustScore + 10)),
      explanation:
        "Facial landmark geometry (eye spacing, jawline continuity) shows irregularities commonly seen in face-swap or synthetic-face generation.",
      region: { x: 0.3, y: 0.1, w: 0.4, h: 0.45 },
    });
  }
  findings.push({
    type: "metadata_check",
    confidence: 60,
    explanation:
      "File metadata was inspected for signs of editing software, missing capture-device data, or timestamp inconsistencies.",
  });

  return findings;
}

/** Full demo analysis result, derived deterministically from a seed byte. */
export function buildDemoAnalysis(seed: number, fileSizeBytes: number) {
  const trustScore = scoreFromSeed(seed);
  const verdict = verdictFromScore(trustScore);
  return {
    trustScore,
    verdict,
    findings: buildFindings(trustScore, verdict),
    summary: VERDICT_SUMMARIES[verdict],
    metadata: {
      note: "DEMO MODE: replace analyzeDemo() with analyzeWithHive() and set HIVE_API_KEY to get real detection.",
      fileSizeBytes,
    },
    sourceVerification: "not_checked_demo_mode",
  };
}

export type ReportInput = {
  _id?: string;
  trustScore?: number;
  verdict?: Verdict;
  createdAt: number;
  fileName: string;
  fileHash?: string;
  summary?: string;
  evidence?: { findings?: Finding[]; provider?: string } | null;
};

/** Shape of the downloadable Evidence Locker report. */
export function buildReport(scan: ReportInput) {
  return {
    trustScore: scan.trustScore,
    verdict: scan.verdict,
    analyzedAt: new Date(scan.createdAt).toISOString(),
    fileName: scan.fileName,
    fileHash: scan.fileHash,
    summary: scan.summary,
    provider: scan.evidence?.provider,
    findings: scan.evidence?.findings ?? [],
  };
}
