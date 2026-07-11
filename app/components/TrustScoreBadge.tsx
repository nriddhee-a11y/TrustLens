export function TrustScoreBadge({
  score,
  verdict,
  size = "md",
}: {
  score?: number;
  verdict?: "trusted" | "caution" | "manipulated";
  size?: "sm" | "md" | "lg";
}) {
  const colors = {
    trusted: "text-trusted border-trusted/40 bg-trusted/10",
    caution: "text-caution border-caution/40 bg-caution/10",
    manipulated: "text-warning border-warning/40 bg-warning/10",
  };
  const labels = {
    trusted: "Trusted",
    caution: "Use Caution",
    manipulated: "Manipulated",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-lg px-4 py-2",
  };

  if (!verdict) {
    return (
      <span className="text-xs text-neutral-500 border border-border rounded-full px-3 py-1">
        Analyzing...
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-medium ${colors[verdict]} ${sizes[size]}`}
    >
      {score !== undefined ? `${score}/100` : ""} · {labels[verdict]}
    </span>
  );
}
