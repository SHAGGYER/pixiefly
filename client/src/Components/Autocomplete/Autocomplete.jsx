import React, { useState, useEffect, useRef } from "react";
import HttpClient from "../../Services/HttpClient";
import { useClickOutside } from "../../Hooks/ClickOutside";
import Input from "../Input/Input";
import Button from "../Button/Button";

export default function ({
  url,
  urlAppend,
  label,
  onItemSelected,
  buttons,
  initialItemsUrl,
  renderItem,
  disabled,
  type,
}) {
  const [fetchedItems, setFetchedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previousSearchQuery, setPreviousSearchQuery] = useState("");
  const [latestItems, setLatestItems] = useState([]);
  const wrapperRef = useRef(null);

  useClickOutside(wrapperRef, () => setOpen(false));

  useEffect(() => {
    if (isOpen && initialItemsUrl) {
      fetchInitialItems();
    }
  }, [isOpen]);

  useEffect(() => {
    let handler;
    if (searchQuery) {
      setPreviousSearchQuery(searchQuery);
      handler = setTimeout(async () => {
        setLoading(true);
        const response = await HttpClient().get(
          url + `?${urlAppend}=${searchQuery}`
        );
        setFetchedItems(response.data);
        setLoading(false);
        setOpen(true);
      }, 500);
    } else {
      if (initialItemsUrl && previousSearchQuery) {
        fetchInitialItems();
      }
    }

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  const fetchInitialItems = async () => {
    if (latestItems.length) {
      setFetchedItems(latestItems);
      return;
    }
    setLoading(true);

    const { data } = await HttpClient().get(initialItemsUrl);
    if (type) {
      const mappedItems = data.map((item) => item.item);
      setFetchedItems(mappedItems);
      setLatestItems(mappedItems);
    } else {
      setFetchedItems(data);
      setLatestItems(data);
    }

    setLoading(false);
  };

  const selectItem = async (item) => {
    onItemSelected(item);
    setSearchQuery("");
    await HttpClient().post("/api/search/create", { type, item });
  };

  const search = async (value) => {
    setSearchQuery(value);
  };

  const onButtonClick = (button) => {
    button.onClick();
    setOpen(false);
  };

  return (
    <article className="w-full">
      <div>
        <label className="block mb-2 text-sm uppercase text-gray-600">
          {label}
        </label>
        <div className="flex">
          <input
            className="border-b border-gray-600 w-full"
            value={searchQuery}
            disabled={disabled}
            onChange={(e) => search(e.target.value)}
            onClick={() => setOpen(true)}
          />
          {loading && (
            <p className="py-2 border-b border-gray-600">
              <i className="fas fa-spinner fa-spin"></i>
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          className={
            "absolute mt-1 border border-gray-400 bg-white z-10 w-64 h-64 overflow-y-auto flex-col " +
            (isOpen ? "flex" : "hidden")
          }
          ref={wrapperRef}
        >
          <div className="flex-grow overflow-y-auto h-0">
            {fetchedItems.map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-400 p-2 cursor-pointer hover:bg-gray-400"
                onClick={() => selectItem(item)}
              >
                {renderItem(item)}
              </div>
            ))}
          </div>

          {buttons && buttons.length && (
            <div className="flex p-2 flex-wrap">
              {buttons.map((button, index) => (
                <div key={index}>
                  <button
                    type="button"
                    className={button.className}
                    onClick={() => onButtonClick(button)}
                  >
                    {button.text}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
