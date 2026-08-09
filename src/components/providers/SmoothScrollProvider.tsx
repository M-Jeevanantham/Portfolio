"use client";

import { usePathname } from 'next/navigation';
import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

/**
 * SmoothScrollProvider wraps the portfolio with Lenis smooth scrolling.
 * It is intentionally DISABLED on /admin routes because Lenis intercepts
 * all wheel events (via non-passive listeners) which prevents overflow-y-auto
 * containers inside the admin panel from scrolling with the mouse wheel.
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  // On admin pages, skip Lenis entirely — use native browser scroll
  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
