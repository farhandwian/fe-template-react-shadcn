import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback, useRef } from "react";

interface LegendProps {
  items: {
    color: string;
    label: string;
  }[];
}

const Legend = ({ items }: LegendProps) => {
  return (
    <div className="flex gap-4 mt-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${item.color}`}
            aria-hidden="true"
          />
          <span className="text-sm text-gray-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

interface VerticalProgressBarProps {
  progress: number;
  height?: string;
  width?: string;
  color?: string;
  backgroundColor?: string;
  animationDuration?: number;
  controlled?: boolean;
  onProgressChange?: (progress: number) => void;
  withLabel?: boolean;
  labelContent?: string | number;
  labelPosition?: "left" | "right";
  placeholderProgress?: number;
  placeholderColor?: string;
  withLegend?: boolean;
  upperLimit?: number;
}

export default function VerticalProgressBar({
  progress,
  height = "h-48",
  width = "w-4",
  color = "bg-primary",
  backgroundColor = "bg-secondary",
  animationDuration = 300,
  controlled = false,
  onProgressChange,
  withLabel = false,
  labelContent,
  labelPosition = "right",
  placeholderProgress = 0,
  placeholderColor = "bg-gray-200",
  withLegend,
  upperLimit = 100,
}: VerticalProgressBarProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Handle the animated progress update
  useEffect(() => {
    if (isDragging || !progress) return; // Don't animate while dragging

    const targetProgress = Math.min(Math.max(progress, 0), upperLimit);
    const step = (targetProgress / animationDuration) * 10;
    let current = currentProgress;

    const timer = setInterval(() => {
      current += step;
      if (current >= targetProgress) {
        clearInterval(timer);
        setCurrentProgress(targetProgress);
      } else {
        setCurrentProgress(current);
      }
    }, 10);

    return () => clearInterval(timer);
  }, [progress, animationDuration, isDragging]);

  // Calculate progress from mouse/touch position
  const calculateProgress = useCallback((clientY: number) => {
    if (!progressBarRef.current) return 0;

    const rect = progressBarRef.current.getBoundingClientRect();
    const height = rect.height;
    const relativeY = rect.bottom - clientY;
    const newProgress = Math.min(Math.max((relativeY / height) * upperLimit, 0), upperLimit);


    return Math.round(newProgress);
  }, []);

  // Mouse events handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!controlled) return;
      setIsDragging(true);
      const newProgress = calculateProgress(e.clientY);
      setCurrentProgress(newProgress);
      onProgressChange?.(newProgress);
    },
    [controlled, calculateProgress, onProgressChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const newProgress = calculateProgress(e.clientY);
      setCurrentProgress(newProgress);
      onProgressChange?.(newProgress);
    },
    [isDragging, calculateProgress, onProgressChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!controlled) return;
      setIsDragging(true);
      const newProgress = calculateProgress(e.touches[0].clientY);
      setCurrentProgress(newProgress);
      onProgressChange?.(newProgress);
    },
    [controlled, calculateProgress, onProgressChange]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const newProgress = calculateProgress(e.touches[0].clientY);
      setCurrentProgress(newProgress);
      onProgressChange?.(newProgress);
    },
    [isDragging, calculateProgress, onProgressChange]
  );

  // Set up event listeners
  useEffect(() => {
    if (controlled) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [controlled, handleMouseMove, handleMouseUp, handleTouchMove]);

  return (
    <div className="flex flex-col">
      <div className="relative flex items-center gap-2 justify-center">
        <div
          ref={progressBarRef}
          className={`relative ${width} ${height} ${backgroundColor} rounded-lg overflow-hidden ${
            controlled ? "cursor-ns-resize" : ""
          }`}
          role="progressbar"
          aria-valuenow={currentProgress}
          aria-valuemin={0}
          aria-valuemax={upperLimit}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Placeholder Progress */}
          {placeholderProgress > 0 && (
            <div
              className={`absolute left-0 right-0 ${placeholderColor} transition-all duration-300 ease-in-out z-10 h-1`}
              style={{
                bottom:`${(placeholderProgress / upperLimit) * 100}%`,
                boxShadow: "0 0 4px rgba(0, 0, 0, 0.2)",
              }}
            />
          )}

          {/* Main Progress Bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 ${color} transition-all ${
              !isDragging ? `duration-${animationDuration}` : "duration-0"
            } ease-in-out rounded-b-lg border-t-8 border-t-secondary-brand-500`}
            style={{ height: `${(currentProgress / upperLimit) * 100}%` }}
          />

          {controlled && (
            <div
              className="absolute w-full h-full"
              style={{ touchAction: "none" }}
            />
          )}
          <span className="sr-only">{`${currentProgress}% progress`}</span>
        </div>

        {/* Progress Label */}
        {withLabel && (
          <div
            className={cn(
              "whitespace-nowrap text-sm font-medium absolute bg-gray-500 text-white px-2 py-1 rounded-md min-w-16",
              {
                "left-10": labelPosition === "left",
                "right-10": labelPosition === "right",
              }
            )}
            style={{
              top: `${98 - (currentProgress / upperLimit) * 100}%`,
              transition: !isDragging ? `top ${animationDuration}ms` : "none",
            }}
          >
            {labelContent || `${Math.round(currentProgress)} / ${upperLimit}`}
          </div>
        )}

        {/* Placeholder Label */}
        {placeholderProgress > 0 && withLabel && (
          <div
            className={cn(
              "whitespace-nowrap text-xs font-medium absolute bg-gray-400 text-white px-2 py-1 rounded-md opacity-75",
              {
                "-right-0": labelPosition === "left",
                "-left-0": labelPosition === "right",
              }
            )}
            style={{
              top: `${97 - (placeholderProgress / upperLimit) * 100}%`,
              transition: `top ${animationDuration}ms`,
            }}
          >
            Current: {placeholderProgress}cm
          </div>
        )}
      </div>

      {/* Legend */}
      {withLegend && (
        <Legend
          items={[
            { color: color, label: "Target Bukaan" },
            { color: placeholderColor, label: "Posisi Sekarang" },
          ]}
        />
      )}
    </div>
  );
}
