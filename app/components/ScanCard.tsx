"use client";

import Link from "next/link";
import { TrustScoreBadge } from "./TrustScoreBadge";

export function ScanCard({ scan }: { scan: any }) {
  return (
    <Link
      href={`/scan/${scan._id}`}
      className="flex items-center justify-between bg-panel border border-border rounded-xl px-5 py-4 hover:border-accent/50 transition"
    >
      <div>
        <p className="font-medium">{scan.fileName}</p>
        <p className="text-xs text-neutral-500 mt-1">
          {scan.mediaType.toUpperCase()} ·{" "}
          {new Date(scan.createdAt).toLocaleString()}
        </p>
      </div>
      <TrustScoreBadge score={scan.trustScore} verdict={scan.verdict} />
    </Link>
  );
}
