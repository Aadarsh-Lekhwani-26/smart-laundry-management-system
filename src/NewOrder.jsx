import { useState } from "react";
import { calculateOrderTotal, PRICING } from "./orderUtils";

const initialForm = {
  customerName: "",
  phone: "",
  pickupAddress: "",
  garments: [{ name: "Shirt", quantity: 1, service: "washing" }],
  pickupDate: "",
  deliveryDate: "",
  notes: "",
};

function NewOrder({ onCancel, onSubmit, errors = {}, pricing = PRICING }) {
  const [form, setForm] = useState(initialForm);
  const totalPrice = calculateOrderTotal(form.garments, pricing);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleGarmentChange(index, field, value) {
    setForm((previous) => ({
      ...previous,
      garments: previous.garments.map((garment, garmentIndex) =>
        garmentIndex === index
          ? {
              ...garment,
              [field]: value,
            }
          : garment
      ),
    }));
  }

  function addGarment() {
    setForm((previous) => ({
      ...previous,
      garments: [
        ...previous.garments,
        { name: "", quantity: 1, service: "washing" },
      ],
    }));
  }

  function removeGarment(index) {
    setForm((previous) => ({
      ...previous,
      garments: previous.garments.filter(
        (_, garmentIndex) => garmentIndex !== index
      ),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      ...form,
      garments: form.garments.map((garment) => ({
        ...garment,
        quantity: Number(garment.quantity),
      })),
    });
  }

  return (
    <section className="content-card new-order-card">
      <div className="section-heading">
        <div>
          <h2>Create a New Order</h2>
          <p>Enter customer details and the garments for this order.</p>
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="order-form">
        {Object.keys(errors).length > 0 && (
          <div className="form-error-summary" role="alert">
            <strong>Please correct the following:</strong>
            <ul>
              {Object.entries(errors).map(([field, message]) => (
                <li key={field}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        <h3>Customer details</h3>

        <div className="form-grid">
          <label className="form-field">
            <span>Customer name *</span>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              placeholder="Enter customer name"
              required
            />
          </label>

          <label className="form-field">
            <span>Mobile number *</span>
            <input
              name="phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              maxLength={10}
              required
            />
          </label>

          <label className="form-field full-width">
            <span>Pickup address *</span>
            <textarea
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              placeholder="Enter the customer's pickup address"
              rows={3}
              required
            />
          </label>
        </div>

        <div className="form-section-heading">
          <div>
            <h3>Garments</h3>
            <p>Add each garment type and its quantity.</p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={addGarment}
          >
            + Add garment
          </button>
        </div>

        <div className="garment-list">
          {form.garments.map((garment, index) => (
            <div className="garment-row" key={index}>
              <label className="form-field">
                <span>Garment {index + 1}</span>
                <select
                  value={garment.name}
                  onChange={(event) =>
                    handleGarmentChange(index, "name", event.target.value)
                  }
                  required
                >
                  <option value="">Select garment</option>
                  <option value="Shirt">Shirt</option>
                  <option value="T-Shirt">T-Shirt</option>
                  <option value="Trousers">Trousers</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Kurta">Kurta</option>
                  <option value="Dress">Dress</option>
                  <option value="Bedsheet">Bedsheet</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="form-field quantity-field">
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={garment.quantity}
                  onChange={(event) =>
                    handleGarmentChange(
                      index,
                      "quantity",
                      event.target.value
                    )
                  }
                  required
                />
              </label>

              <label className="form-field">
                <span>Service</span>
                <select
                  value={garment.service || "washing"}
                  onChange={(event) =>
                    handleGarmentChange(index, "service", event.target.value)
                  }
                >
                  <option value="washing">
                    Washing — ₹{pricing.washing}
                  </option>
                  <option value="ironing">
                    Ironing — ₹{pricing.ironing}
                  </option>
                  <option value="both">
                    Washing + Ironing — ₹
                    {pricing.washing + pricing.ironing}
                  </option>
                </select>
              </label>

              <button
                type="button"
                className="remove-garment-button"
                onClick={() => removeGarment(index)}
                disabled={form.garments.length === 1}
                aria-label={`Remove garment ${index + 1}`}
                title="Remove garment"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <h3 className="form-section-title">Pickup and delivery</h3>

        <div className="form-grid">
          <label className="form-field">
            <span>Pickup date *</span>
            <input
              type="date"
              name="pickupDate"
              value={form.pickupDate}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            <span>Expected delivery date *</span>
            <input
              type="date"
              name="deliveryDate"
              value={form.deliveryDate}
              onChange={handleChange}
              min={form.pickupDate || undefined}
              required
            />
          </label>

          <label className="form-field full-width">
            <span>Additional notes</span>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Special instructions (optional)"
              rows={3}
            />
          </label>
        </div>

        <div className="order-price-summary">
          <span>Estimated Total</span>
          <strong>₹{totalPrice}</strong>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button type="submit" className="primary-button">
            Continue
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewOrder;
