"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";

interface SelectOptionProps {
  options: string[];
  onChange: (selected: string) => void;
  defaultValue?: string;
}

export default function SelectOption({
  options,
  onChange,
  defaultValue = options[0],
}: SelectOptionProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (label: string) => {
    setSelected(label);
    setIsOpen(false);
    if (onChange) onChange(label);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-sm">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-white border border-secondary p-2 w-24 rounded-md shadow-sm cursor-pointer text-center hover:border-primaryHover focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {selected}
      </button>

      {isOpen && (
        <div className="absolute mt-1 bg-white w-24 border border-secondary shadow-md rounded-md z-10 overflow-hidden">
          {options.map((label) => (
            <div
              key={label}
              onClick={() => handleSelect(label)}
              className={`p-2 w-full text-center cursor-pointer transition-colors
              ${
                selected === label
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100 hover:text-primary"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
