"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import Icon from "./Icon";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/gallery", label: "Our Work" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  phone,
}: {
  phone: string;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount, openCart } = useCart();

  const close = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            Car <span className="dot">Poshish</span>
          </Link>

          <nav
            className={`main-nav${open ? " open" : ""}`}
            id="mainNav"
            aria-label="Main menu"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={pathname === link.href ? "page" : undefined}
                className={pathname === link.href ? "active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-cta">
            <a
              className="btn btn-call"
              href={`tel:${phone}`}
              aria-label="Call Car Poshish now"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.6c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1L6.6 10.8Z"
                  fill="currentColor"
                />
              </svg>
              Call Now
            </a>
            <button
              type="button"
              className="cart-trigger"
              onClick={openCart}
              aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
            >
              <Icon name="cart" size={22} />
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </button>
            <button
              className="menu-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mainNav"
              onClick={() => setOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  stroke="var(--ocean)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div
        className={`overlay${open ? " open" : ""}`}
        onClick={close}
        aria-hidden="true"
      />
    </>
  );
}
