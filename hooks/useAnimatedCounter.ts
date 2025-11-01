import { useState, useEffect, useRef } from 'react';

const easeOutExpo = (t: number) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const useAnimatedCounter = (endValue: number, duration: number = 800) => {
  const [count, setCount] = useState(0);
  const startValueRef = useRef(0);
  const startTimeRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    startValueRef.current = count;
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTimeRef.current;
      const progress = Math.min(elapsedTime / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentValue = startValueRef.current + (endValue - startValueRef.current) * easedProgress;
      
      setCount(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endValue); // Ensure it ends exactly at the target
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
    };
  }, [endValue, duration]);

  return count;
};
