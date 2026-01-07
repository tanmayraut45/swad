"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const FRAME_COUNT = 120;
const FRAME_PATH = "/frames/ezgif-frame-";

// ============================================================================
// PERFORMANCE UTILITIES - Vanilla JS for maximum smoothness
// ============================================================================

// High-performance lerp (linear interpolation) for smooth scroll
const lerp = (start: number, end: number, factor: number): number =>
  start + (end - start) * factor;

// Clamp utility
const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

// Map a value from one range to another
const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const clampedValue = clamp(value, inMin, inMax);
  return (
    outMin + ((clampedValue - inMin) / (inMax - inMin)) * (outMax - outMin)
  );
};

export default function FoodScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const imagesRef = useRef<(ImageBitmap | null)[]>(
    new Array(FRAME_COUNT).fill(null)
  );
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  // ============================================================================
  // VANILLA SCROLL STATE - No Framer Motion for scroll tracking!
  // ============================================================================
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  // Text opacity states - updated via RAF with threshold checks
  const [introOpacity, setIntroOpacity] = useState(1);
  const [introY, setIntroY] = useState(0);
  const [story1Opacity, setStory1Opacity] = useState(0);
  const [story1X, setStory1X] = useState(-30);
  const [ctaOpacity, setCtaOpacity] = useState(0);
  const [ctaScale, setCtaScale] = useState(0.95);

  // ============================================================================
  // GET RAW SCROLL PROGRESS (0-1) - Vanilla JS
  // ============================================================================
  const getScrollProgress = useCallback((): number => {
    const container = containerRef.current;
    if (!container) return 0;

    const rect = container.getBoundingClientRect();
    const scrollableHeight = container.offsetHeight - window.innerHeight;
    if (scrollableHeight <= 0) return 0;

    const progress = -rect.top / scrollableHeight;
    return clamp(progress, 0, 1);
  }, []);

  // ============================================================================
  // DRAW SINGLE FRAME (for fast scroll - no blending)
  // ============================================================================
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

  // ============================================================================
  // DRAW FRAME BY INDEX (for fast scroll - skip blending)
  // ============================================================================
  const drawFrameByIndex = useCallback(
    (frameIndex: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const roundedIndex = Math.round(clamp(frameIndex, 0, FRAME_COUNT - 1));
      const img = imagesRef.current[roundedIndex];

      if (!img) return;
      if (roundedIndex === lastDrawnFrameRef.current) return;

      lastDrawnFrameRef.current = roundedIndex;
      drawSingleFrame(ctx, img, canvas.width, canvas.height);
    },
    [drawSingleFrame]
  );

  // ============================================================================
  // DRAW BLENDED FRAME (for slow scroll - smooth interpolation)
  // ============================================================================
  const drawBlendedFrame = useCallback(
    (frameFloat: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      const frameA = Math.floor(frameFloat);
      const frameB = Math.min(frameA + 1, FRAME_COUNT - 1);
      const blendFactor = frameFloat - frameA;

      const imgA = imagesRef.current[frameA];
      const imgB = imagesRef.current[frameB];

      // If both frames are the same or we don't have both, just draw one
      if (frameA === frameB || !imgA || !imgB) {
        const img = imgA || imgB;
        if (!img) return;

        if (frameA === lastDrawnFrameRef.current && blendFactor < 0.01) return;
        lastDrawnFrameRef.current = frameA;

        drawSingleFrame(ctx, img, canvas.width, canvas.height);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.fillStyle = "#0D0D0D";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      // Draw frame A (base)
      ctx.globalAlpha = 1;
      ctx.drawImage(
        imgA,
        drawX * dpr,
        drawY * dpr,
        drawWidth * dpr,
        drawHeight * dpr
      );

      // Blend frame B on top with alpha
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

      lastDrawnFrameRef.current = frameA + blendFactor;
    },
    [drawSingleFrame]
  );

  // ============================================================================
  // MAIN ANIMATION LOOP - Pure Vanilla JS, No Framer Motion!
  // ============================================================================
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = Math.min(
        (currentTime - lastTimeRef.current) / 1000,
        0.1
      );
      lastTimeRef.current = currentTime;

      // Get raw scroll progress
      const rawProgress = getScrollProgress();
      targetProgressRef.current = rawProgress;

      // Calculate velocity for frame skipping decision
      const progressDelta = Math.abs(rawProgress - lastProgressRef.current);
      velocityRef.current = progressDelta / Math.max(deltaTime, 0.001);
      lastProgressRef.current = rawProgress;

      // ========================================
      // SMOOTH INTERPOLATION with adaptive lerp
      // Fast scroll = higher lerp (responsive)
      // Slow scroll = lower lerp (cinematic)
      // ========================================
      const isHighVelocity = velocityRef.current > 0.8;
      const lerpFactor = isHighVelocity ? 0.2 : 0.1;

      smoothProgressRef.current = lerp(
        smoothProgressRef.current,
        targetProgressRef.current,
        lerpFactor
      );

      // Snap when very close to target
      if (
        Math.abs(smoothProgressRef.current - targetProgressRef.current) < 0.0001
      ) {
        smoothProgressRef.current = targetProgressRef.current;
      }

      // Calculate frame index from smooth progress
      const frameFloat = smoothProgressRef.current * (FRAME_COUNT - 1);
      const clampedFrame = clamp(frameFloat, 0, FRAME_COUNT - 1);

      // ========================================
      // FRAME SKIPPING: Fast scroll = no blend
      // ========================================
      if (isHighVelocity) {
        drawFrameByIndex(clampedFrame);
      } else {
        drawBlendedFrame(clampedFrame);
      }

      // ========================================
      // UPDATE TEXT OPACITIES (with thresholds)
      // Only update state if changed significantly
      // ========================================
      if (showContent) {
        const progress = smoothProgressRef.current;

        // INTRO: visible 0-12%, fades out 12-22%
        const introOpacityNew =
          progress < 0.12
            ? 1
            : progress > 0.22
            ? 0
            : 1 - (progress - 0.12) / 0.1;
        const introYNew = mapRange(progress, 0, 0.22, 0, -50);

        // STORY 1: fade in 20-30%, visible 30-55%, fade out 55-65%
        let story1OpacityNew: number;
        if (progress < 0.2) {
          story1OpacityNew = 0;
        } else if (progress < 0.3) {
          story1OpacityNew = (progress - 0.2) / 0.1;
        } else if (progress < 0.55) {
          story1OpacityNew = 1;
        } else if (progress < 0.65) {
          story1OpacityNew = 1 - (progress - 0.55) / 0.1;
        } else {
          story1OpacityNew = 0;
        }
        const story1XNew = mapRange(story1OpacityNew, 0, 1, -30, 0);

        // CTA: fade in 70-80%, stays visible 80-100%
        const ctaOpacityNew =
          progress < 0.7 ? 0 : progress > 0.8 ? 1 : (progress - 0.7) / 0.1;
        const ctaScaleNew = 0.95 + ctaOpacityNew * 0.05;

        // THRESHOLD UPDATES - Only update if changed > 0.01
        setIntroOpacity((prev) =>
          Math.abs(prev - introOpacityNew) > 0.01 ? introOpacityNew : prev
        );
        setIntroY((prev) =>
          Math.abs(prev - introYNew) > 0.5 ? introYNew : prev
        );
        setStory1Opacity((prev) =>
          Math.abs(prev - story1OpacityNew) > 0.01 ? story1OpacityNew : prev
        );
        setStory1X((prev) =>
          Math.abs(prev - story1XNew) > 0.5 ? story1XNew : prev
        );
        setCtaOpacity((prev) =>
          Math.abs(prev - ctaOpacityNew) > 0.01 ? ctaOpacityNew : prev
        );
        setCtaScale((prev) =>
          Math.abs(prev - ctaScaleNew) > 0.005 ? ctaScaleNew : prev
        );

        // Update navbar visibility
        const header = document.querySelector("header") as HTMLElement;
        if (header) {
          const shouldShow = progress > 0.85;
          header.style.opacity = shouldShow ? "1" : "0";
          header.style.pointerEvents = shouldShow ? "auto" : "none";
        }
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [showContent, getScrollProgress, drawFrameByIndex, drawBlendedFrame]);

  // ============================================================================
  // INITIALIZE OFF-SCREEN CANVAS
  // ============================================================================
  useEffect(() => {
    offscreenCanvasRef.current = document.createElement("canvas");
  }, []);

  // ============================================================================
  // PROGRESSIVE IMAGE LOADING
  // ============================================================================
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;

    const loadImage = async (index: number): Promise<void> => {
      try {
        const frameNum = String(index + 1).padStart(3, "0");
        const response = await fetch(`${FRAME_PATH}${frameNum}.jpg`);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);

        if (isMounted) {
          imagesRef.current[index] = bitmap;
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));

          // Draw first frame immediately
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

          // Complete loading
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

    const loadInBatches = async () => {
      // Critical: first 20 frames
      const critical = Array.from({ length: 20 }, (_, i) => i);
      await Promise.all(critical.map(loadImage));

      if (!isMounted) return;

      // Remaining in chunks of 25
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
      imagesRef.current.forEach((bitmap) => {
        if (bitmap) bitmap.close();
      });
    };
  }, [drawSingleFrame]);

  // ============================================================================
  // CANVAS RESIZE HANDLER
  // ============================================================================
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const offscreen = offscreenCanvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;

      if (offscreen) {
        offscreen.width = displayWidth * dpr;
        offscreen.height = displayHeight * dpr;
      }

      lastDrawnFrameRef.current = -1;
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div
      ref={containerRef}
      className="relative h-[400vh]"
      style={{
        backgroundColor: "#0D0D0D",
        touchAction: "pan-y", // Optimize touch scrolling
      }}
    >
      {/* Loading Screen */}
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

      {/* Sticky Canvas Container - CSS Containment for GPU isolation */}
      <div
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden"
        style={{
          contain: "strict", // CSS Containment - isolates layout/paint
          contentVisibility: "auto", // Skip offscreen rendering
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            backgroundColor: "#0D0D0D",
            willChange: "transform",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            imageRendering: "auto",
          }}
        />

        {/* Text Overlays - CSS transforms, no Framer scroll tracking */}
        <AnimatePresence>
          {showContent && (
            <>
              {/* INTRO TEXT */}
              <div
                className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
                style={{
                  opacity: introOpacity,
                  transform: `translateY(${introY}px)`,
                  willChange: "opacity, transform",
                  transition:
                    "opacity 0.05s ease-out, transform 0.05s ease-out",
                }}
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
              </div>

              {/* STORY 1 - Traditional Recipes */}
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center px-8 md:px-20"
                style={{
                  opacity: story1Opacity,
                  transform: `translateX(${story1X}px)`,
                  willChange: "opacity, transform",
                  transition:
                    "opacity 0.05s ease-out, transform 0.05s ease-out",
                }}
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
              </div>

              {/* CTA SECTION */}
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
                style={{
                  opacity: ctaOpacity,
                  transform: `scale(${ctaScale})`,
                  willChange: "opacity, transform",
                  transition:
                    "opacity 0.05s ease-out, transform 0.05s ease-out",
                  pointerEvents: ctaOpacity > 0.5 ? "auto" : "none",
                }}
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
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
