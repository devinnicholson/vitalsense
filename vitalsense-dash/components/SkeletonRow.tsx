// components/SkeletonRow.tsx
import React from "react";

export default function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <td key={i} className="p-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full">
              &nbsp;
            </div>
          </td>
        ))}
    </tr>
  );
}
