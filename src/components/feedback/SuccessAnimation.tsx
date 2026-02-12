"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SuccessAnimationProps {
  trigger: boolean;
  xp?: number;
}

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: (Math.random() - 0.5) * 300,
  y: -(Math.random() * 200 + 100),
  rotate: Math.random() * 720 - 360,
  scale: Math.random() * 0.5 + 0.5,
  color: ["#f43f5e", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"][
    Math.floor(Math.random() * 6)
  ],
  delay: Math.random() * 0.3,
}));

export default function SuccessAnimation({ trigger, xp = 5 }: SuccessAnimationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] pointer-events-none flex items-center justify-center"
        >
          {/* Confetti particles */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [1, 1, 0],
                scale: [0, p.scale, 0],
                rotate: p.rotate,
              }}
              transition={{
                duration: 1.2,
                delay: p.delay,
                ease: "easeOut",
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: p.color }}
            />
          ))}

          {/* Central XP burst */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0] }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
          >
            +{xp} XP
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
