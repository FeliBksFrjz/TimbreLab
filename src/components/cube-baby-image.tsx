"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function CubeBabyImage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full max-w-[700px] aspect-[2/1] mx-auto bg-transparent relative mb-10" />
    );
  }

  return (
    <div 
      className="w-full max-w-[700px] mx-auto bg-transparent relative mb-10 flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* A Imagem do Pedal com animação 3D de entrada */}
      <motion.img 
        src="/images/cube-baby.png" 
        alt="Pedaleira Cuvave Cube Baby" 
        className="w-full h-auto object-contain block select-none bg-transparent"
        draggable={false}
        initial={{ opacity: 0, scale: 0.8, rotateX: -360 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{
          duration: 1.5,
          ease: "easeOut"
        }}
      />
    </div>
  );
}
