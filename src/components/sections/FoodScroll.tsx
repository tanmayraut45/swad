"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Loader2 } from "lucide-react";

const FRAME_COUNT = 120;
const FRAME_PATH = "/frames/ezgif-frame-";

export default function FoodScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(ImageBitmap | null)[]>(
    new Array(FRAME_COUNT).fill(null)
  );
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const currentFrameRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // ENHANCEMENT: More cinematic spring settings for butter-smooth scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 25,
    restDelta: 0.0001,
  });

  // Map scroll to frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // ENHANCEMENT: Navbar visibility - hide when in hero section
  const navbarOpacity = useTransform(
    smoothProgress,
    [0, 0.15, 0.85, 1],
    [0, 0, 0, 1]
  );

  useEffect(() => {
    const unsubscribe = navbarOpacity.on("change", (latest) => {
      const header = document.querySelector("header");
      if (header) {
        (header as HTMLElement).style.opacity = String(latest);
        (header as HTMLElement).style.pointerEvents =
          latest < 0.5 ? "none" : "auto";
      }
    });
    return () => unsubscribe();
  }, [navbarOpacity]);

  // Draw frame to canvas with perfect centering and high-quality smoothing
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const img = imagesRef.current[frameNum];
    if (!img) return;

    // Only draw if frame changed
    if (frameNum === lastDrawnFrameRef.current) return;
    lastDrawnFrameRef.current = frameNum;

    // ENHANCEMENT: High-quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Get display dimensions (not scaled canvas dimensions)
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    // Clear with background color
    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate aspect ratios using display dimensions
    const displayAspect = displayWidth / displayHeight;
    const imageAspect = img.width / img.height;

    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspect > displayAspect) {
      // Image is wider - fit to width
      drawWidth = displayWidth;
      drawHeight = displayWidth / imageAspect;
      drawX = 0;
      drawY = (displayHeight - drawHeight) / 2;
    } else {
      // Image is taller - fit to height
      drawHeight = displayHeight;
      drawWidth = displayHeight * imageAspect;
      drawX = (displayWidth - drawWidth) / 2;
      drawY = 0;
    }

    // Scale coordinates for HiDPI
    ctx.drawImage(
      img,
      drawX * dpr,
      drawY * dpr,
      drawWidth * dpr,
      drawHeight * dpr
    );
  }, []);

  // RAF-based render loop for butter-smooth animation
  useEffect(() => {
    const animate = () => {
      const targetFrame = Math.round(currentFrameRef.current);
      const clampedFrame = Math.max(0, Math.min(FRAME_COUNT - 1, targetFrame));

      if (imagesRef.current[clampedFrame]) {
        drawFrame(clampedFrame);
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawFrame]);

  // Subscribe to frame index changes
  useEffect(() => {
    const unsubscribe = frameIndex.on("change", (latest) => {
      currentFrameRef.current = latest;
    });

    return () => unsubscribe();
  }, [frameIndex]);

  // Progressive image loading with createImageBitmap for performance
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;

    const loadImage = async (index: number): Promise<void> => {
      try {
        const frameNum = String(index + 1).padStart(3, "0");
        const response = await fetch(`${FRAME_PATH}${frameNum}.jpg`);
        const blob = await response.blob();

        // Use createImageBitmap for off-main-thread decoding
        const bitmap = await createImageBitmap(blob);

        if (isMounted) {
          imagesRef.current[index] = bitmap;
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));

          // Draw first frame immediately when loaded
          if (index === 0 && canvasRef.current) {
            drawFrame(0);
          }

          // ENHANCEMENT: Smooth transition when loading complete
          if (loadedCount === FRAME_COUNT) {
            // Small delay for smooth transition
            setTimeout(() => {
              setIsLoading(false);
              setTimeout(() => setShowContent(true), 100);
            }, 300);
          }
        }
      } catch (err) {
        console.error(`Failed to load frame ${index}:`, err);
      }
    };

    // Load frames in priority batches
    const loadInBatches = async () => {
      // Batch 1: Critical frames (first 15 frames)
      const critical = Array.from({ length: 15 }, (_, i) => i);
      await Promise.all(critical.map(loadImage));

      if (!isMounted) return;

      // Batch 2: Remaining frames in parallel chunks of 20
      const remaining = Array.from(
        { length: FRAME_COUNT - 15 },
        (_, i) => i + 15
      );

      for (let i = 0; i < remaining.length; i += 20) {
        if (!isMounted) break;
        const chunk = remaining.slice(i, i + 20);
        await Promise.all(chunk.map(loadImage));
      }
    };

    loadInBatches();

    return () => {
      isMounted = false;
      // Clean up bitmaps
      imagesRef.current.forEach((bitmap) => {
        if (bitmap) bitmap.close();
      });
    };
  }, [drawFrame]);

  // Handle canvas resize with device pixel ratio for sharpness
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      // Set canvas internal resolution for HiDPI
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      // Force redraw
      lastDrawnFrameRef.current = -1;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Text opacity transforms with smoother easing
  const intro = useTransform(smoothProgress, [0, 0.12, 0.22], [1, 1, 0]);
  const introY = useTransform(smoothProgress, [0, 0.22], [0, -50]);

  const story1 = useTransform(
    smoothProgress,
    [0.18, 0.28, 0.42, 0.52],
    [0, 1, 1, 0]
  );
  const story1X = useTransform(
    smoothProgress,
    [0.18, 0.28, 0.42, 0.52],
    [-30, 0, 0, -30]
  );

  const story2 = useTransform(
    smoothProgress,
    [0.48, 0.58, 0.72, 0.82],
    [0, 1, 1, 0]
  );
  const story2X = useTransform(
    smoothProgress,
    [0.48, 0.58, 0.72, 0.82],
    [30, 0, 0, 30]
  );

  const cta = useTransform(smoothProgress, [0.78, 0.88, 1], [0, 1, 1]);
  const ctaScale = useTransform(smoothProgress, [0.78, 0.88], [0.95, 1]);

  return (
    <div
      ref={containerRef}
      className="relative h-[400vh]"
      style={{ backgroundColor: "#0D0D0D" }}
    >
      {/* ENHANCEMENT: Smooth loading fade-out with AnimatePresence */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0D0D]"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-[#D4AF37]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline text-sm font-bold text-white">
                    {loadProgress}%
                  </span>
                </div>
              </div>
              <p className="font-headline text-xl text-white/80">
                Loading Experience...
              </p>
              <div className="h-1 w-48 overflow-hidden rounded-full bg-white/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#800000] to-[#D4AF37]"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Canvas Container - ENHANCEMENT: Better GPU compositing */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            backgroundColor: "#0D0D0D",
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />

        {/* Text Overlays with enhanced animations */}
        <AnimatePresence>
          {showContent && (
            <>
              {/* Intro Text - 0% with Y parallax */}
              <motion.div
                style={{ opacity: intro, y: introY }}
                className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
              >
                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 1, ease: "easeOut" }}
                  className="font-headline text-6xl font-bold text-white drop-shadow-2xl md:text-8xl lg:text-9xl"
                  style={{
                    textShadow:
                      "0 0 60px rgba(128, 0, 0, 0.6), 0 4px 30px rgba(0,0,0,0.9)",
                  }}
                >
                  <span className="text-[#D4AF37]">S</span>WAD
                </motion.h1>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="mt-6 max-w-2xl px-6 text-xl text-white/90 drop-shadow-lg md:text-2xl lg:text-3xl"
                >
                  Authentic Flavors, Unforgettable Moments
                </motion.p>
              </motion.div>

              {/* Story 1 - Left Aligned with X parallax */}
              <motion.div
                style={{ opacity: story1, x: story1X }}
                className="pointer-events-none absolute inset-0 z-20 flex items-center px-8 md:px-20"
              >
                <div className="max-w-lg">
                  <h2
                    className="font-headline text-4xl font-bold text-white md:text-6xl lg:text-7xl"
                    style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
                  >
                    Traditional
                    <br />
                    <span className="text-[#D4AF37]">Recipes</span>
                  </h2>
                  <p className="mt-6 text-lg text-white/80 md:text-xl lg:text-2xl">
                    Passed down through generations, each dish tells a story of
                    heritage and love.
                  </p>
                </div>
              </motion.div>

              {/* Story 2 - Right Aligned with X parallax */}
              <motion.div
                style={{ opacity: story2, x: story2X }}
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-end px-8 md:px-20"
              >
                <div className="max-w-lg text-right">
                  <h2
                    className="font-headline text-4xl font-bold text-white md:text-6xl lg:text-7xl"
                    style={{ textShadow: "0 4px 30px rgba(0,0,0,0.9)" }}
                  >
                    Fresh
                    <br />
                    <span className="text-[#50C878]">Ingredients</span>
                  </h2>
                  <p className="mt-6 text-lg text-white/80 md:text-xl lg:text-2xl">
                    Sourced locally every day for the most authentic taste
                    experience.
                  </p>
                </div>
              </motion.div>

              {/* CTA Section with scale effect */}
              <motion.div
                style={{ opacity: cta, scale: ctaScale }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
              >
                <h2
                  className="font-headline text-4xl font-bold text-white md:text-6xl lg:text-8xl"
                  style={{ textShadow: "0 4px 40px rgba(0,0,0,0.95)" }}
                >
                  Experience the <span className="text-[#D4AF37]">Taste</span>
                </h2>
                <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl lg:text-2xl">
                  Join us for an unforgettable culinary journey
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
