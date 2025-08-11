// components/PatientTable.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Snapshot } from "@/src/app/hooks/useVitals";

export interface PatientTableProps {
  data: Record<string, Snapshot>;
  onClear: (id: string) => void;
  onSelect: (id: string) => void;
}

export default function PatientTable({
  data,
  onClear,
  onSelect,
}: PatientTableProps) {
  return (
    <table className="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          {["ID", "HR", "SpO₂", "BP", "Time", "Action"].map((h) => (
            <th
              key={h}
              className="p-2 text-left text-gray-600 dark:text-gray-300">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([rawId, s]) => {
          // Strip the "patient:" prefix for display
          const displayId = rawId.replace(/^patient:/, "");
          const isCritical = Number(s.spo2) <= 92;

          return (
            <motion.tr
              key={rawId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`${
                isCritical ? "bg-red-100 dark:bg-red-900" : ""
              } cursor-pointer`}
              onClick={() => onSelect(rawId)}>
              <td className="p-2">{displayId}</td>
              <td className="p-2">{s.hr}</td>
              <td className="p-2">{s.spo2}</td>
              <td className="p-2">{`${s.sys}/${s.dia}`}</td>
              <td className="p-2">
                {new Date(s.timestamp).toLocaleTimeString()}
              </td>
              <td className="p-2">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear(rawId);
                  }}>
                  Clear
                </Button>
              </td>
            </motion.tr>
          );
        })}
      </tbody>
    </table>
  );
}
