// src/app/hooks/useVitals.tsx
"use client";

import { useState, useEffect } from "react";
import { openDB } from "idb";

export interface Snapshot {
  hr: string;
  spo2: string;
  sys: string;
  dia: string;
  timestamp: string;
}

const DB_NAME = "vitalsense";
const STORE = "snapshots";

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    },
  });
}

export function useVitals(): Record<string, Snapshot> {
  const [snapshots, setSnapshots] = useState<Record<string, Snapshot>>({});

  useEffect(() => {
    let ws: WebSocket;

    (async () => {
      const db = await getDB();

      // 1) Load cached snapshots from IndexedDB
      const all = await db.getAll(STORE);
      if (all.length) {
        const fromCache = Object.fromEntries(
          all.map((s: any) => [
            s.id,
            {
              hr: s.hr,
              spo2: s.spo2,
              sys: s.sys,
              dia: s.dia,
              timestamp: s.timestamp,
            },
          ])
        );
        setSnapshots(fromCache);
      }

      // 2) Open WebSocket for live updates
      ws = new WebSocket("ws://localhost:8080");
      ws.onopen = () => console.log("✅ Vitals WS open");
      ws.onerror = (e) => console.error("❌ Vitals WS error", e);
      ws.onclose = () =>
        console.warn("⏹️ Vitals WS closed, serving cached data");

      ws.onmessage = async (event: MessageEvent) => {
        try {
          const { id, snapshot } = JSON.parse(event.data) as {
            id: string;
            snapshot: Snapshot;
          };
          // update state
          setSnapshots((prev) => ({ ...prev, [id]: snapshot }));
          // cache to IndexedDB
          await db.put(STORE, { id, ...snapshot }, id);
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };
    })();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return snapshots;
}
