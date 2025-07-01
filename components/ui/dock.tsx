// components/ui/dock.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface DockProps {
  items: DockItem[];
  className?: string;
}

export default function DockComponent({ items, className }: DockProps) {
  return (
    <div className={`flex justify-around p-4 rounded-full bg-background/80 backdrop-blur-md border border-gray-200 shadow-lg ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-16 w-16 flex flex-col items-center justify-center"
            onClick={item.onClick}
          >
            {item.href ? (
              <Link href={item.href}>
                <div className="text-xl">{item.icon}</div>
                <span className="text-xs mt-1">{item.title}</span>
              </Link>
            ) : (
              <button onClick={item.onClick} aria-label={item.title}>
                <div className="text-xl">{item.icon}</div>
                <span className="text-xs mt-1">{item.title}</span>
              </button>
            )}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}