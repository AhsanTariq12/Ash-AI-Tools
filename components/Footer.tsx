"use client"
import { motion, Variants } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVariants : Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants : Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const auroraVariants: Variants = {
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
    <motion.footer
      className="relative w-full border-t overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10 bg-background">
        <motion.div
          initial="initial"
          animate="animate"
          variants={auroraVariants}
          className="pointer-events-none absolute -inset-[10px] opacity-30 blur-[10px] 
          bg-[repeating-linear-gradient(100deg,hsl(var(--background))_0%,hsl(var(--background))_7%,transparent_10%,transparent_12%,hsl(var(--background))_16%),repeating-linear-gradient(100deg,hsl(var(--primary))_10%,hsl(var(--secondary))_15%,hsl(var(--primary))_20%,hsl(var(--secondary))_25%,hsl(var(--primary))_30%)] 
          bg-[length:300%_200%] [mask-image:radial-gradient(ellipse_at_50%_50%,black_20%,transparent_80%)]"
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col items-center space-y-4">
          {/* Main Content */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-2 text-center"
            variants={itemVariants}
          >
            <motion.span
              className="text-2xl"
              whileHover={{ scale: 1.3, rotate: 20 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              🎓
            </motion.span>
            <p className="text-sm md:text-base">
              <span className="text-muted-foreground">Created by </span>
              <motion.span
                className="font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Ahsan Tariq
              </motion.span>
            </p>
          </motion.div>

          {/* Roll Number */}
          <motion.div
            className="flex items-center gap-2"
            variants={itemVariants}
          >
            <motion.span
              className="text-lg"
              animate={{
                rotate: [0, 10, -10, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              🆔
            </motion.span>
            <p className="text-xs md:text-sm text-muted-foreground font-mono">
              Roll No: F24BDOCS1M01061
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="w-24 h-px bg-border"
            variants={itemVariants}
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Copyright & Tech Stack */}
          <motion.div
            className="flex flex-col md:flex-row items-center gap-2 text-xs text-muted-foreground"
            variants={itemVariants}
          >
            <div className="flex items-center gap-2">
              <motion.span
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ©
              </motion.span>
              <span>{currentYear} Ash AI Tools</span>
            </div>
            <span className="hidden md:inline">•</span>
            <div className="flex items-center gap-2">
              <span>Built with</span>
              <motion.span
                animate={{
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ❤️
              </motion.span>
              <span>using Next.js & Hugging Face</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;