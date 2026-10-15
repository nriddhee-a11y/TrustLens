"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TrustScoreBadge } from "@/app/components/TrustScoreBadge";
import { EvidencePanel } from "@/app/components/EvidencePanel";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { useEffect } from "react";
import { buildReport } from "@/convex/lib/scoring";

export default function ScanPage() {
  return (
    <>
      <AuthLoading>
        <div role="status" className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">
          Loading...
        </div>
      </AuthLoading>
      <Unauthenticated>
        <RedirectToLogin />
      </Unauthenticated>
      <Authenticated>
        <ScanContent />
      </Authenticated>
    </>
  );
}

function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login");
  }, [router]);
  return null;
}

function ScanContent() {
  const params = useParams();
  const scanId = params.id as Id<"scans">;
  const scan = useQuery(api.scans.getScan, { scanId });

  if (scan === undefined) {
    return (
      <div role="status" className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">
        Loading...
      </div>
    );
  }

  if (scan === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400 text-sm">
        Scan not found.
      </div>
    );
  }

  function downloadReport() {
    const report = buildReport(scan!);
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trustlens-report-${scan!._id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href="/dashboard"
        className="text-xs text-neutral-400 hover:text-white"
      >
        <span aria-hidden="true">← </span>Back to dashboard
      </Link>

      <div className="flex items-center justify-between mt-4 mb-6">
        <h1 className="text-xl font-bold truncate pr-4">{scan.fileName}</h1>
        <TrustScoreBadge score={scan.trustScore} verdict={scan.verdict} size="lg" />
      </div>

      {scan.fileUrl && (
        <div className="bg-panel border border-border rounded-xl overflow-hidden mb-6">
          {scan.mediaType === "image" && (
            <img src={scan.fileUrl} alt={`Uploaded image: ${scan.fileName}`} className="w-full max-h-[420px] object-contain bg-black" />
          )}
          {scan.mediaType === "video" && (
            <video
              src={scan.fileUrl}
              controls
              aria-label={`Uploaded video: ${scan.fileName}`}
              className="w-full max-h-[420px]"
            />
          )}
          {scan.mediaType === "audio" && (
            <audio
              src={scan.fileUrl}
              controls
              aria-label={`Uploaded audio: ${scan.fileName}`}
              className="w-full p-4"
            />
          )}
        </div>
      )}

      {scan.status !== "complete" ? (
        <div
          role="status"
          aria-live="polite"
          className="bg-panel border border-border rounded-xl p-6 text-center text-neutral-400 text-sm"
        >
          {scan.status === "failed"
            ? scan.summary ?? "Analysis failed."
            : "Analyzing... this updates automatically when done."}
        </div>
      ) : (
        <>
          <div className="bg-panel border border-border rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-neutral-300 mb-2">
              Summary
            </h2>
            <p className="text-sm text-neutral-400">{scan.summary}</p>
            {scan.fileHash && (
              <p className="text-xs text-neutral-400 mt-3 font-mono break-all">
                SHA-256: {scan.fileHash}
              </p>
            )}
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={downloadReport}
              className="bg-accent hover:bg-accentHover transition rounded-lg px-4 py-2 text-sm font-medium"
            >
              Download Evidence Report
            </button>
          </div>

          <h2 className="text-sm font-semibold text-neutral-300 mb-3">
            Why? — AI Evidence Panel
          </h2>
          <EvidencePanel evidence={scan.evidence} />
        </>
      )}
    </div>
  );
}
