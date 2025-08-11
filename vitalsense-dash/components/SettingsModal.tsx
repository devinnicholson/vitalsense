// components/SettingsModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useThresholds, Thresholds } from "@/src/app/hooks/useThresholds";

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const { thresholds, update, updating } = useThresholds();
  const [local, setLocal] = useState<Thresholds>(thresholds);

  // Keep local state in sync when thresholds load
  useEffect(() => {
    setLocal(thresholds);
  }, [thresholds]);

  if (!open) return null;

  const handleSave = async () => {
    await update(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm z-10">
        <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
          Alert Thresholds
        </h2>

        <label className="block mb-2 text-gray-700 dark:text-gray-300">
          SpO₂ Threshold (%):
          <input
            type="number"
            value={local.spo2}
            onChange={(e) =>
              setLocal({ ...local, spo2: Number(e.target.value) })
            }
            className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
          />
        </label>

        <label className="block mb-4 text-gray-700 dark:text-gray-300">
          Heart Rate Threshold (bpm):
          <input
            type="number"
            value={local.hr}
            onChange={(e) => setLocal({ ...local, hr: Number(e.target.value) })}
            className="mt-1 w-full p-2 border rounded bg-gray-50 dark:bg-gray-700"
          />
        </label>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={updating}>
            {updating ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
