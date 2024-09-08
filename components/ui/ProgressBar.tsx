"use client";

import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  const [progress, setProgress] = useState(value);

  useEffect(() => {
    setProgress(value);
  }, [value]);

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="pb-6 overflow-hidden">
      <div className="relative w-full">
        <span className="text-[14px]">{clampedProgress}%</span>
        <Progress value={clampedProgress} className="h-[10px] bg-[#E1F5F1]" />
      </div>
    </div>
  );
}
