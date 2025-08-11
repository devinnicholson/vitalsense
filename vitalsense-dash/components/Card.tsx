// components/Card.tsx
import React from "react";

export interface CardProps {
  title: string;
  value: React.ReactNode;
}

export default function Card({ title, value }: CardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 transition-colors">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
        {title}
      </h3>
      <div className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {value}
      </div>
    </div>
  );
}
