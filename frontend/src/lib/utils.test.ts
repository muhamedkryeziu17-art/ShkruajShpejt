import { describe, expect, it } from "vitest";
import { formatChartDate } from "./utils";

describe("formatChartDate", () => {
  it("formats ISO timestamps for chart labels", () => {
    expect(formatChartDate("2026-05-12T00:00:00")).toBe("12 Maj");
  });

  it("formats date-only values for chart labels", () => {
    expect(formatChartDate("2026-12-03")).toBe("3 Dhj");
  });
});
