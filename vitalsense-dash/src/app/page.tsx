// src/app/page.tsx
"use client";

import React, { useState } from "react";
import Card from "@/components/Card";
import SkeletonCard from "@/components/SkeletonCard";
import SkeletonRow from "@/components/SkeletonRow";
import PatientTable from "@/components/PatientTable";
import VitalsChart from "@/components/VitalsChart";
import PatientDetailPanel from "@/components/PatientDetailPanel";
import SettingsModal from "@/components/SettingsModal";
import { useThresholds } from "@/src/app/hooks/useThresholds";
import { useVitals, Snapshot } from "@/src/app/hooks/useVitals";

export default function DashboardPage() {
  const snapshotsMap = useVitals();
  const loading = Object.keys(snapshotsMap).length === 0;

  const [cleared, setCleared] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { thresholds } = useThresholds();

  // Filter out cleared
  const data = Object.fromEntries(
    Object.entries(snapshotsMap).filter(([id]) => !cleared.has(id))
  );
  const snaps: Snapshot[] = Object.values(data);

  // Metrics
  const total = snaps.length;
  const avgSpO2 = total
    ? (snaps.reduce((sum, s) => sum + Number(s.spo2), 0) / total).toFixed(1)
    : "—";
  const avgHR = total
    ? (snaps.reduce((sum, s) => sum + Number(s.hr), 0) / total).toFixed(0)
    : "—";

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setSettingsOpen(true)}
        className="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg"
        aria-label="Open settings">
        ⚙️
      </button>

      <div className="p-6">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <Card title="Total Patients" value={total} />
              <Card title="Avg SpO₂" value={avgSpO2} />
              <Card title="Avg HR" value={avgHR} />
              <Card
                title="Thresholds"
                value={`SpO₂ ≤ ${thresholds.spo2}%, HR ≥ ${thresholds.hr}`}
              />
            </>
          )}
        </div>

        {/* Table & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    {["ID", "HR", "SpO₂", "BP", "Time", "Action"].map((h) => (
                      <th key={h} className="p-2 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <SkeletonRow key={i} />
                  ))}
                </tbody>
              </table>
            ) : (
              <PatientTable
                data={data}
                onClear={(id) => setCleared((prev) => new Set(prev).add(id))}
                onSelect={(id) => setSelectedId(id)}
              />
            )}
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow">
            <VitalsChart data={snaps} />
          </div>
        </div>
      </div>

      {/* Drill-down Panel */}
      <PatientDetailPanel id={selectedId} onClose={() => setSelectedId(null)} />

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
