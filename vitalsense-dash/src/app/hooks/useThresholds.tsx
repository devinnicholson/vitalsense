"use client";

import { useState, useEffect } from "react";

export interface Thresholds {
  spo2: number;
  hr: number;
}

export function useThresholds() {
  const [thresholds, setThresholds] = useState<Thresholds>({
    spo2: 92,
    hr: 100,
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch("/api/settings/thresholds")
      .then((r) => r.json())
      .then(setThresholds)
      .catch(console.error);
  }, []);

  const update = async (newThresh: Thresholds) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/settings/thresholds", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newThresh),
      });
      const updated = await res.json();
      setThresholds(updated);
    } finally {
      setUpdating(false);
    }
  };

  return { thresholds, update, updating };
}
