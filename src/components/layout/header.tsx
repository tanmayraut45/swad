"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Phone, ChefHat } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { navLinks } from "@/lib/data";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence, type Easing } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { language } = useLanguage();

  // Smooth scroll state detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking with Intersection Observer
  useEffect(() => {
    const sectionIds = navLinks.map((link) => link.href.replace("#", ""));

    const observerOptions = {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Animation variants with type-safe easing
  const cubicBezierEase: Easing = [0.22, 1, 0.36, 1];
  const easeOut: Easing = "easeOut";

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: cubicBezierEase,
      },
    },
  };

  const linkVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2, ease: easeOut },
    },
  };

  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      transition: { duration: 0.3, ease: easeOut },
    },
  };

  const mobileMenuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
        ease: easeOut,
      },
    }),
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500 ease-out",
        isScrolled
          ? "bg-background/70 shadow-lg backdrop-blur-xl border-b border-primary/10"
          : "bg-transparent"
      )}
      style={{
        backdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(20px) saturate(180%)" : "none",
      }}
    >
      {/* Gradient border glow effect when scrolled */}
      {isScrolled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
      )}

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-12">
        {/* Logo with hover animation */}
        <motion.div
          variants={logoVariants}
          initial="initial"
          whileHover="hover"
        >
          <Link href="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <ChefHat className="h-8 w-8 text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
            </motion.div>
            <span className="font-headline text-xl font-bold text-primary transition-all duration-300 group-hover:drop-shadow-[0_0_12px_hsl(var(--primary)/0.3)]">
              Swad Restaurant
            </span>
          </Link>
        </motion.div>

        {/* Desktop Navigation with smooth hover effects */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <motion.div
                key={link.href}
                variants={linkVariants}
                initial="initial"
                whileHover="hover"
              >
                <Link
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg",
                    isActive
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  )}
                >
                  {link.label[language]}
                  {/* Active indicator with smooth animation */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary/10"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  {/* Hover underline effect */}
                  <motion.span
                    className="absolute bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary/50 rounded-full"
                    whileHover={{ width: "60%" }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Desktop CTA Section */}
        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              size="sm"
              className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              <Link href="#contact">
                <Phone className="mr-2 h-4 w-4" />
                {language === "en" ? "Book a Table" : "टेबल बुक करा"}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative overflow-hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-xl"
            >
              <div className="p-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={handleLinkClick}
                  >
                    <ChefHat className="h-8 w-8 text-primary" />
                    <span className="font-headline text-xl font-bold text-primary">
                      Swad Restaurant
                    </span>
                  </Link>
                </motion.div>

                <nav className="mt-8 flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const isActive =
                      activeSection === link.href.replace("#", "");
                    return (
                      <motion.div
                        key={link.href}
                        custom={index}
                        variants={mobileMenuItemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={link.href}
                          onClick={handleLinkClick}
                          className={cn(
                            "block rounded-lg px-4 py-3 text-lg font-medium transition-all duration-300",
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80 hover:bg-muted hover:text-primary"
                          )}
                        >
                          {link.label[language]}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                <motion.div
                  className="mt-8 flex flex-col gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <LanguageToggle />
                  <Button asChild className="shadow-lg shadow-primary/20">
                    <Link href="#contact" onClick={handleLinkClick}>
                      <Phone className="mr-2 h-4 w-4" />
                      {language === "en" ? "Book a Table" : "टेबल बुक करा"}
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
