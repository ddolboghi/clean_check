"use client";

import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface ProgressBarProps {
  value: number;
  formatDate: string;
}

export default function ProgressBar({ value, formatDate }: ProgressBarProps) {
  const [progress, setProgress] = useState(value);

  useEffect(() => {
    setProgress(value);
  }, [value]);

  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="pb-6 overflow-hidden">
      <div className="relative w-full">
        <div className="flex flex-row justify-between pb-2">
          <span className="text-[14px]">{clampedProgress}%</span>
          <div className="flex flex-col justify-center h-[20px] w-[125px] text-xs rounded-full bg-white bg-opacity-30 text-[#528A80] text-center">
            {formatDate}
          </div>
        </div>
        <Progress value={clampedProgress} className="h-[10px] bg-[#E1F5F1]" />
      </div>
    </div>
  );
}
