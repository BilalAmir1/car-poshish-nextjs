// Notifies the shop owner (you) the moment a new order comes in — via
// WhatsApp first, email second. Both are optional and independent: if
// only one is configured, that one fires; if neither is configured,
// nothing happens except a console warning (checkout itself never fails
// because of this file).

export interface OwnerNotificationOrder {
  orderNumber: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  fulfillmentMethod: "pickup" | "delivery";
  deliveryZone?: string;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  notes?: string;
}

// A short timeout on both requests — a slow or unreachable notification
// service should never noticeably delay the customer's checkout response.
const REQUEST_TIMEOUT_MS = 8000;

export async function notifyOwnerOfNewOrder(order: OwnerNotificationOrder): Promise<void> {
  const results = await Promise.allSettled([sendWhatsAppAlert(order), sendEmailAlert(order)]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("[notify] Owner notification failed unexpectedly:", result.reason);
    }
  }
}

async function sendWhatsAppAlert(order: OwnerNotificationOrder): Promise<void> {
  const phone = process.env.OWNER_WHATSAPP_NUMBER;
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) {
    console.warn(
      "[notify] WhatsApp owner alert skipped — OWNER_WHATSAPP_NUMBER or " +
        "CALLMEBOT_API_KEY not set. See the README for setup."
    );
    return;
  }

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(formatOrderMessage(order))}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok) {
      console.error(`[notify] CallMeBot WhatsApp alert failed (${res.status}): ${await res.text()}`);
    }
  } catch (err) {
    console.error("[notify] Could not reach CallMeBot for the WhatsApp alert:", err);
  }
}

async function sendEmailAlert(order: OwnerNotificationOrder): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !to) {
    console.warn(
      "[notify] Email owner alert skipped — RESEND_API_KEY or OWNER_EMAIL " +
        "not set. See the README for setup."
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to,
        subject: `New order ${order.orderNumber} — Rs. ${order.total.toLocaleString("en-PK")}`,
        text: formatOrderMessage(order),
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error(`[notify] Resend email alert failed (${res.status}): ${await res.text()}`);
    }
  } catch (err) {
    console.error("[notify] Could not reach Resend for the email alert:", err);
  }
}

function formatOrderMessage(order: OwnerNotificationOrder): string {
  const lines = [
    `New order ${order.orderNumber}`,
    "",
    ...order.items.map(
      (i) => `- ${i.name} x${i.quantity} (Rs. ${(i.price * i.quantity).toLocaleString("en-PK")})`
    ),
    "",
    `Subtotal: Rs. ${order.subtotal.toLocaleString("en-PK")}`,
  ];

  if (order.fulfillmentMethod === "delivery") {
    lines.push(
      `Delivery (${order.deliveryZone ?? "unspecified area"}): Rs. ${order.deliveryFee.toLocaleString("en-PK")}`,
      `Total: Rs. ${order.total.toLocaleString("en-PK")} (cash on delivery)`,
      "",
      `Deliver to: ${order.deliveryAddress ?? ""}, ${order.deliveryCity ?? ""}`
    );
  } else {
    lines.push(`Total: Rs. ${order.total.toLocaleString("en-PK")} (cash on pickup)`);
  }

  lines.push("", `Customer: ${order.customerName}`, `Phone: ${order.customerPhone}`);

  if (order.notes) lines.push(`Notes: ${order.notes}`);

  return lines.join("\n");
}
