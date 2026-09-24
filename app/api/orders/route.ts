import { NextResponse } from "next/server";
import { getProducts, getSiteSettings } from "@/lib/cms";
import { notifyOwnerOfNewOrder } from "@/lib/notify";
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

  // Every price/fee used below comes exclusively from the CMS — never
  // from the client's request. If the CMS can't be reached, the order is
  // rejected outright rather than falling back to whatever the client
  // sent (which would mean silently trusting unverified prices).
  const [products, siteConfig] = await Promise.all([getProducts(), getSiteSettings()]);

  if (!siteConfig || products.length === 0) {
    console.error(
      "[orders] Rejected an order because the CMS is unreachable — no fallback " +
        "pricing data is used. Check STRAPI_URL and that the CMS is running."
    );
    return NextResponse.json(
      {
        error:
          "Ordering is temporarily unavailable. Please call or WhatsApp us directly to place your order.",
      },
      { status: 503 }
    );
  }

  const productsById = new Map(products.map((p) => [p.id, p]));

  // Any item that doesn't match a real, currently-listed product is
  // rejected rather than priced from client input — this could mean the
  // cart is stale (the product was removed/renamed) or the request was
  // tampered with, and neither case should silently succeed.
  const unknownItems = payload.items.filter((item) => !productsById.has(item.id));
  if (unknownItems.length > 0) {
    return NextResponse.json(
      {
        error:
          "One or more items in your cart are no longer available. Please refresh the shop page and try again.",
      },
      { status: 409 }
    );
  }

  let subtotal = 0;
  const verifiedItems = payload.items.map((item) => {
    const product = productsById.get(item.id)!;
    const quantity = Math.max(1, Math.floor(item.quantity) || 1);
    subtotal += product.price * quantity;
    return { name: product.name, price: product.price, quantity };
  });

  // Re-derive the delivery fee from the CMS's current zone list too —
  // rejected the same way if the requested zone doesn't currently exist.
  let deliveryFee = 0;
  if (payload.fulfillmentMethod === "delivery") {
    const zone = siteConfig.deliveryZones.find((z) => z.label === payload.deliveryZone);
    if (!zone) {
      return NextResponse.json(
        { error: "The selected delivery area is no longer available. Please choose again." },
        { status: 409 }
      );
    }
    deliveryFee = zone.fee;
  }
  const total = subtotal + deliveryFee;

  const orderNumber = generateOrderNumber();

  const strapiUrl = process.env.STRAPI_URL;
  const strapiToken = process.env.STRAPI_API_TOKEN;

  if (strapiToken) {
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
      `[orders] STRAPI_API_TOKEN not configured — order ${orderNumber} was NOT saved ` +
        "to the CMS. The customer will still get a WhatsApp confirmation link, but " +
        "there's no record of this order anywhere else. See the README."
    );
  }

  // Notify the shop owner directly — this fires regardless of whether the
  // Strapi save above succeeded, since an infra hiccup shouldn't mean the
  // order goes completely unnoticed. Awaited (not fire-and-forget) so it
  // isn't silently dropped on hosts that suspend the function once a
  // response is returned, but each channel has its own short timeout so a
  // slow/down notification service can't stall the customer's checkout.
  await notifyOwnerOfNewOrder({
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
  });

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
