// components/PatientDetailPanel.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface SnapshotPoint {
  time: string;
  spo2: number;
}

interface Props {
  id: string | null; // raw key, e.g. "patient:P19"
  onClose: () => void;
}

export default function PatientDetailPanel({ id, onClose }: Props) {
  const [data, setData] = useState<SnapshotPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Strip prefix
  const displayId = id ? id.replace(/^patient:/, "") : "";

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    fetch(`/api/timeseries/${displayId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then((json: { spo2: [string, string][] }) => {
        const series = json.spo2.map(([ts, v]) => ({
          time: new Date(parseInt(ts)).toLocaleTimeString(),
          spo2: Number(v),
        }));
        setData(series);
      })
      .catch((err) => {
        console.error("Failed to load time series", err);
        setError(err.message || "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, displayId]);

  return (
    <AnimatePresence>
      {id && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          className="fixed top-0 right-0 w-full sm:w-1/2 h-full bg-white dark:bg-gray-800 shadow-lg z-50 p-6 overflow-auto">
          <button
            onClick={onClose}
            className="mb-4 text-gray-600 hover:text-gray-900">
            Close
          </button>

          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Patient {displayId} — Last 24 h SpO₂
          </h2>

          {loading && (
            <p className="text-gray-500 dark:text-gray-400">Loading chart…</p>
          )}
          {error && (
            <p className="text-red-600 dark:text-red-400">Error: {error}</p>
          )}
          {!loading && !error && data.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400">
              No data for past 24 h
            </p>
          )}

          {!loading && !error && data.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer>
                <LineChart data={data}>
                  <XAxis dataKey="time" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="spo2"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
