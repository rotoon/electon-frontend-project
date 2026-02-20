"use client";

import dynamic from "next/dynamic";
import { memo } from "react";

interface PartyStat {
  id: number;
  name: string;
  color: string;
  seats: number;
  [key: string]: string | number | undefined;
}

interface ParliamentChartProps {
  data: PartyStat[];
}

const ParliamentChartContent = memo(function ParliamentChartContent({
  data,
}: ParliamentChartProps) {
  // Placeholder - chart not yet implemented
  void data
  return (
    <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg">
      Loading Chart…
    </div>
  );
});

export const ParliamentChart = dynamic(
  () => import("./parliament-chart-content").then((mod) => mod.ParliamentChartContent),
  {
    loading: () => (
      <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-lg animate-pulse motion-reduce:animate-none">
        Loading Chart…
      </div>
    ),
    ssr: false,
  }
);

export { ParliamentChartContent };
export type { PartyStat };
export type { ParliamentChartProps };
