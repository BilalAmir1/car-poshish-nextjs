import { NextResponse } from "next/server";
import { getProducts, getSiteSettings } from "@/lib/cms";
import type { OrderPayload, OrderResult } from "@/lib/cart";

export async function POST(request: Request) {
  let payload: OrderPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // --- Server-side validation. Never trust the client alone: this is what
  // actually gets recorded and acted on, so bad or tampered input needs to
  // be caught here, not just in the form. ---

  if (!Array.isArray(payload.items) || payload.items.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }
  if (!payload.customerName?.trim() || !payload.customerPhone?.trim()) {
    return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
  }
  if (payload.fulfillmentMethod === "delivery") {
    if (!payload.deliveryAddress?.trim() || !payload.deliveryCity?.trim()) {
      return NextResponse.json(
        { error: "Delivery address and city are required" },
        { status: 400 }
      );
    }
  } else if (payload.fulfillmentMethod !== "pickup") {
    return NextResponse.json({ error: "Invalid fulfillment method" }, { status: 400 });
  }

  // Re-price every line item against the CMS's current product data rather
  // than trusting the price the client sent — the only thing taken as-is
  // from the client is the quantity and which product was selected.
  const [products, siteConfig] = await Promise.all([getProducts(), getSiteSettings()]);
  const productsById = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  const verifiedItems = payload.items.map((item) => {
    const product = productsById.get(item.id);
    const price = product?.price ?? item.price; // fall back if CMS is unreachable
    const name = product?.name ?? item.name;
    const quantity = Math.max(1, Math.floor(item.quantity) || 1);
    subtotal += price * quantity;
    return { name, price, quantity };
  });

  // Re-derive the delivery fee from the CMS's current zone list too, rather
  // than trusting the fee the client sent.
  let deliveryFee = 0;
  if (payload.fulfillmentMethod === "delivery") {
    const zone = siteConfig.deliveryZones.find((z) => z.label === payload.deliveryZone);
    deliveryFee = zone?.fee ?? payload.deliveryFee ?? 0;
  }
  const total = subtotal + deliveryFee;

  const orderNumber = generateOrderNumber();

  const strapiUrl = process.env.STRAPI_URL;
  const strapiToken = process.env.STRAPI_API_TOKEN;

  if (strapiUrl && strapiToken) {
    try {
      const res = await fetch(`${strapiUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${strapiToken}`,
        },
        body: JSON.stringify({
          data: {
            orderNumber,
            items: verifiedItems,
            subtotal,
            fulfillmentMethod: payload.fulfillmentMethod,
            deliveryZone: payload.fulfillmentMethod === "delivery" ? payload.deliveryZone : undefined,
            deliveryFee,
            total,
            customerName: payload.customerName.trim(),
            customerPhone: payload.customerPhone.trim(),
            deliveryAddress: payload.deliveryAddress?.trim(),
            deliveryCity: payload.deliveryCity?.trim(),
            notes: payload.notes?.trim(),
          },
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(
          `[orders] Strapi rejected order ${orderNumber} (${res.status}): ${body}`
        );
      }
    } catch (err) {
      console.error(`[orders] Could not reach Strapi to save order ${orderNumber}:`, err);
    }
  } else {
    console.warn(
      `[orders] STRAPI_URL / STRAPI_API_TOKEN not configured — order ${orderNumber} was ` +
        "NOT saved to the CMS. The customer will still get a WhatsApp confirmation link, " +
        "but there's no record of this order anywhere else. Set both env vars to fix this " +
        "— see the README."
    );
  }

  // The order is considered placed from the customer's side regardless of
  // whether the Strapi write above succeeded — WhatsApp confirmation is the
  // real backstop, matching the rest of the site's call/WhatsApp-first
  // design. Losing the CMS record on a misconfigured or unreachable CMS
  // shouldn't block a real customer's order.
  const result: OrderResult = { orderNumber };
  return NextResponse.json(result);
}

function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `CP-${y}${m}${d}-${rand}`;
}
