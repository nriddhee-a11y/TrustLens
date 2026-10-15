import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { TrustScoreBadge } from "../app/components/TrustScoreBadge";

describe("TrustScoreBadge", () => {
  it("shows an analyzing state with no verdict", () => {
    const html = renderToStaticMarkup(<TrustScoreBadge />);
    expect(html).toContain("Analyzing...");
    expect(html).toContain('role="status"');
  });

  it.each([
    ["trusted", "Trusted"],
    ["caution", "Use Caution"],
    ["manipulated", "Manipulated"],
  ] as const)("renders text label for %s (not colour alone)", (verdict, label) => {
    const html = renderToStaticMarkup(
      <TrustScoreBadge score={55} verdict={verdict} />
    );
    expect(html).toContain(label);
    expect(html).toContain("55/100");
  });

  it("exposes an accessible name with score and verdict", () => {
    const html = renderToStaticMarkup(
      <TrustScoreBadge score={88} verdict="trusted" />
    );
    expect(html).toContain("Trust score 88 out of 100, verdict: Trusted");
  });
});
