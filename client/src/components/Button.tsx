"use client";
import React from "react";
import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  fullWidth = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const fullWidthStyle = fullWidth ? "w-full" : "";

  const variantStyle =
    variant === "primary"
      ? clsx(
          "bg-primary text-white hover:bg-primaryHover active:bg-primaryActive",
          disabled &&
            "bg-gray-300 text-gray-500 hover:bg-gray-300 active:bg-gray-300"
        )
      : clsx(
          "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100",
          disabled &&
            "bg-gray-100 text-gray-400 border-gray-200 hover:bg-gray-100"
        );

  return (
    <button
      className={clsx(baseStyle, variantStyle, fullWidthStyle, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
