"use client";
import CountUp from "react-countup";
import { useEffect, useRef, useState } from "react";

interface CounterProps {
  end: number;
  decimals?: number;
}

const Counter = ({ end, decimals = 0 }: CounterProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect observer after triggering once
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <span className="count" data-from="0" data-to={end} ref={wrapperRef}>
      {isVisible ? (
        <CountUp
          end={end ? end : 100}
          duration={3}
          decimals={decimals ? decimals : 0}
        />
      ) : (
        "0"
      )}
    </span>
  );
};

export default Counter;
