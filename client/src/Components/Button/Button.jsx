import React from "react";
import { Link } from "react-router-dom";

export default function ({
  loading,
  onClick,
  to,
  className,
  type,
  disabled,
  children,
}) {
  return to ? (
    <Link
      to={to}
      disabled={disabled}
      className={
        "block px-6 py-2 rounded disabled:opacity-75 disabled:cursor-not-allowed " +
        className
      }
    >
      {children}
    </Link>
  ) : onClick ? (
    <button
      className={
        "px-6 py-2 block rounded disabled:opacity-75 disabled:cursor-not-allowed " +
        className
      }
      disabled={disabled}
      onClick={onClick}
    >
      {loading && <i class="fas fa-spinner fa-spin mr-4"></i>}
      {children}
    </button>
  ) : (
    <button
      className={
        "px-6 py-2 block rounded disabled:opacity-75 disabled:cursor-not-allowed " +
        className
      }
      type={type}
      disabled={disabled}
    >
      {loading && <i className="fas fa-spinner fa-spin mr-4"></i>}
      {children}
    </button>
  );
}
