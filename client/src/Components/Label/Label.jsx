import React from "react";

export default function ({ children }) {
  return (
    <label className="block uppercase text-sm mb-2 text-gray-500">
      {children}
    </label>
  );
}
