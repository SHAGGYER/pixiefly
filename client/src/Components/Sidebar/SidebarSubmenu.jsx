import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ({ title, items, icon }) {
  const [isMenuOpen, setMenuOpen] = useState(false);
  return (
    <div className="relative mb-4 border-b border-gray-600">
      <div
        className="text-white cursor-pointer flex justify-between items-center"
        onClick={() => setMenuOpen(!isMenuOpen)}
      >
        <div>
          <span className="mr-6">{icon}</span>
          <span>{title}</span>
        </div>
        {isMenuOpen ? (
          <i className="fas fa-chevron-up"></i>
        ) : (
          <i className="fas fa-chevron-down"></i>
        )}
      </div>
      <div className={"pt-2 ml-4 w-full " + (isMenuOpen ? "block" : "hidden")}>
        {items.map((item, index) => (
          <div className="mb-2 last:mb-0" key={index}>
            <Link to={item.to} className="text-white">
              {item.title}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
