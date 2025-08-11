// components/VitalsChart.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Snapshot } from "@/src/app/hooks/useVitals";

interface VitalsChartProps {
  data: Snapshot[];
}

export default function VitalsChart({ data }: VitalsChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" tickFormatter={(t) => t.slice(11, 19)} />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="spo2"
            name="SpO₂"
            stroke="#10B981"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="hr"
            name="HR"
            stroke="#3B82F6"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
