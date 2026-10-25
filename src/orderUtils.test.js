import { describe, it, expect } from "vitest";
import {
  generateOrderId,
  createOrder,
  validateOrder,
  prepareOrder,
  getNextOrderStatus,
  updateOrderStatus
} from "./orderUtils.js";


//-----------------------------------------------------------
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

//-----------------------------------------------------------
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

//-----------------------------------------------------------
describe("validateOrder", () => {
  const validOrder = {
    customerName: "Aadarsh",
    phone: "9876543210",
    pickupAddress: "Pune",
    garments: [{ name: "Shirt", quantity: 2 }],
    pickupDate: "2026-10-26",
    deliveryDate: "2026-10-28",
  };

  it("accepts a valid order", () => {
    const result = validateOrder(validOrder);

    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects missing customer details", () => {
    const result = validateOrder({
      ...validOrder,
      customerName: " ",
      pickupAddress: "",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.customerName).toBeTruthy();
    expect(result.errors.pickupAddress).toBeTruthy();
  });

  it("rejects an invalid phone number", () => {
    const result = validateOrder({
      ...validOrder,
      phone: "12345",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBeTruthy();
  });

  it("rejects an empty garment list", () => {
    const result = validateOrder({
      ...validOrder,
      garments: [],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.garments).toBeTruthy();
  });

  it("rejects invalid garment quantities", () => {
    const result = validateOrder({
      ...validOrder,
      garments: [{ name: "Shirt", quantity: 0 }],
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.garments).toBeTruthy();
  });

  it("rejects delivery dates before pickup dates", () => {
    const result = validateOrder({
      ...validOrder,
      pickupDate: "2026-10-28",
      deliveryDate: "2026-10-26",
    });

    expect(result.isValid).toBe(false);
    expect(result.errors.deliveryDate).toBeTruthy();
  });
});
//-----------------------------------------------------------
describe("prepareOrder", () => {
  const validDetails = {
    customerName: "Aadarsh",
    phone: "9876543210",
    pickupAddress: "Pune",
    garments: [{ name: "Shirt", quantity: 2 }],
    pickupDate: "2026-10-26",
    deliveryDate: "2026-10-28",
  };

  it("creates a valid order with the first ID", () => {
    const result = prepareOrder(validDetails);

    expect(result.success).toBe(true);
    expect(result.order.id).toBe("ORD-0001");
    expect(result.order.status).toBe("Received");
    expect(result.errors).toEqual({});
  });

  it("generates the next ID based on existing orders", () => {
    const existingOrders = [
      { id: "ORD-0001" },
      { id: "ORD-0002" },
    ];

    const result = prepareOrder(validDetails, existingOrders);

    expect(result.success).toBe(true);
    expect(result.order.id).toBe("ORD-0003");
  });

  it("does not create an order when validation fails", () => {
    const result = prepareOrder({
      ...validDetails,
      customerName: "",
    });

    expect(result.success).toBe(false);
    expect(result.order).toBeNull();
    expect(result.errors.customerName).toBeTruthy();
  });
});
//-----------------------------------------------------------
//order status management testing

describe("getNextOrderStatus", () => {
  it("returns the next status", () => {
    expect(getNextOrderStatus("Received")).toBe("Washing");
    expect(getNextOrderStatus("Washing")).toBe("Ironing");
    expect(getNextOrderStatus("Ironing")).toBe("Ready for Delivery");
    expect(getNextOrderStatus("Ready for Delivery")).toBe("Delivered");
  });

  it("returns null when the order is delivered", () => {
    expect(getNextOrderStatus("Delivered")).toBeNull();
  });

  it("returns null for an unknown status", () => {
    expect(getNextOrderStatus("Unknown")).toBeNull();
  });
});

describe("updateOrderStatus", () => {
  const order = {
    id: "ORD-0001",
    customerName: "Test Customer",
    status: "Received",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };

  it("advances an order to the next status", () => {
    const result = updateOrderStatus(order, "Washing");

    expect(result.success).toBe(true);
    expect(result.order.status).toBe("Washing");
    expect(result.order.id).toBe("ORD-0001");
    expect(result.order.updatedAt).not.toBe(order.updatedAt);
  });

  it("rejects skipping a status", () => {
    const result = updateOrderStatus(order, "Delivered");

    expect(result.success).toBe(false);
    expect(result.order).toBeNull();
  });

  it("rejects an invalid status", () => {
    const result = updateOrderStatus(order, "Unknown");

    expect(result.success).toBe(false);
    expect(result.order).toBeNull();
  });

  it("does not modify the original order", () => {
    updateOrderStatus(order, "Washing");

    expect(order.status).toBe("Received");
  });

  it("rejects advancing an already delivered order", () => {
    const deliveredOrder = {
      ...order,
      status: "Delivered",
    };

    const result = updateOrderStatus(deliveredOrder, "Received");

    expect(result.success).toBe(false);
  });
});

//-------------------------------------------------------------------
