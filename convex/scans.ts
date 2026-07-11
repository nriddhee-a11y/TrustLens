import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Step 1: client asks for a URL it can upload the raw file bytes to directly.
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");
    return await ctx.storage.generateUploadUrl();
  },
});

// Step 2: after upload finishes, client calls this with the storage id it got back.
export const createScan = mutation({
  args: {
    fileId: v.id("_storage"),
    fileName: v.string(),
    mediaType: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("audio")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not signed in");

    const scanId = await ctx.db.insert("scans", {
      userId,
      fileId: args.fileId,
      fileName: args.fileName,
      mediaType: args.mediaType,
      status: "pending",
      createdAt: Date.now(),
    });

    // Kick off analysis in the background - this returns instantly,
    // the UI will update live once analysis finishes.
    await ctx.scheduler.runAfter(0, api.analysis.analyzeScan, {
      scanId,
    });

    return scanId;
  },
});

export const listMyScans = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("scans")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const getScan = query({
  args: { scanId: v.id("scans") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const scan = await ctx.db.get(args.scanId);
    if (!scan || scan.userId !== userId) return null;

    const evidence = await ctx.db
      .query("evidence")
      .withIndex("by_scan", (q) => q.eq("scanId", args.scanId))
      .first();

    const fileUrl = await ctx.storage.getUrl(scan.fileId);

    return { ...scan, evidence, fileUrl };
  },
});

// Used by the background analysis action, which has no signed-in user
// context - so this deliberately skips the auth/ownership check that
// getScan (above) does for client-facing reads.
export const _getScanInternal = query({
  args: { scanId: v.id("scans") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.scanId);
  },
});

// Internal helper used by the analysis action to write results back.
export const _writeResult = mutation({
  args: {
    scanId: v.id("scans"),
    status: v.union(
      v.literal("analyzing"),
      v.literal("complete"),
      v.literal("failed")
    ),
    fileHash: v.optional(v.string()),
    trustScore: v.optional(v.number()),
    verdict: v.optional(
      v.union(
        v.literal("trusted"),
        v.literal("caution"),
        v.literal("manipulated")
      )
    ),
    summary: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { scanId, ...rest } = args;
    await ctx.db.patch(scanId, rest);
  },
});

export const _writeEvidence = mutation({
  args: {
    scanId: v.id("scans"),
    findings: v.array(
      v.object({
        type: v.string(),
        confidence: v.number(),
        explanation: v.string(),
        region: v.optional(
          v.object({
            x: v.number(),
            y: v.number(),
            w: v.number(),
            h: v.number(),
          })
        ),
      })
    ),
    metadata: v.any(),
    sourceVerification: v.string(),
    provider: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("evidence", args);
  },
});
