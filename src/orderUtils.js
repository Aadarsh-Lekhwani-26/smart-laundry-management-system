
export const ORDER_STATUSES = [
  "Received",
  "Washing",
  "Ironing",
  "Ready for Delivery",
  "Delivered",
];

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
