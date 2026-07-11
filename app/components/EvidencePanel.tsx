"use client";

export function EvidencePanel({ evidence }: { evidence: any }) {
  if (!evidence) return null;

  return (
    <div className="bg-panel border border-border rounded-xl p-6 space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-neutral-300 mb-3">
          🔴 Flagged Findings
        </h3>
        <div className="space-y-3">
          {evidence.findings.map((f: any, i: number) => (
            <div
              key={i}
              className="border border-border rounded-lg p-3 bg-panel2"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium capitalize">
                  {f.type.replaceAll("_", " ")}
                </span>
                <span className="text-xs text-neutral-400">
                  {f.confidence}% confidence
                </span>
              </div>
              <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${f.confidence}%` }}
                />
              </div>
              <p className="text-sm text-neutral-400">{f.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-300 mb-2">
          📄 Metadata Analysis
        </h3>
        <pre className="text-xs text-neutral-500 bg-panel2 rounded-lg p-3 overflow-x-auto">
          {JSON.stringify(evidence.metadata, null, 2)}
        </pre>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-300 mb-2">
          🌐 Source Verification
        </h3>
        <p className="text-sm text-neutral-400">
          {evidence.sourceVerification.replaceAll("_", " ")}
        </p>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-300 mb-2">
          Provider
        </h3>
        <p className="text-sm text-neutral-400 uppercase">
          {evidence.provider}
          {evidence.provider === "demo" && (
            <span className="text-caution normal-case">
              {" "}
              — demo analysis, not a real detection result
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
