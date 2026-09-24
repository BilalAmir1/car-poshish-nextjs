const paths: Record<string, React.ReactNode> = {
  shop: (
    <>
      <path d="M3 6h18l-1.6 4.4a2 2 0 0 1-1.9 1.3H6.5a2 2 0 0 1-1.9-1.3L3 6Z" />
      <path d="M5 11.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8.5" />
      <path d="M9.5 21v-5.5h5V21" />
    </>
  ),
  star: (
    <path d="M12 3.3l2.5 5.2 5.7.5-4.3 3.9 1.2 5.6L12 15.6l-5.1 2.9 1.2-5.6-4.3-3.9 5.7-.5L12 3.3Z" />
  ),
  enter: (
    <>
      <path d="M14.5 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.5" />
      <path d="M10 12h11" />
      <path d="M17.5 8.5 21 12l-3.5 3.5" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 8.2A2.2 2.2 0 0 1 6.2 6h11.6A2.2 2.2 0 0 1 20 8.2v1" />
      <rect x="3" y="9" width="18" height="10.5" rx="1.8" />
      <circle cx="16" cy="14.2" r="1.15" fill="currentColor" stroke="none" />
    </>
  ),
  check: <path d="M5 13l4 4L19 7" />,
  phone: (
    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.8 21 3 13.2 3 3.6c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1L6.6 10.8Z" />
  ),
  chat: (
    <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.5-.8L4 20l1-4.8a8.3 8.3 0 0 1-.7-3.2A8.4 8.4 0 0 1 12.9 3a8.4 8.4 0 0 1 8.1 8.5Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5S5.5 15 5.5 10a6.5 6.5 0 1 1 13 0c0 5-6.5 11.5-6.5 11.5Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3.2 1.9" />
    </>
  ),
  droplet: <path d="M12 3.2s6.3 6.9 6.3 11.3a6.3 6.3 0 1 1-12.6 0c0-4.4 6.3-11.3 6.3-11.3Z" />,
  cloth: (
    <>
      <path d="M4.5 4h10.7L20 8.8V20H4.5Z" />
      <path d="M15.2 4v4.8H20" />
    </>
  ),
  tyre: (
    <>
      <circle cx="12" cy="12" r="7.8" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 4.2v3.4M12 16.4v3.4M4.2 12h3.4M16.4 12h3.4" />
    </>
  ),
  spray: (
    <>
      <path d="M9.5 8.3h4.3l-.9-3.6h1.8l2.6 3.6h.6a2 2 0 0 1 2 2v9.2a1 1 0 0 1-1 1H8.5a1 1 0 0 1-1-1V10.3a2 2 0 0 1 2-2Z" />
      <path d="M4.5 8h1.2M6.3 5.6l.9.9M9.3 4.8v1.2" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 2.5c.7 4 2.3 5.6 6.3 6.3-4 .7-5.6 2.3-6.3 6.3-.7-4-2.3-5.6-6.3-6.3 4-.7 5.6-2.3 6.3-6.3Z" />
      <path d="M19 14.5c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" />
    </>
  ),
  seat: (
    <>
      <path d="M7.5 21v-6.8A4.2 4.2 0 0 1 11.7 10h.6a4.2 4.2 0 0 1 4.2 4.2V21" />
      <path d="M7.5 15h9M7.5 21h9" />
    </>
  ),
  shield: <path d="M12 2.3 4.5 5.2v6c0 5.1 3.4 8.7 7.5 10.5 4.1-1.8 7.5-5.4 7.5-10.5v-6L12 2.3Z" />,
  wrench: (
    <path d="M14.7 6.4a4 4 0 0 0-5.4 5.3L3 18l3 3 6.3-6.3a4 4 0 0 0 5.3-5.4l-2.8 2.8-2.9-2.9 2.8-2.8Z" />
  ),
  bulb: (
    <>
      <path d="M9 18.5h6M10 21.2h4" />
      <path d="M12 3.5a6.2 6.2 0 0 0-3.6 11.3c.5.4.8 1 .8 1.7v.5h5.6v-.5c0-.7.3-1.3.8-1.7A6.2 6.2 0 0 0 12 3.5Z" />
    </>
  ),
  chevron: <path d="M6 9l6 6 6-6" />,
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M3 4h2l2.2 11.2a1.8 1.8 0 0 0 1.8 1.5h7.6a1.8 1.8 0 0 0 1.77-1.47L20 8H6" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1.5 1.5 0 0 0 1.5 1.4h7a1.5 1.5 0 0 0 1.5-1.4L18 7" />
    </>
  ),
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.3 12.3l2.5 2.5 5-5" />
    </>
  ),
  "shop-front": (
    <>
      <path d="M3 21h18" />
      <path d="M5 21V10M19 21V10" />
      <path d="M3 10l1.5-6h15L21 10Z" />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18.5" r="1.6" />
      <circle cx="17.5" cy="18.5" r="1.6" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </>
  ),
  steering: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8V4.2M8.5 14.2 5 17M15.5 14.2 19 17" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export default function Icon({
  name,
  size = 20,
  strokeWidth = 1.6,
  className,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
