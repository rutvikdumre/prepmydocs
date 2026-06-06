import { useEffect, useRef, useState } from "react";

function useCountUp(target, duration = 1600) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

export default function TokenSavingsBadge({ tokensSaved, savingsPercent }) {
  const animated = useCountUp(tokensSaved);

  return (
    <div className="flex items-center gap-3 bg-[#22C55E]/10 border border-[#22C55E]/25 rounded-full px-5 py-2.5 w-fit">
      <span className="text-xl">🎉</span>
      <span className="text-[#15803D] font-semibold text-sm">
        You saved{" "}
        <span className="text-[#15803D] font-bold tabular-nums">
          {animated.toLocaleString()}
        </span>{" "}
        tokens ({savingsPercent}%)
      </span>
    </div>
  );
}
