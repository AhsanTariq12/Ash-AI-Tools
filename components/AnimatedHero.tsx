"use client";


import { motion } from "framer-motion";

import AceAuroraBackground from "@/components/backgrounds/AceAuroraBackground";
import Link from "next/link";


const AnimatedHero = () => {
  return (
    <div className="relative flex flex-col min-h-[100vh] items-center justify-center text-foreground overflow-hidden">
      <AceAuroraBackground />
      <div className="container mx-auto px-4 sm:px-6 md:px-8 max-w-6xl z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col gap-6 sm:gap-8 md:gap-10 items-center text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl"
          >
           Artificial Intelligence Usage At Its Peak!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-muted-foreground max-w-2xl"
          >
           Use our stunning tools and elevate your digital presence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-4 sm:mt-6 md:mt-8"
          >
            <Link href="/" className="relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/20 to-primary/0 opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000"></span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Background glow effects */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
}
export default AnimatedHero;