// components/StatusBadge.tsx
import React from "react";

type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    UNDER_VERIFICATION: "bg-yellow-100 text-yellow-800",
    VERIFIED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-200 text-green-900",
    CANCELLED: "bg-gray-200 text-gray-800",
    REFUNDED: "bg-purple-100 text-purple-800",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
}