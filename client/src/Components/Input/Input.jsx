import React from "react";

export default function ({
  value,
  onChange,
  error,
  type,
  label,
  disabled,
  onClick,
}) {
  return (
    <div className="w-full">
      <label
        className={
          "block text-gray-600 uppercase mb-2 text-sm" +
          (!!error ? " text-red-600" : "")
        }
      >
        {label}
      </label>
      <input
        value={value}
        onClick={onClick}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        disabled={disabled}
        className={
          "block border-b border-gray-600 w-full" +
          (!!error ? " border-red-600" : "")
        }
      />
      {!!error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
}
