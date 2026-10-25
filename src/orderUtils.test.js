import { describe, it, expect } from "vitest";
import { generateOrderId } from "./orderUtils.js";
import { createOrder } from "./orderUtils.js";

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

describe("createOrder", () => {
  it("creates an order with the expected fields and default status", () => {
    const order = createOrder({
      customerName: "Aadarsh",
      phone: "9876543210",
      pickupAddress: "Pune",
      garments: [{ name: "Shirt", quantity: 2 }],
      pickupDate: "2026-10-26",
      deliveryDate: "2026-10-28",
    });

    expect(order.id).toBe("");
    expect(order.customerName).toBe("Aadarsh");
    expect(order.status).toBe("Received");
    expect(order.notes).toBe("");
    expect(order.garments).toEqual([
      { name: "Shirt", quantity: 2 },
    ]);
    expect(order.createdAt).toBeTruthy();
    expect(order.updatedAt).toBe(order.createdAt);
  });

  it("trims unnecessary whitespace from text fields", () => {
    const order = createOrder({
      customerName: "  Aadarsh  ",
      phone: "  9876543210  ",
      pickupAddress: "  Pune  ",
      garments: [],
      pickupDate: "2026-10-26",
      deliveryDate: "2026-10-28",
      notes: "  Handle carefully  ",
    });

    expect(order.customerName).toBe("Aadarsh");
    expect(order.phone).toBe("9876543210");
    expect(order.pickupAddress).toBe("Pune");
    expect(order.notes).toBe("Handle carefully");
  });
});