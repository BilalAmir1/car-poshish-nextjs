import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/cms";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Review your cart and choose pickup or delivery — cash on delivery or pickup, no online payment required.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: true },
};

export default async function CheckoutPage() {
  const siteConfig = await getSiteSettings();

  return (
    <section style={{ paddingTop: 48 }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: 32 }}>
          <span className="kicker">Checkout</span>
          <h1 style={{ fontSize: 34 }}>Complete Your Order</h1>
          <p>
            Choose pickup or delivery below. Pay in cash when you receive
            your order — no online payment needed.
          </p>
        </div>

        <CheckoutForm
          deliveryZones={siteConfig.deliveryZones}
          freePickup={siteConfig.freePickup}
          whatsapp={siteConfig.whatsapp}
          shopAddress={`${siteConfig.address.street}, ${siteConfig.address.city}`}
        />
      </div>
    </section>
  );
}
