import { describe, it, expect } from "vitest";
import { generateOrderId } from "./orderUtils.js";

describe("generateOrderId", () => {
  it("generates the first ID when there are no orders", () => {
    expect(generateOrderId([])).toBe("ORD-0001");
  });

  it("generates the next ID when orders already exist", () => {
    const orders = [
      { id: "ORD-0001" },
      { id: "ORD-0002" },
    ];

    expect(generateOrderId(orders)).toBe("ORD-0003");
  });

  it("handles IDs that are not in sequential order", () => {
    const orders = [
      { id: "ORD-0001" },
      { id: "ORD-0005" },
      { id: "ORD-0003" },
    ];

    expect(generateOrderId(orders)).toBe("ORD-0006");
  });

  it("ignores IDs that do not match the expected format", () => {
    const orders = [
      { id: "ORD-0002" },
      { id: "INVALID" },
      { id: "ABC-0099" },
    ];

    expect(generateOrderId(orders)).toBe("ORD-0003");
  });
});