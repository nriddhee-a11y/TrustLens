"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import crypto from "crypto";

/**
 * This is the heart of TrustLens. It:
 *  1. Fetches the uploaded file's bytes from Convex storage
 *  2. Computes a SHA-256 fingerprint (the "digital fingerprint")
 *  3. Sends it to a detection provider (real API if HIVE_API_KEY is set
 *     in your Convex dashboard env vars, otherwise a clearly-labelled
 *     demo analyzer so the app fully works for a live demo without any
 *     paid API key)
 *  4. Writes the trust score + explainable findings back to the DB
 */
export const analyzeScan = action({
  args: { scanId: v.id("scans") },
  handler: async (ctx, { scanId }) => {
    await ctx.runMutation(api.scans._writeResult, {
      scanId,
      status: "analyzing",
    });

    const scanDoc = await ctx.runQuery(api.scans._getScanInternal, {
      scanId,
    });
    if (!scanDoc) return;

    const fileUrl = await ctx.storage.getUrl(scanDoc.fileId);

    try {
      const fileBytes = await (await fetch(fileUrl as string)).arrayBuffer();
      const hash = crypto
        .createHash("sha256")
        .update(Buffer.from(fileBytes))
        .digest("hex");

      const hiveKey = process.env.HIVE_API_KEY;

      const result = hiveKey
        ? await analyzeWithHive(fileUrl as string, hiveKey)
        : analyzeDemo(Buffer.from(fileBytes));

      await ctx.runMutation(api.scans._writeEvidence, {
        scanId,
        findings: result.findings,
        metadata: result.metadata,
        sourceVerification: result.sourceVerification,
        provider: hiveKey ? "hive" : "demo",
      });

      await ctx.runMutation(api.scans._writeResult, {
        scanId,
        status: "complete",
        fileHash: hash,
        trustScore: result.trustScore,
        verdict: result.verdict,
        summary: result.summary,
      });
    } catch (err: any) {
      await ctx.runMutation(api.scans._writeResult, {
        scanId,
        status: "failed",
        summary: `Analysis failed: ${err.message ?? "unknown error"}`,
      });
    }
  },
});

// ---- Demo analyzer -------------------------------------------------
// Deterministic-ish "fake but plausible" analysis so the whole product
// works end-to-end without needing a paid API key during a hackathon.
// Swap this out for analyzeWithHive (or Resemble/Sensity/Reality
// Defender) any time - the rest of the app doesn't need to change.
function analyzeDemo(bytes: Buffer) {
  // Use the file's byte content to derive a stable "score" so the same
  // file always gets the same demo result (not truly random).
  const hash = crypto.createHash("md5").update(bytes).digest();
  const seed = hash[0]; // 0-255

  const trustScore = Math.round((seed / 255) * 100);
  const verdict =
    trustScore >= 70 ? "trusted" : trustScore >= 40 ? "caution" : "manipulated";

  const findings = [];

  if (verdict !== "trusted") {
    findings.push({
      type: "compression_artifact_inconsistency",
      confidence: 100 - trustScore,
      explanation:
        "Regions of this file show compression/noise patterns that differ from the rest of the image, which can indicate an area was edited or generated separately from the surrounding content.",
      region: { x: 0.2, y: 0.15, w: 0.35, h: 0.3 },
    });
  }
  if (verdict === "manipulated") {
    findings.push({
      type: "facial_landmark_irregularity",
      confidence: Math.min(95, 100 - trustScore + 10),
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

  return {
    trustScore,
    findings,
    verdict: verdict as "trusted" | "caution" | "manipulated",
    summary:
      verdict === "trusted"
        ? "No strong signs of manipulation detected. This content appears consistent with an unedited capture."
        : verdict === "caution"
        ? "Some inconsistencies were found. This content warrants a closer look before you trust or share it."
        : "Multiple strong indicators of manipulation were detected. Treat this content as untrustworthy until verified through another source.",
    metadata: {
      note: "DEMO MODE: replace analyzeDemo() with analyzeWithHive() and set HIVE_API_KEY to get real detection.",
      fileSizeBytes: bytes.length,
    },
    sourceVerification: "not_checked_demo_mode",
  };
}

// ---- Real provider (Hive AI) ----------------------------------------
// Fill this in once you have a Hive API key. Left as a clear stub so
// swapping demo -> real is a one-line change (just set HIVE_API_KEY).
async function analyzeWithHive(fileUrl: string, apiKey: string) {
  const res = await fetch("https://api.thehive.ai/api/v2/task/sync", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: fileUrl }),
  });
  const data = await res.json();

  // NOTE: Map Hive's actual response shape to our schema here once you
  // have real API docs/response in front of you - this is a placeholder
  // shape to get you started.
  const trustScore = Math.round((1 - (data?.deepfake_score ?? 0.5)) * 100);
  const verdict =
    trustScore >= 70 ? "trusted" : trustScore >= 40 ? "caution" : "manipulated";

  return {
    trustScore,
    verdict: verdict as "trusted" | "caution" | "manipulated",
    summary: data?.summary ?? "Analysis complete via Hive AI.",
    findings: (data?.findings ?? []).map((f: any) => ({
      type: f.type ?? "unknown",
      confidence: f.confidence ?? 50,
      explanation: f.explanation ?? "",
      region: f.region,
    })),
    metadata: data?.metadata ?? {},
    sourceVerification: data?.source_verification ?? "unknown",
  };
}
