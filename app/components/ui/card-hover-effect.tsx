import { cn } from "./utils";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface HoverItem {
  children: React.ReactNode; // children berisi Card kamu
  link?: string;
}

export function HoverEffect({
  items,
  className,
}: {
  items: HoverItem[];
  className?: string;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
        className
      )}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative group cursor-pointer rounded-xl"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Hover glow mengikuti ukuran Card */}
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                layoutId="hoverGlow"
                className="absolute inset-0 rounded-xl bg-blue-50/70 border border-blue-200 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.20 }}
              />
            )}
          </AnimatePresence>

          <a href={item.link || "#"} className="relative block z-10">
            <motion.div
              whileHover={{
                y: -4,
                transition: { duration: 0.25 },
              }}
            >
              {item.children} {/* ← Card shadcn kamu tepat di sini */}
            </motion.div>
          </a>
        </div>
      ))}
    </div>
  );
}
