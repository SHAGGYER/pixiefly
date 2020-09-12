import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../../Hooks/ClickOutside";

export default function ({ title, items }) {
  const closedClass = "navbar__submenu-list";
  const openClass = "navbar__submenu-list navbar__submenu--active";
  const wrapperRef = useRef(null);
  const [className, setClassName] = useState(closedClass);

  useClickOutside(wrapperRef, () => setClassName(closedClass));

  const close = () => {
    setClassName(closedClass);
  };

  const open = () => {
    setClassName(openClass);
  };

  const handleOnClick = (item) => {
    item.onClick();
    close();
  };

  return (
    <div className="relative mr-5 last:mr-0" ref={wrapperRef}>
      <a
        href="#"
        rel="noreferrer"
        className="no-underline text-black hover:text-gray-600"
        onClick={open}
      >
        {title}
      </a>
      <ul className={className}>
        {items.map((item, index) => (
          <li className="bg-white transition-all" key={index}>
            {item.onClick ? (
              <a
                href="#"
                onClick={() => handleOnClick(item)}
                className="p-2 block hover:bg-gray-500 hover:text-white"
              >
                {item.title}
              </a>
            ) : item.href ? (
              <a
                href={item.href}
                onClick={() => close()}
                className="p-2 block hover:bg-gray-500 hover:text-white"
              >
                {item.title}
              </a>
            ) : (
              <Link
                className="p-2 block hover:bg-gray-500 hover:text-white"
                onClick={close}
                to={item.to}
              >
                {item.title}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
