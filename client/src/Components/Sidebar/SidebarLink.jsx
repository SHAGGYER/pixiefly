import React from "react";
import { Link } from "react-router-dom";

export default function ({ title, to, icon }) {
  return (
    <div className="mb-2 border-b border-gray-600 pb-2">
      <Link to={to} className="text-white">
        <span className="mr-6">{icon}</span>
        {title}
      </Link>
    </div>
  );
}
