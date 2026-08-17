"use client";

import { usePathname } from "next/navigation";

// The animation itself lives entirely in CSS (see .page-flip-sheet /
// @keyframes page-turn-in in globals.css) and only ever animates `transform`
// and `opacity` — both run on the compositor thread, so there's no layout
// or paint work per frame and no impact on Lighthouse's Total Blocking Time.
//
// The one bit of JS here does no animation work at all: changing `key` when
// the route changes just tells React to unmount and remount this div, which
// restarts the CSS animation from its `from` state automatically. No
// animation library, no per-frame JS.
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="page-flip-perspective">
      <div key={pathname} className="page-flip-sheet">
        {children}
      </div>
    </div>
  );
}
