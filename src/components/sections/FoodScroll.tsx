"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

const FRAME_COUNT = 120;
const FRAME_PATH = "/frames/ezgif-frame-";

// ============================================================================
// iOS COMPATIBILITY: Configuration
// ============================================================================
const MAX_MOBILE_DPR = 1.5; // Aggressive cap for iPhone 17 Pro Max stability
const LOADING_TIMEOUT_MS = 5000; // Fallback to content after 5s (premium feel = fast)
const BATCH_SIZE_MOBILE = 8; // Small batches
const BATCH_SIZE_DESKTOP = 20;
const MIN_FRAMES_TO_START = 15; // Only require ~12% of frames to start interaction

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

// ============================================================================
// iOS DETECTION - Updated for newer devices
// ============================================================================
const detectiOS = (): boolean => {
  if (typeof window === "undefined") return false;

  const userAgent = navigator.userAgent || navigator.vendor || "";

  // Check for iOS devices
  if (/iPad|iPhone|iPod/.test(userAgent)) return true;

  // Check for iPad on iOS 13+ (reports as Mac)
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    return true;

  // Additional check for newer iOS versions that may change UA
  if (/Mac/.test(userAgent) && "ontouchend" in document) return true;

  return false;
};

const detectMobile = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
};

export default function FoodScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Use HTMLImageElement as fallback for iOS compatibility
  const imagesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>(
    new Array(FRAME_COUNT).fill(null)
  );
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // VANILLA SCROLL STATE - No Framer Motion for scroll tracking!
  // ============================================================================
  const targetProgressRef = useRef<number>(0);
  const smoothProgressRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  // iOS Safari fix: Cache viewport height to avoid issues with address bar
  const viewportHeightRef = useRef<number>(0);
  const isIOSRef = useRef<boolean>(false);
  const isMobileRef = useRef<boolean>(false);
  const effectiveDPRRef = useRef<number>(1);

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
  // iOS DETECTION & VIEWPORT FIX
  // ============================================================================
  useEffect(() => {
    // Detect iOS and mobile
    const isIOS = detectiOS();
    const isMobile = detectMobile();
    isIOSRef.current = isIOS;
    isMobileRef.current = isMobile;

    // Calculate effective DPR (capped on mobile to save memory)
    const rawDPR = window.devicePixelRatio || 1;
    effectiveDPRRef.current = isMobile
      ? Math.min(rawDPR, MAX_MOBILE_DPR)
      : rawDPR;

    // Cache initial viewport height (before address bar collapses)
    viewportHeightRef.current = window.innerHeight;

    // Update on resize but use stable value
    const handleResize = () => {
      // On iOS, only update if significantly different (address bar)
      const newHeight = window.innerHeight;
      if (!isIOS || Math.abs(newHeight - viewportHeightRef.current) > 100) {
        viewportHeightRef.current = newHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ============================================================================
  // GET RAW SCROLL PROGRESS (0-1) - iOS Compatible
  // ============================================================================
  const getScrollProgress = useCallback((): number => {
    const container = containerRef.current;
    if (!container) return 0;

    // iOS Safari fix: Use cached viewport height
    const viewportHeight = viewportHeightRef.current || window.innerHeight;

    // iOS Safari fix: Use scrollY as fallback for getBoundingClientRect issues
    const rect = container.getBoundingClientRect();
    const containerTop = rect.top;

    // Also get scroll position directly as backup
    const scrollTop =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;

    const scrollableHeight = container.offsetHeight - viewportHeight;
    if (scrollableHeight <= 0) return 0;

    // Use rect.top for progress (more reliable)
    const progress = -containerTop / scrollableHeight;
    return clamp(progress, 0, 1);
  }, []);

  // ============================================================================
  // DRAW SINGLE FRAME (for fast scroll - no blending)
  // ============================================================================
  const drawSingleFrame = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: ImageBitmap | HTMLImageElement,
      canvasWidth: number,
      canvasHeight: number
    ) => {
      // Use effective DPR (capped on mobile for memory savings)
      const dpr = effectiveDPRRef.current;
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

      // Use effective DPR (capped on mobile for memory savings)
      const dpr = effectiveDPRRef.current;
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
  // PROGRESSIVE IMAGE LOADING - iOS Compatible with Fallback
  // ============================================================================
  useEffect(() => {
    let isMounted = true;
    let loadedCount = 0;
    let failedCount = 0;

    // Helper: Complete loading and show content
    const completeLoading = () => {
      if (isLoading) {
        if (loadingTimeoutRef.current) {
          clearTimeout(loadingTimeoutRef.current);
          loadingTimeoutRef.current = null;
        }
        setLoadProgress(100); // Visual completion
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => setShowContent(true), 100);
        }, 500); // Slight delay for users to register "100%"
      }
    };

    // Helper: Check if we should complete loading
    const checkLoadingComplete = () => {
      const totalProcessed = loadedCount + failedCount;
      const isMobile = isMobileRef.current;
      const SKIP_FACTOR = isMobile ? 3 : 1;

      // Calculate minimum actual frames needed to start (accounting for skipping)
      const minActualFrames = Math.ceil(MIN_FRAMES_TO_START / SKIP_FACTOR);

      // Strategy: "Playable as soon as possible"
      // If we have enough frames to show the intro, let the user in!
      // The rest will stream in the background.
      if (loadedCount >= minActualFrames) {
        completeLoading();
        return true;
      }

      // Also complete if we simply ran out of frames to load (short animation)
      const totalNeeded = Math.ceil(FRAME_COUNT / SKIP_FACTOR);
      if (totalProcessed >= totalNeeded) {
        completeLoading();
        return true;
      }

      return false;
    };

    // Load single image with createImageBitmap fallback to HTMLImageElement
    const loadImage = async (index: number): Promise<void> => {
      if (!isMounted) return;

      const frameNum = String(index + 1).padStart(3, "0");
      const imageUrl = `${FRAME_PATH}${frameNum}.jpg`;

      try {
        // Try createImageBitmap first (faster, more memory efficient)
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();

        // Determine how many frames to fill with this image (frame skipping)
        const isMobile = isMobileRef.current;
        const SKIP_FACTOR = isMobile ? 3 : 1; // Load 1, skip 2 on mobile

        // Helper to assign image to multiple slots
        const assignImage = (img: ImageBitmap | HTMLImageElement) => {
          if (!isMounted) return;

          // Assign this image to the current index AND the skipped slots
          // This fills the gaps so the animation logic doesn't need to change
          for (let i = 0; i < SKIP_FACTOR; i++) {
            if (index + i < FRAME_COUNT) {
              imagesRef.current[index + i] = img;
            }
          }

          loadedCount++;
          // Calculate progress based on TOTAL frames needed (reduced on mobile)
          const totalNeeded = Math.ceil(FRAME_COUNT / SKIP_FACTOR);
          setLoadProgress(
            Math.min(100, Math.floor((loadedCount / totalNeeded) * 100))
          );

          // Draw first frame immediately
          if (index === 0 && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d", {
              alpha: false,
            });
            if (ctx) {
              drawSingleFrame(
                ctx,
                img,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
          }

          checkLoadingComplete();
        };

        // Check if createImageBitmap is supported and working
        if (typeof createImageBitmap === "function") {
          try {
            const bitmap = await createImageBitmap(blob);
            assignImage(bitmap);
            return; // Success with ImageBitmap
          } catch {
            // createImageBitmap failed, fall through to HTMLImageElement
          }
        }

        // Fallback: Use HTMLImageElement (more compatible with iOS Safari)
        const img = new Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => {
            assignImage(img);
            resolve();
          };
          img.onerror = () => reject(new Error("Image load failed"));
          img.src = URL.createObjectURL(blob);
        });
      } catch (err) {
        // Track failures but continue loading other frames
        failedCount++;
        if (isMounted) {
          const isMobile = isMobileRef.current;
          const SKIP_FACTOR = isMobile ? 3 : 1;
          const totalNeeded = Math.ceil(FRAME_COUNT / SKIP_FACTOR);
          setLoadProgress(
            Math.min(
              100,
              Math.floor(((loadedCount + failedCount) / totalNeeded) * 100)
            )
          );
          checkLoadingComplete();
        }
      }
    };

    // Load images in batches - adaptive batch size for mobile
    const loadInBatches = async () => {
      const isMobile = isMobileRef.current;
      const SKIP_FACTOR = isMobile ? 3 : 1;
      const batchSize = isMobile ? BATCH_SIZE_MOBILE : BATCH_SIZE_DESKTOP;

      // Calculate which unique frames we need to load
      const framesToLoad = Array.from(
        { length: FRAME_COUNT },
        (_, i) => i
      ).filter((i) => i % SKIP_FACTOR === 0);

      // Critical: first batch (faster first paint)
      const firstBatchCount = isMobile ? 5 : 20; // Reduced first batch on mobile
      const critical = framesToLoad.slice(0, firstBatchCount);

      for (let i = 0; i < critical.length; i += batchSize) {
        if (!isMounted) break;
        const batch = critical.slice(i, i + batchSize);
        await Promise.all(batch.map(loadImage));
      }

      if (!isMounted) return;

      // Remaining frames
      const remaining = framesToLoad.slice(firstBatchCount);

      for (let i = 0; i < remaining.length; i += batchSize) {
        if (!isMounted) break;
        const chunk = remaining.slice(i, i + batchSize);
        await Promise.all(chunk.map(loadImage));

        // Small delay between batches on mobile to prevent throttling
        if (isMobile && isMounted) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
    };

    // Set loading timeout - force complete after timeout
    loadingTimeoutRef.current = setTimeout(() => {
      if (isMounted && loadedCount >= MIN_FRAMES_TO_START) {
        completeLoading();
      }
    }, LOADING_TIMEOUT_MS);

    loadInBatches();

    return () => {
      isMounted = false;
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      // Clean up bitmaps (only ImageBitmap has close method)
      imagesRef.current.forEach((img) => {
        if (img && "close" in img && typeof img.close === "function") {
          img.close();
        }
      });
    };
  }, [drawSingleFrame]);

  // ============================================================================
  // CANVAS RESIZE HANDLER - Uses effective DPR (capped on mobile)
  // ============================================================================
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const offscreen = offscreenCanvasRef.current;
      if (!canvas) return;

      // Use effective DPR (capped on mobile for memory savings)
      const dpr = effectiveDPRRef.current || window.devicePixelRatio || 1;
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
        // iOS Safari critical fixes
        WebkitOverflowScrolling: "touch", // Momentum scrolling
        overscrollBehavior: "none", // Prevent bounce interfering
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
          // iOS Safari fixes
          WebkitTransform: "translateZ(0)",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{
            backgroundColor: "#0D0D0D",
            willChange: "transform",
            transform: "translateZ(0)",
            WebkitTransform: "translateZ(0)", // iOS Safari GPU acceleration
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden", // iOS Safari
            imageRendering: "auto",
            // Prevent iOS Safari from interfering
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
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
