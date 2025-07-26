"use client";
import React from "react";

interface RadioButtonProps {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

export default function RadioButton({
  name,
  value,
  checked,
  onChange,
  children,
}: RadioButtonProps) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="accent-accent"
      />
      <span>{children}</span>
    </label>
  );
}
