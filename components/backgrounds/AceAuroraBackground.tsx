"use client";

import type React from "react";
import { motion,Variants } from "motion/react"

export default function AceAuroraBackground() {
  // Aurora animation variants
  const auroraVariants:Variants = {
    initial: {
      backgroundPosition: "50% 50%, 50% 50%",
    },
    animate: {
      backgroundPosition: ["50% 50%, 50% 50%", "350% 50%, 350% 50%"],
      transition: {
        duration: 90,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  // Same correction needed for afterVariants
  const afterVariants:Variants = {
    initial: {
      backgroundPosition: "50% 50%, 50% 50%",
    },
    animate: {
      backgroundPosition: ["50% 50%, 50% 50%", "350% 50%, 350% 50%"],
      transition: {
        duration: 90,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <main>
      <div className="absolute -z-10 overflow-hidden inset-0 flex flex-col items-center justify-center bg-background">
        
          <motion.div
            initial="initial"
            animate="animate"
            variants={auroraVariants}
            className="pointer-events-none absolute -inset-[10px] opacity-50 blur-[10px] 
            bg-[repeating-linear-gradient(100deg,hsl(var(--background))_0%,hsl(var(--background))_7%,transparent_10%,transparent_12%,hsl(var(--background))_16%),repeating-linear-gradient(100deg,hsl(var(--primary))_10%,hsl(var(--secondary))_15%,hsl(var(--primary))_20%,hsl(var(--secondary))_25%,hsl(var(--primary))_30%)] 
            bg-[length:300%_200%] [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={afterVariants}
              className="absolute inset-0 
              bg-[repeating-linear-gradient(100deg,hsl(var(--background))_0%,hsl(var(--background))_7%,transparent_10%,transparent_12%,hsl(var(--background))_16%),repeating-linear-gradient(100deg,hsl(var(--primary))_10%,hsl(var(--secondary))_15%,hsl(var(--primary))_20%,hsl(var(--secondary))_25%,hsl(var(--primary))_30%)] 
              bg-[length:200%_100%] bg-fixed mix-blend-difference [mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]"
            />
          </motion.div>
      
       
 
      </div>
    </main>
  );
}