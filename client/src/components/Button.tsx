"use client";

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
  ...props
}: ButtonProps) {
  const baseStyle =
    "rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-150 active:scale-[0.98]";
  const fullWidthStyle = fullWidth ? "w-full" : "";

  const variantStyle =
    variant === "primary"
      ? "bg-primary text-white hover:bg-primaryHover active:bg-primaryActive"
      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100";

  return (
    <button
      className={clsx(baseStyle, variantStyle, fullWidthStyle, className)}
      {...props}
    >
      {children}
    </button>
  );
}
