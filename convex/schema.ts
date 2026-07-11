import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // authTables gives us users/sessions tables for free from @convex-dev/auth
  ...authTables,

  scans: defineTable({
    userId: v.id("users"),
    fileId: v.id("_storage"),
    fileName: v.string(),
    mediaType: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("audio")
    ),
    fileHash: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("analyzing"),
      v.literal("complete"),
      v.literal("failed")
    ),
    trustScore: v.optional(v.number()), // 0-100, higher = more trustworthy
    verdict: v.optional(
      v.union(
        v.literal("trusted"),
        v.literal("caution"),
        v.literal("manipulated")
      )
    ),
    summary: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  evidence: defineTable({
    scanId: v.id("scans"),
    findings: v.array(
      v.object({
        type: v.string(),
        confidence: v.number(), // 0-100
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
    provider: v.string(), // "demo" | "hive" | etc
  }).index("by_scan", ["scanId"]),
});
