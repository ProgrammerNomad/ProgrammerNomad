"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

// Match the server tree on the first client render; apply the preference after hydration.
// CSS also reveals these wrappers immediately for reduced-motion users before JS loads.
function useHydratedReducedMotion() {
  const reduced = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated && reduced;
}

export function MotionSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useHydratedReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-motion-reveal
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useHydratedReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-motion-reveal
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionStaggerItem({ children }: { children: React.ReactNode }) {
  const reduced = useHydratedReducedMotion();
  if (reduced) {
    return children;
  }

  return (
    <motion.div
      data-motion-reveal
      className="h-full"
      variants={{
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
    >
      {children}
    </motion.div>
  );
}
