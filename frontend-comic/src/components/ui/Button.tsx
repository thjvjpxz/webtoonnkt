import React from "react";

type ButtonVariant =
  | "primary"
  | "primaryOutline"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "edit"
  | "delete";

type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  // Map variant to tailwind classes
  const variantClasses = {
    primary: "bg-[var(--primary)] text-[var(--foreground)] hover:bg-[var(--primary-hover)]",
    primaryOutline: "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)]",
    secondary: "bg-gray-20 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    success: "bg-green-60 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800",
    danger: "bg-rose-60 text-white hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-800",
    warning: "bg-amber-50 text-white hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700",
    info: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900",
    edit: "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-500 dark:hover:bg-amber-900/50",
    delete: "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-500 dark:hover:bg-rose-900/50",
    outlinePrimary: "border-blue-60 text-blue-600 hover:bg-blue-100 dark:border-blue-700 dark:text-blue-700 dark:hover:bg-blue-900/30",
  };

  // Map size to tailwind classes
  const sizeClasses = {
    xs: "text-xs p-1.5",
    sm: "text-sm p-2",
    md: "text-md px-4 py-2",
    lg: "text-base px-5 py-2.5"
  };

  // Set base classes
  const baseClasses = "font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer";

  // Set focus ring color based on variant
  const focusRingClasses = {
    primary: "focus:ring-[var(--primary)]",
    primaryOutline: "focus:ring-[var(--primary)]",
    secondary: "focus:ring-gray-500",
    success: "focus:ring-green-500",
    danger: "focus:ring-rose-500",
    warning: "focus:ring-amber-500",
    info: "focus:ring-blue-400",
    edit: "focus:ring-amber-400",
    delete: "focus:ring-rose-400"
  };

  const widthClass = fullWidth ? "w-full" : "";
  const gapClass = children && icon ? "gap-2" : "";

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${focusRingClasses[variant]} ${widthClass} ${gapClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          {children}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
};

export default Button; 