//--------------------------------------------------------
export const ORDER_STATUSES = [
  "Received",
  "Washing",
  "Ironing",
  "Ready for Delivery",
  "Delivered",
];

export const CANCELLED_STATUS = "Cancelled";

// Pricing configuration (amounts in INR per garment)
export const PRICING = {
  washing: 30,
  ironing: 15,
};

//--------------------------------------------------------
// Calculate the total price using supplied pricing or defaults
export function calculateOrderTotal(garments = [], pricing = PRICING) {
  return garments.reduce((total, garment) => {
    const quantity = Number(garment.quantity) || 0;
    let pricePerGarment = 0;

    if (garment.service === "washing") {
      pricePerGarment = pricing.washing;
    } else if (garment.service === "ironing") {
      pricePerGarment = pricing.ironing;
    } else if (garment.service === "both") {
      pricePerGarment = pricing.washing + pricing.ironing;
    }

    return total + pricePerGarment * quantity;
  }, 0);
}

//--------------------------------------------------------
export function generateOrderId(existingOrders = []) {
  const highestNumber = existingOrders.reduce((highest, order) => {
    const match = order.id?.match(/^ORD-(\d+)$/);

    if (!match) {
      return highest;
    }

    return Math.max(highest, Number(match[1]));
  }, 0);

  return `ORD-${String(highestNumber + 1).padStart(4, "0")}`;
}

//--------------------------------------------------------
export function createOrder({
  customerName,
  phone,
  pickupAddress,
  garments,
  pickupDate,
  deliveryDate,
  notes = "",
  pricing = PRICING,
}) {
  const now = new Date().toISOString();

  return {
    id: "",
    customerName: customerName.trim(),
    phone: phone.trim(),
    pickupAddress: pickupAddress.trim(),
    garments,
    pickupDate,
    deliveryDate,
    notes: notes.trim(),
    totalPrice: calculateOrderTotal(garments, pricing),
    status: "Received",
    createdAt: now,
    updatedAt: now,
  };
}

//--------------------------------------------------------
export function validateOrder(order) {
  const errors = {};

  if (!order.customerName?.trim()) {
    errors.customerName = "Customer name is required.";
  }

  if (!order.phone?.trim()) {
    errors.phone = "Phone number is required.";
  } else if (!/^[6-9]\d{9}$/.test(order.phone.trim())) {
    errors.phone = "Enter a valid 10-digit Indian mobile number.";
  }

  if (!order.pickupAddress?.trim()) {
    errors.pickupAddress = "Pickup address is required.";
  }

  if (!Array.isArray(order.garments) || order.garments.length === 0) {
    errors.garments = "Add at least one garment.";
  } else {
    const invalidGarment = order.garments.some(
      (garment) =>
        !garment.name?.trim() ||
        !Number.isInteger(garment.quantity) ||
        garment.quantity <= 0
    );

    if (invalidGarment) {
      errors.garments =
        "Each garment needs a name and a positive whole-number quantity.";
    }
  }

  if (!order.pickupDate) {
    errors.pickupDate = "Pickup date is required.";
  }

  if (!order.deliveryDate) {
    errors.deliveryDate = "Delivery date is required.";
  }

  if (
    order.pickupDate &&
    order.deliveryDate &&
    order.deliveryDate < order.pickupDate
  ) {
    errors.deliveryDate = "Delivery date cannot be before pickup date.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

//--------------------------------------------------------
export function prepareOrder(
  orderDetails,
  existingOrders = [],
  pricing = PRICING
) {
  const validation = validateOrder(orderDetails);

  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors,
      order: null,
    };
  }

  const order = createOrder({
    ...orderDetails,
    pricing,
  });

  order.id = generateOrderId(existingOrders);

  return {
    success: true,
    errors: {},
    order,
  };
}

//--------------------------------------------------------
// Order status management
export function getNextOrderStatus(currentStatus) {
  if (currentStatus === CANCELLED_STATUS) {
    return null;
  }

  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);

  if (currentIndex === -1) {
    return null;
  }

  if (currentIndex === ORDER_STATUSES.length - 1) {
    return null;
  }

  return ORDER_STATUSES[currentIndex + 1];
}

export function updateOrderStatus(order, newStatus) {
  if (order.status === CANCELLED_STATUS) {
    return {
      success: false,
      error: "Cancelled orders cannot be advanced.",
      order: null,
    };
  }

  if (!ORDER_STATUSES.includes(newStatus)) {
    return {
      success: false,
      error: "Invalid order status.",
      order: null,
    };
  }

  const currentIndex = ORDER_STATUSES.indexOf(order.status);
  const newIndex = ORDER_STATUSES.indexOf(newStatus);

  if (currentIndex === -1) {
    return {
      success: false,
      error: "The current order status is invalid.",
      order: null,
    };
  }

  if (newIndex !== currentIndex + 1) {
    return {
      success: false,
      error: "Orders can only advance to the next status.",
      order: null,
    };
  }

  return {
    success: true,
    error: null,
    order: {
      ...order,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    },
  };
}

//------------------------ Order cancelling ------------------------
export function cancelOrder(order) {
  if (!order) {
    return {
      success: false,
      error: "Order not found.",
      order: null,
    };
  }

  if (order.status === CANCELLED_STATUS) {
    return {
      success: false,
      error: "This order is already cancelled.",
      order: null,
    };
  }

  if (order.status === "Delivered") {
    return {
      success: false,
      error: "Delivered orders cannot be cancelled.",
      order: null,
    };
  }

  return {
    success: true,
    error: null,
    order: {
      ...order,
      status: CANCELLED_STATUS,
      updatedAt: new Date().toISOString(),
    },
  };
}

//--------------------------------------------------------
