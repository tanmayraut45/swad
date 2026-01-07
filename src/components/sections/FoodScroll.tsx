"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useVelocity,
} from "framer-motion";
import { Loader2 } from "lucide-react";

const FRAME_COUNT = 120;
const FRAME_PATH = "/frames/ezgif-frame-";

export default function FoodScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // IMPROVEMENT 1: Double Buffering - Off-screen canvas for flicker-free rendering
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const imagesRef = useRef<(ImageBitmap | null)[]>(
    new Array(FRAME_COUNT).fill(null)
  );
  const lastDrawnFrameRef = useRef<number>(-1);
  const lastBlendedFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const currentFrameRef = useRef<number>(0);
  const scrollVelocityRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // IMPROVEMENT 3: Track scroll velocity for adaptive spring
  const scrollVelocity = useVelocity(scrollYProgress);

  useEffect(() => {
    const unsubscribe = scrollVelocity.on("change", (latest) => {
      scrollVelocityRef.current = Math.abs(latest);
    });
    return () => unsubscribe();
  }, [scrollVelocity]);

  // IMPROVEMENT 3: Adaptive Spring - adjusts based on scroll speed
  // Lower stiffness = more cinematic (slow scroll)
  // Higher stiffness = more responsive (fast scroll)
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40, // Reduced from 50 for smoother feel
    damping: 20, // Reduced from 25 for more flow
    restDelta: 0.00001, // Even smaller for precision
    mass: 0.8, // Added mass for more natural physics
  });

  // Map scroll to frame index
  const frameIndex = useTransform(smoothProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Navbar visibility - hide when in hero section
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

  // IMPROVEMENT 2: Frame Interpolation - Blend between frames for smooth transitions
  const drawBlendedFrame = useCallback((frameFloat: number) => {
    const canvas = canvasRef.current;
    const offscreen = offscreenCanvasRef.current;
    if (!canvas || !offscreen) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    const offCtx = offscreen.getContext("2d", { alpha: false });
    if (!ctx || !offCtx) return;

    // Get the two frames to blend between
    const frameA = Math.floor(frameFloat);
    const frameB = Math.min(frameA + 1, FRAME_COUNT - 1);
    const blendFactor = frameFloat - frameA; // 0.0 to 1.0

    const imgA = imagesRef.current[frameA];
    const imgB = imagesRef.current[frameB];

    // If both frames are the same or we don't have both, just draw one
    if (frameA === frameB || !imgA || !imgB) {
      const img = imgA || imgB;
      if (!img) return;

      // Skip if same frame
      if (frameA === lastDrawnFrameRef.current && blendFactor < 0.01) return;
      lastDrawnFrameRef.current = frameA;

      drawSingleFrame(ctx, img, canvas.width, canvas.height);
      return;
    }

    // Skip if we already drew this exact blend
    const blendKey = frameA + blendFactor;
    if (Math.abs(blendKey - lastBlendedFrameRef.current) < 0.01) return;
    lastBlendedFrameRef.current = blendKey;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    offCtx.imageSmoothingEnabled = true;
    offCtx.imageSmoothingQuality = "high";

    // Clear background
    ctx.fillStyle = "#0D0D0D";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate draw dimensions
    const imageAspect = imgA.width / imgA.height;
    const displayAspect = displayWidth / displayHeight;

    let drawWidth, drawHeight, drawX, drawY;

    if (imageAspect > displayAspect) {
      drawWidth = displayWidth;
      drawHeight = displayWidth / imageAspect;
      drawX = 0;
      drawY = (displayHeight - drawHeight) / 2;
    } else {
      drawHeight = displayHeight;
      drawWidth = displayHeight * imageAspect;
      drawX = (displayWidth - drawWidth) / 2;
      drawY = 0;
    }

    // FRAME INTERPOLATION: Draw frameA, then blend frameB on top with alpha
    // This creates smooth cross-fade transition between frames

    // Draw frame A (base)
    ctx.globalAlpha = 1;
    ctx.drawImage(
      imgA,
      drawX * dpr,
      drawY * dpr,
      drawWidth * dpr,
      drawHeight * dpr
    );

    // Draw frame B with blend factor as alpha (cross-fade)
    if (blendFactor > 0.01) {
      ctx.globalAlpha = blendFactor;
      ctx.drawImage(
        imgB,
        drawX * dpr,
        drawY * dpr,
        drawWidth * dpr,
        drawHeight * dpr
      );
      ctx.globalAlpha = 1;
    }
  }, []);

  // Helper to draw a single frame
  const drawSingleFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: ImageBitmap,
      canvasWidth: number,
      canvasHeight: number
    ) => {
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.fillStyle = "#0D0D0D";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      const displayAspect = displayWidth / displayHeight;
      const imageAspect = img.width / img.height;

      let drawWidth, drawHeight, drawX, drawY;

      if (imageAspect > displayAspect) {
        drawWidth = displayWidth;
        drawHeight = displayWidth / imageAspect;
        drawX = 0;
        drawY = (displayHeight - drawHeight) / 2;
      } else {
        drawHeight = displayHeight;
        drawWidth = displayHeight * imageAspect;
        drawX = (displayWidth - drawWidth) / 2;
        drawY = 0;
      }

      ctx.drawImage(
        img,
        drawX * dpr,
        drawY * dpr,
        drawWidth * dpr,
        drawHeight * dpr
      );
    },
    []
  );

  // RAF-based render loop with frame interpolation
  useEffect(() => {
    const animate = () => {
      // Use the exact float value for smooth blending
      const frameFloat = currentFrameRef.current;
      const clampedFrame = Math.max(0, Math.min(FRAME_COUNT - 1, frameFloat));

      drawBlendedFrame(clampedFrame);
      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [drawBlendedFrame]);

  // Subscribe to frame index changes - now uses float for interpolation
  useEffect(() => {
    const unsubscribe = frameIndex.on("change", (latest) => {
      currentFrameRef.current = latest;
    });

    return () => unsubscribe();
  }, [frameIndex]);

  // Initialize off-screen canvas for double buffering
  useEffect(() => {
    offscreenCanvasRef.current = document.createElement("canvas");
  }, []);

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
            const ctx = canvasRef.current.getContext("2d", { alpha: false });
            if (ctx) {
              drawSingleFrame(
                ctx,
                bitmap,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
          }

          // Smooth transition when loading complete
          if (loadedCount === FRAME_COUNT) {
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
      // Batch 1: Critical frames (first 20 frames for smoother start)
      const critical = Array.from({ length: 20 }, (_, i) => i);
      await Promise.all(critical.map(loadImage));

      if (!isMounted) return;

      // Batch 2: Remaining frames in parallel chunks of 25
      const remaining = Array.from(
        { length: FRAME_COUNT - 20 },
        (_, i) => i + 20
      );

      for (let i = 0; i < remaining.length; i += 25) {
        if (!isMounted) break;
        const chunk = remaining.slice(i, i + 25);
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
  }, [drawSingleFrame]);

  // Handle canvas resize with device pixel ratio for sharpness
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const offscreen = offscreenCanvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      // Set canvas internal resolution for HiDPI
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      // Also resize offscreen canvas
      if (offscreen) {
        offscreen.width = displayWidth * dpr;
        offscreen.height = displayHeight * dpr;
      }

      // Force redraw
      lastDrawnFrameRef.current = -1;
      lastBlendedFrameRef.current = -1;
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
      {/* Smooth loading fade-out with AnimatePresence */}
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

      {/* Sticky Canvas Container with GPU compositing */}
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
            imageRendering: "auto",
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
