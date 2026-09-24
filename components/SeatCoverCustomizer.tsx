"use client";

import { useMemo, useState } from "react";
import Icon from "./Icon";
import type { SeatCoverConfig } from "@/lib/site-config";

function darkenHex(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount);
  const b = Math.max(0, (num & 0x0000ff) - amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function SeatCoverCustomizer({
  config,
  whatsapp,
}: {
  config: SeatCoverConfig;
  whatsapp: string;
}) {
  const [carTypeIndex, setCarTypeIndex] = useState(0);
  const [materialIndex, setMaterialIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [stitchingIndex, setStitchingIndex] = useState(0);

  const carType = config.carTypes[carTypeIndex];
  const material = config.materials[materialIndex];
  const color = config.colors[colorIndex];
  const stitching = config.stitchingOptions[stitchingIndex];

  const mainFill = color.hex;
  const bolsterFill = darkenHex(color.hex, 32);
  const stitchColor = stitching?.hex || darkenHex(color.hex, 55);
  const total = carType.price + material.priceAdd;
  const isFabric = material.label.toLowerCase().includes("fabric");
  const isPremium = material.label.toLowerCase().includes("premium");

  const whatsappUrl = useMemo(() => {
    const lines = [
      "Hi, I'd like to order custom seat covers with this design:",
      "",
      `Car type: ${carType.label}`,
      `Material: ${material.label}`,
      `Color: ${color.label}`,
      `Stitching: ${stitching?.label ?? "Matching"}`,
      "",
      `Estimated price: Rs. ${total.toLocaleString("en-PK")}`,
    ];
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [carType, material, color, stitching, total, whatsapp]);

  return (
    <div className="seatcover-layout">
      <div className="seatcover-preview">
        <div className="shine-wrap seatcover-canvas">
          <svg viewBox="0 0 300 340" width="100%" role="img" aria-label={`Seat cover preview: ${color.label} ${material.label}`}>
            <ellipse cx="150" cy="325" rx="110" ry="10" fill="#D9E7F5" />

            {/* Headrest */}
            <rect x="125" y="58" width="8" height="22" fill="#B9C6D2" />
            <rect x="167" y="58" width="8" height="22" fill="#B9C6D2" />
            <rect x="95" y="10" width="110" height="55" rx="18" fill={mainFill} style={{ transition: "fill 0.3s ease" }} />
            <rect
              x="108"
              y="20"
              width="84"
              height="30"
              rx="10"
              fill="none"
              stroke={stitchColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{ transition: "stroke 0.3s ease" }}
            />

            {/* Seatback with side bolsters */}
            <rect x="40" y="90" width="220" height="150" rx="26" fill={bolsterFill} style={{ transition: "fill 0.3s ease" }} />
            <rect x="75" y="90" width="150" height="150" rx="22" fill={mainFill} style={{ transition: "fill 0.3s ease" }} />
            <rect
              x="95"
              y="108"
              width="110"
              height="115"
              rx="14"
              fill="none"
              stroke={stitchColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{ transition: "stroke 0.3s ease" }}
            />
            <line x1="150" y1="108" x2="150" y2="223" stroke={stitchColor} strokeWidth="2" strokeDasharray="4 4" style={{ transition: "stroke 0.3s ease" }} />

            {/* Cushion with side bolsters */}
            <rect x="30" y="248" width="240" height="72" rx="22" fill={bolsterFill} style={{ transition: "fill 0.3s ease" }} />
            <rect x="62" y="248" width="176" height="72" rx="18" fill={mainFill} style={{ transition: "fill 0.3s ease" }} />
            <rect
              x="80"
              y="262"
              width="140"
              height="44"
              rx="10"
              fill="none"
              stroke={stitchColor}
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{ transition: "stroke 0.3s ease" }}
            />

            {/* Material texture overlays */}
            {isPremium && (
              <g opacity="0.5" style={{ transition: "opacity 0.3s ease" }}>
                <polygon points="75,90 115,90 95,240 55,240" fill="#FFFFFF" opacity="0.18" />
                <polygon points="150,10 170,10 150,240 130,240" fill="#FFFFFF" opacity="0.12" />
              </g>
            )}
            {isFabric && (
              <g opacity="0.35">
                <defs>
                  <pattern id="fabricDots" width="10" height="10" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#000000" opacity="0.25" />
                  </pattern>
                </defs>
                <rect x="75" y="90" width="150" height="150" fill="url(#fabricDots)" />
                <rect x="62" y="248" width="176" height="72" fill="url(#fabricDots)" />
              </g>
            )}
          </svg>
        </div>

        <div className="seatcover-price-box">
          <span className="seatcover-price-label">Estimated Price</span>
          <span className="seatcover-price-value">Rs. {total.toLocaleString("en-PK")}</span>
          {config.turnaroundNote && <span className="seatcover-turnaround">{config.turnaroundNote}</span>}
        </div>
      </div>

      <div className="seatcover-controls">
        <div className="option-group">
          <h3>Car Type</h3>
          <div className="option-cards">
            {config.carTypes.map((ct, i) => (
              <button
                type="button"
                key={ct.label}
                className={`option-card${i === carTypeIndex ? " selected" : ""}`}
                onClick={() => setCarTypeIndex(i)}
              >
                <strong>{ct.label}</strong>
                <span>Rs. {ct.price.toLocaleString("en-PK")}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="option-group">
          <h3>Material</h3>
          <div className="option-cards">
            {config.materials.map((m, i) => (
              <button
                type="button"
                key={m.label}
                className={`option-card${i === materialIndex ? " selected" : ""}`}
                onClick={() => setMaterialIndex(i)}
              >
                <strong>{m.label}</strong>
                <span className="option-card-desc">{m.description}</span>
                <span>
                  {m.priceAdd === 0 ? "Included" : m.priceAdd > 0 ? `+Rs. ${m.priceAdd.toLocaleString("en-PK")}` : `−Rs. ${Math.abs(m.priceAdd).toLocaleString("en-PK")}`}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="option-group">
          <h3>Color</h3>
          <div className="swatch-row">
            {config.colors.map((c, i) => (
              <button
                type="button"
                key={c.label}
                className={`swatch${i === colorIndex ? " selected" : ""}`}
                style={{ backgroundColor: c.hex }}
                onClick={() => setColorIndex(i)}
                aria-label={`Color: ${c.label}`}
                title={c.label}
              />
            ))}
          </div>
          <span className="swatch-label">{color.label}</span>
        </div>

        {config.stitchingOptions.length > 0 && (
          <div className="option-group">
            <h3>Stitching Accent</h3>
            <div className="swatch-row">
              {config.stitchingOptions.map((s, i) => (
                <button
                  type="button"
                  key={s.label}
                  className={`swatch swatch-sm${i === stitchingIndex ? " selected" : ""}`}
                  style={{ backgroundColor: s.hex || mainFill }}
                  onClick={() => setStitchingIndex(i)}
                  aria-label={`Stitching: ${s.label}`}
                  title={s.label}
                />
              ))}
            </div>
            <span className="swatch-label">{stitching?.label ?? "Matching"}</span>
          </div>
        )}

        <a className="btn btn-whatsapp btn-lg" href={whatsappUrl} target="_blank" rel="noopener" style={{ width: "100%", marginTop: 8 }}>
          <Icon name="chat" size={18} />
          Request This Design — Rs. {total.toLocaleString("en-PK")}
        </a>
        <p className="seatcover-note">
          This sends your design to us on WhatsApp so we can confirm fit and
          availability before you order — custom work isn't added to the
          cart directly.
        </p>
      </div>
    </div>
  );
}
