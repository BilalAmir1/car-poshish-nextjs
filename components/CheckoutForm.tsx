"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import Icon from "./Icon";
import type { DeliveryZone } from "@/lib/site-config";
import type { CartItem, FulfillmentMethod, OrderPayload, OrderResult } from "@/lib/cart";

interface OrderSnapshot {
  items: CartItem[];
  subtotal: number;
  fulfillment: FulfillmentMethod;
  deliveryZoneLabel?: string;
  deliveryFee: number;
  total: number;
  whatsappUrl: string;
}

export default function CheckoutForm({
  deliveryZones,
  freePickup,
  whatsapp,
  shopAddress,
}: {
  deliveryZones: DeliveryZone[];
  freePickup: boolean;
  whatsapp: string;
  shopAddress: string;
}) {
  const { items, subtotal, clearCart } = useCart();

  const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("pickup");
  const [zoneIndex, setZoneIndex] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("Lahore");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  // Captured at submit time, before the cart is cleared — this is what the
  // confirmation screen and WhatsApp link read from, NOT the live cart
  // (which is empty by the time this screen renders).
  const [orderSnapshot, setOrderSnapshot] = useState<OrderSnapshot | null>(null);

  const deliveryFee = fulfillment === "delivery" ? deliveryZones[zoneIndex]?.fee ?? 0 : 0;
  const total = subtotal + deliveryFee;

  function buildWhatsappUrl(
    snapshotItems: CartItem[],
    snapshotSubtotal: number,
    snapshotFulfillment: FulfillmentMethod,
    zoneLabel: string | undefined,
    fee: number,
    grandTotal: number,
    orderNumber: string
  ): string {
    const lines = [
      `Hi, I just placed order ${orderNumber} on the website.`,
      "",
      ...snapshotItems.map(
        (i) => `- ${i.name} x${i.quantity} (Rs. ${(i.price * i.quantity).toLocaleString("en-PK")})`
      ),
      "",
      `Subtotal: Rs. ${snapshotSubtotal.toLocaleString("en-PK")}`,
      snapshotFulfillment === "delivery"
        ? `Delivery (${zoneLabel ?? ""}): Rs. ${fee.toLocaleString("en-PK")}`
        : "Pickup from shop: Rs. 0",
      `Total: Rs. ${grandTotal.toLocaleString("en-PK")} (cash on ${snapshotFulfillment === "delivery" ? "delivery" : "pickup"})`,
    ];
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !customerPhone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    if (fulfillment === "delivery" && (!deliveryAddress.trim() || !deliveryCity.trim())) {
      setError("Please enter your delivery address and city.");
      return;
    }

    const zoneLabel = fulfillment === "delivery" ? deliveryZones[zoneIndex]?.label : undefined;

    const payload: OrderPayload = {
      items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      subtotal,
      fulfillmentMethod: fulfillment,
      deliveryZone: zoneLabel,
      deliveryFee,
      total,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      deliveryAddress: fulfillment === "delivery" ? deliveryAddress.trim() : undefined,
      deliveryCity: fulfillment === "delivery" ? deliveryCity.trim() : undefined,
      notes: notes.trim() || undefined,
    };

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // Surface the API's specific reason (CMS unavailable, item no
        // longer exists, delivery zone changed, etc.) rather than a
        // generic message — these are meaningful, actionable errors, not
        // just "something went wrong."
        let message = "Order could not be placed. Please try again, or call/WhatsApp us directly.";
        try {
          const body = (await res.json()) as { error?: string };
          if (body?.error) message = body.error;
        } catch {
          // Response wasn't JSON — keep the generic message above.
        }
        setError(message);
        return;
      }

      const result = (await res.json()) as OrderResult;

      // Snapshot everything needed to render the confirmation screen and
      // build the WhatsApp link BEFORE clearing the cart — items/subtotal
      // from useCart() will be gone the instant clearCart() runs.
      setOrderSnapshot({
        items,
        subtotal,
        fulfillment,
        deliveryZoneLabel: zoneLabel,
        deliveryFee,
        total,
        whatsappUrl: buildWhatsappUrl(
          items,
          subtotal,
          fulfillment,
          zoneLabel,
          deliveryFee,
          total,
          result.orderNumber
        ),
      });
      setOrderResult(result);
      clearCart();
    } catch {
      setError("Something went wrong placing your order. Please try again, or call/WhatsApp us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (orderResult && orderSnapshot) {
    return (
      <div className="checkout-confirmation">
        <Icon name="check-circle" size={48} />
        <h2>Order Placed</h2>
        <p className="order-number">Order #{orderResult.orderNumber}</p>

        <ul className="checkout-summary-items checkout-confirmation-items">
          {orderSnapshot.items.map((item) => (
            <li key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {(item.price * item.quantity).toLocaleString("en-PK")}</span>
            </li>
          ))}
        </ul>
        <div className="checkout-summary-row checkout-summary-total">
          <span>Total</span>
          <span>Rs. {orderSnapshot.total.toLocaleString("en-PK")}</span>
        </div>

        <p>
          {orderSnapshot.fulfillment === "delivery"
            ? "We'll call you shortly to confirm your delivery."
            : `We'll have your order ready for pickup at ${shopAddress}.`}
        </p>
        <p className="cart-note">
          Pay in cash on {orderSnapshot.fulfillment === "delivery" ? "delivery" : "pickup"} — no
          online payment is needed. If payment isn't made at that time, the
          order won't be handed over.
        </p>
        <div className="checkout-confirmation-actions">
          <a className="btn btn-whatsapp btn-lg" href={orderSnapshot.whatsappUrl} target="_blank" rel="noopener">
            <Icon name="chat" size={18} /> Confirm on WhatsApp
          </a>
          <Link className="btn btn-ghost" href="/shop">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-confirmation">
        <p>Your cart is empty.</p>
        <Link className="btn btn-call" href="/shop">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-grid">
      <form className="checkout-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>How would you like your order?</legend>
          <div className="fulfillment-options">
            <label className={`fulfillment-option${fulfillment === "pickup" ? " selected" : ""}`}>
              <input
                type="radio"
                name="fulfillment"
                value="pickup"
                checked={fulfillment === "pickup"}
                onChange={() => setFulfillment("pickup")}
              />
              <Icon name="shop-front" size={22} />
              <span>
                <strong>Pickup from Shop</strong>
                <span>{freePickup ? "Free" : ""}</span>
              </span>
            </label>
            <label className={`fulfillment-option${fulfillment === "delivery" ? " selected" : ""}`}>
              <input
                type="radio"
                name="fulfillment"
                value="delivery"
                checked={fulfillment === "delivery"}
                onChange={() => setFulfillment("delivery")}
              />
              <Icon name="truck" size={22} />
              <span>
                <strong>Home Delivery</strong>
                <span>Fee depends on area</span>
              </span>
            </label>
          </div>
        </fieldset>

        {fulfillment === "delivery" && (
          <fieldset>
            <legend>Delivery Details</legend>
            <label className="field">
              <span>Delivery Area</span>
              <select
                value={zoneIndex}
                onChange={(e) => setZoneIndex(Number(e.target.value))}
              >
                {deliveryZones.map((zone, i) => (
                  <option value={i} key={zone.label}>
                    {zone.label} — Rs. {zone.fee.toLocaleString("en-PK")}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Delivery Address</span>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                placeholder="House / street / area"
                required
              />
            </label>
            <label className="field">
              <span>City</span>
              <input
                type="text"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                required
              />
            </label>
          </fieldset>
        )}

        <fieldset>
          <legend>Contact Details</legend>
          <label className="field">
            <span>Your Name</span>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Phone Number</span>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="03XX XXXXXXX"
              required
            />
          </label>
          <label className="field">
            <span>Notes (optional)</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Anything else we should know?"
            />
          </label>
        </fieldset>

        <div className="payment-note">
          <Icon name="wallet" size={18} />
          <span>
            <strong>Cash on {fulfillment === "delivery" ? "Delivery" : "Pickup"}</strong>
            <span>
              Pay in cash when you receive your order. No online payment is
              collected on this site.
            </span>
          </span>
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn btn-call btn-lg" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Placing Order…" : `Place Order — Rs. ${total.toLocaleString("en-PK")}`}
        </button>
      </form>

      <div className="checkout-summary">
        <h3>Order Summary</h3>
        <ul className="checkout-summary-items">
          {items.map((item) => (
            <li key={item.id}>
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {(item.price * item.quantity).toLocaleString("en-PK")}</span>
            </li>
          ))}
        </ul>
        <div className="checkout-summary-row">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toLocaleString("en-PK")}</span>
        </div>
        <div className="checkout-summary-row">
          <span>{fulfillment === "delivery" ? "Delivery Fee" : "Pickup"}</span>
          <span>{deliveryFee > 0 ? `Rs. ${deliveryFee.toLocaleString("en-PK")}` : "Free"}</span>
        </div>
        <div className="checkout-summary-row checkout-summary-total">
          <span>Total</span>
          <span>Rs. {total.toLocaleString("en-PK")}</span>
        </div>
      </div>
    </div>
  );
}
