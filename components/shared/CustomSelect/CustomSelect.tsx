"use client";

import { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "اختر...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-wrapper" ref={wrapperRef}>
      <div
        className={`custom-select-trigger ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {selectedOption?.icon && (
            <span className="custom-select-option-icon">
              {selectedOption.icon}
            </span>
          )}
          <span>{selectedOption?.label || placeholder}</span>
        </span>
        <span className="custom-select-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select-option ${
                option.value === value ? "selected" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon && (
                <span className="custom-select-option-icon">{option.icon}</span>
              )}
              <span className="custom-select-option-text">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
