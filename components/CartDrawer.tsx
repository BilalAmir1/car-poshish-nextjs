"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import Icon, { type IconName } from "./Icon";

export default function CartDrawer() {
  const { items, subtotal, isOpen, closeCart, removeItem, setQuantity } = useCart();

  return (
    <>
      <div
        className={`cart-overlay${isOpen ? " open" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer${isOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <div className="cart-drawer-header">
          <h2>
            <Icon name="cart" size={20} /> Your Cart
          </h2>
          <button
            type="button"
            className="cart-close"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <Icon name="plus" size={22} className="cart-close-icon" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <p>Your cart is empty.</p>
            <Link href="/shop" onClick={closeCart} className="btn btn-ghost">
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-items">
              {items.map((item) => (
                <li className="cart-item" key={item.id}>
                  <div className="cart-item-icon" aria-hidden="true">
                    <Icon name={item.icon as IconName} size={20} />
                  </div>
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">
                      Rs. {item.price.toLocaleString("en-PK")}
                    </span>
                  </div>
                  <div className="cart-item-qty">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                    >
                      <Icon name="minus" size={14} />
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                    >
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="cart-item-remove"
                    aria-label={`Remove ${item.name} from cart`}
                    onClick={() => removeItem(item.id)}
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer-footer">
              <div className="cart-subtotal">
                <span>Subtotal</span>
                <strong>Rs. {subtotal.toLocaleString("en-PK")}</strong>
              </div>
              <p className="cart-note">
                Delivery fee (if applicable) is added at checkout. Pay by
                cash on delivery or pickup.
              </p>
              <Link
                href="/checkout"
                className="btn btn-call btn-lg"
                onClick={closeCart}
                style={{ width: "100%" }}
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
