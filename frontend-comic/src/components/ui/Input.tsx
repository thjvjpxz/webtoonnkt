"use client";

import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = "",
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    // Width class
    const widthClass = fullWidth ? "w-full" : "";

    // Error class for border
    const errorClass = error ? "border-rose-500" : "border-[var(--border)]";

    // Focus ring
    const focusClass = "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]";

    // Dark mode support
    const inputClass = "bg-[var(--background)] text-[var(--text-primary)]";

    // Icon padding
    const leftPadding = leftIcon ? "pl-10" : "pl-3";
    const rightPadding = rightIcon ? "pr-10" : "pr-3";

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--primary)]">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            className={`${widthClass} ${leftPadding} ${rightPadding} py-2 border ${errorClass} rounded-md ${focusClass} ${inputClass}`}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-rose-500"
          >
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-[var(--text-primary)] opacity-70">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
