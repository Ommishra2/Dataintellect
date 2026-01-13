"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function useAnimatedNumber(baseValue: number, startAnimation: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;
    
    const end = baseValue;
    // Animation duration in ms
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (easeOutExpo)
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setValue(Math.floor(end * ease));

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
  }, [baseValue, startAnimation]);

  return value;
}

function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="0.75" fill="currentColor" />
    </svg>
  );
}

function PixelGridTransition({
  firstContent,
  secondContent,
  isActive,
  gridSize = 30,
  animationStepDuration = 0.3,
  className,
}: {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  isActive: boolean;
  gridSize?: number;
  animationStepDuration?: number;
  className?: string;
}) {
  const [showPixels, setShowPixels] = useState(false);
  const [animState, setAnimState] = useState<"idle" | "growing" | "shrinking">("idle");
  const hasActivatedRef = useRef(false);
  const [pixels, setPixels] = useState<{ id: number; row: number; col: number; color: string }[]>([]);

  // Generate pixels on client-side only to avoid hydration mismatch
  useEffect(() => {
    const total = gridSize * gridSize;
    const result = [];
    for (let n = 0; n < total; n++) {
      const row = Math.floor(n / gridSize);
      const col = n % gridSize;
      const color = Math.random() > 0.85 ? "var(--ds-blue-800, #1e40af)" : "var(--ds-gray-200, #e5e5e5)";
      result.push({ id: n, row, col, color });
    }
    setPixels(result);
  }, [gridSize]);

  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);

  useEffect(() => {
    if (!hasActivatedRef.current && !isActive) return;
    if (isActive) hasActivatedRef.current = true;

    const indices = pixels.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledOrder(indices);

    setShowPixels(true);
    setAnimState("growing");

    const shrinkTimer = setTimeout(() => setAnimState("shrinking"), animationStepDuration * 1000);
    const hideTimer = setTimeout(() => {
      setShowPixels(false);
      setAnimState("idle");
    }, animationStepDuration * 2000);

    return () => {
      clearTimeout(shrinkTimer);
      clearTimeout(hideTimer);
    };
  }, [isActive, animationStepDuration, pixels]);

  const delayPerPixel = useMemo(() => animationStepDuration / pixels.length, [animationStepDuration, pixels.length]);
  const orderMap = useMemo(() => {
    const map = new Map<number, number>();
    shuffledOrder.forEach((idx, order) => map.set(idx, order));
    return map;
  }, [shuffledOrder]);

  return (
    <div className={`w-full overflow-hidden max-w-full relative ${className || ""}`}>
      <motion.div
        className="h-full"
        aria-hidden={isActive}
        initial={{ opacity: 1 }}
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ duration: 0, delay: animationStepDuration }}
      >
        {firstContent}
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full z-[2] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0, delay: animationStepDuration }}
        style={{ pointerEvents: isActive ? "auto" : "none" }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </motion.div>

      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-[3]"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        <AnimatePresence>
          {showPixels &&
            pixels.map((pixel) => {
              const order = orderMap.get(pixel.id) ?? 0;
              return (
                <motion.div
                  key={pixel.id}
                  style={{
                    backgroundColor: pixel.color,
                    aspectRatio: "1 / 1",
                    gridArea: `${pixel.row + 1} / ${pixel.col + 1}`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: animState === "growing" ? 1 : 0,
                    scale: animState === "growing" ? 1 : 0,
                  }}
                  transition={{ duration: 0.01, delay: order * delayPerPixel }}
                />
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function StatCard({
  title,
  value,
  children,
  infoContent,
  className,
  prefix = "",
  suffix = ""
}: {
  title: string;
  value?: number | string;
  children?: React.ReactNode;
  infoContent?: string;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const [showInfo, setShowInfo] = useState(false);
  const numericValue = typeof value === 'number' ? value : 0;
  const animatedValue = useAnimatedNumber(numericValue, true);
  
  const displayValue = typeof value === 'number' 
    ? animatedValue.toLocaleString() 
    : value;

  const statsContent = (
    <div className="bg-gray-alpha-100 p-4 md:p-6 w-full min-h-[140px] h-full flex flex-col justify-between">
      <div className="space-y-2">
        <h2 className="my-0 font-mono font-medium text-sm tracking-tight uppercase text-gray-1000 pr-6">
          {title}
        </h2>
        {value !== undefined && (
          <div className="text-3xl md:text-4xl tracking-normal font-mono tabular-nums text-foreground">
            {prefix}{displayValue}{suffix}
          </div>
        )}
        {children}
      </div>
    </div>
  );

  const infoContentView = (
    <div className="bg-gray-alpha-100 p-4 md:p-6 w-full h-full overflow-y-auto flex flex-col gap-y-2">
        <span className="my-0 font-mono font-medium text-sm tracking-tight uppercase text-gray-1000 shrink-0">
          {title}
        </span>
      <span className="tracking-tight text-sm text-gray-900 leading-relaxed line-clamp-6">
        {infoContent}
      </span>
    </div>
  );
  
  return (
    <div className={`relative group rounded-md overflow-hidden bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 ${className || ""}`}>
      <PixelGridTransition
        firstContent={statsContent}
        secondContent={infoContentView}
        isActive={showInfo}
        gridSize={30}
        animationStepDuration={0.3}
        className="h-full"
      />
      {infoContent && (
        <div className={`absolute top-2 right-2 transition-opacity duration-150 z-[20] isolate ${showInfo ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"}`}>
          <button
            aria-label={`Learn more about ${title}`}
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="p-1 m-0 bg-transparent text-gray-alpha-600 md:text-gray-900 border-none md:border md:border-solid border-gray-alpha-400 hover:text-gray-1000 hover:bg-gray-alpha-200 transition-colors duration-150 flex items-center justify-center outline-none focus-visible:ring cursor-pointer"
          >
            <InfoIcon />
          </button>
        </div>
      )}
    </div>
  );
}
