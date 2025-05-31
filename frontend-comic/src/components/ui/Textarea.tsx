"use client";

import React, { forwardRef } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      className = "",
      id,
      rows = 3,
      ...props
    },
    ref
  ) => {
    // Generate a unique ID if not provided
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    // Width class
    const widthClass = fullWidth ? "w-full" : "";

    // Error class for border
    const errorClass = error ? "border-rose-500" : "border-[var(--border)]";

    // Focus ring
    const focusClass = "focus:outline-none focus:ring-2 focus:ring-[var(--primary)]";

    // Theme support
    const textareaClass = "bg-[var(--background)] text-[var(--text-primary)]";

    return (
      <div className={`${widthClass} ${className}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-1"
          >
            {label}
          </label>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`${widthClass} px-3 py-2 border ${errorClass} rounded-md ${focusClass} ${textareaClass}`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...props}
        />

        {error && (
          <p
            id={`${textareaId}-error`}
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

Textarea.displayName = "Textarea";

export default Textarea; 