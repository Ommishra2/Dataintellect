"use client";

import { useState, useEffect } from "react";

function useAnimatedNumber(baseValue: number, startAnimation: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;
    
    const end = baseValue;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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

export function MetricRow({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  const animatedValue = useAnimatedNumber(value, true);
  
  return (
    <li className="flex flex-wrap items-center justify-between gap-x-3 py-1">
      <h3 className="m-0 font-mono font-normal text-sm text-gray-900 uppercase">
        {label}
      </h3>
      <div className="flex items-center gap-3 md:gap-4 text-right">
        <div className="text-gray-1000 text-sm font-mono tabular-nums">
          {animatedValue.toLocaleString()}{suffix}
        </div>
      </div>
    </li>
  );
}
