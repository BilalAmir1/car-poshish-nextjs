import Icon, { type IconName } from "./Icon";

const items: { icon: IconName; title: string; sub: string }[] = [
  { icon: "shop", title: "Modern Shop", sub: "Fully-equipped facility" },
  { icon: "star", title: "5+ Years Experience", sub: "Trusted in Lahore" },
  { icon: "enter", title: "Walk-Ins Welcome", sub: "No appointment needed" },
  { icon: "wallet", title: "Fair Pricing", sub: "No hidden charges" },
];

export default function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="container trust-grid">
        {items.map((item) => (
          <div className="trust-item" key={item.title}>
            <Icon name={item.icon} size={22} />
            <span>
              <strong>{item.title}</strong>
              <span className="sub">{item.sub}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
