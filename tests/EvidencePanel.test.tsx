import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { EvidencePanel } from "../app/components/EvidencePanel";

const evidence = {
  findings: [
    { type: "metadata_check", confidence: 60, explanation: "Checked metadata." },
  ],
  metadata: { fileSizeBytes: 10 },
  sourceVerification: "not_checked_demo_mode",
  provider: "demo",
};

describe("EvidencePanel", () => {
  it("renders nothing without evidence", () => {
    expect(renderToStaticMarkup(<EvidencePanel evidence={null} />)).toBe("");
  });

  it("labels confidence bars for assistive tech", () => {
    const html = renderToStaticMarkup(<EvidencePanel evidence={evidence} />);
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="60"');
    expect(html).toContain("metadata check confidence");
  });

  it("clearly flags demo mode", () => {
    const html = renderToStaticMarkup(<EvidencePanel evidence={evidence} />);
    expect(html).toContain("not a real detection result");
  });
});
