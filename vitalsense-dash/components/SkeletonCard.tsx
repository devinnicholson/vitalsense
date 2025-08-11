// components/SkeletonCard.tsx
import React from "react";

export default function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 animate-pulse">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4">
        &nbsp;
      </div>
      <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-3/4">
        &nbsp;
      </div>
    </div>
  );
}
