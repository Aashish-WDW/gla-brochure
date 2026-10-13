import { describe, expect, it } from "vitest";
import { buildEnquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

describe("WhatsApp enquiry", () => {
  it("targets +91 9390631008 via wa.me", () => {
    const url = buildWhatsAppUrl({ subject: "Jaipur trip", mode: "individual" });
    expect(url.startsWith("https://wa.me/919390631008?text=")).toBe(true);
  });

  it("URL-encodes special characters and round-trips", () => {
    const ctx = { subject: "Dunes & Folk — 50% off?", mode: "group" as const, partySize: 12 };
    const url = buildWhatsAppUrl(ctx);
    const text = new URL(url).searchParams.get("text");
    expect(text).toBe(buildEnquiryMessage(ctx));
    expect(url).not.toContain(" ");
    expect(url).toContain("%26");
  });

  it("omits optional fields that are empty instead of using placeholders", () => {
    const msg = buildEnquiryMessage({ subject: "Goa Sunset Circle", mode: "individual", preferredDate: "  " });
    expect(msg).not.toMatch(/Preferred date|Requested changes|Group size|\[|\]/);
  });

  it("includes mode, group size, date and changes when provided", () => {
    const msg = buildEnquiryMessage({
      subject: "Pink City Weekend",
      reference: "GLA-RAJ-001",
      destination: "Jaipur, Rajasthan",
      mode: "group",
      partySize: 14,
      groupType: "Corporate team",
      preferredDate: "12 Dec 2026",
      changes: ["remove Block-Printing"],
      notes: "Vegetarian only",
    });
    expect(msg).toContain("Group options");
    expect(msg).toContain("Group size: 14");
    expect(msg).toContain("GLA-RAJ-001");
    expect(msg).toContain("Jaipur, Rajasthan");
    expect(msg).toContain("Preferred date: 12 Dec 2026");
    expect(msg).toContain("remove Block-Printing; Vegetarian only");
  });
});
