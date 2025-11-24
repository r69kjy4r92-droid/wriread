import React from "react";

export const ACCENT = "from-rose-400 via-orange-300 to-amber-300";
export const RADIUS = "rounded-2xl";
export const SHADOW =
  "shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)]";
export const CARD =
  `${RADIUS} ${SHADOW} bg-white dark:bg-neutral-900 ` +
  "border border-neutral-200 dark:border-neutral-700";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function num(n: number) {
  return (n ?? 0).toLocaleString();
}

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
  disabled,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cx(
      "inline-flex items-center justify-center px-5 py-3 text-sm sm:text-base font-semibold",
      "bg-gradient-to-r text-white",
      ACCENT,
      RADIUS,
      SHADOW,
      "hover:opacity-90 active:opacity-85 transition",
      disabled &&
        "opacity-50 cursor-not-allowed hover:opacity-50 active:opacity-50",
      className
    )}
  >
    {children}
  </button>
);

type GhostButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export const GhostButton: React.FC<GhostButtonProps> = ({
  children,
  className,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cx(
      "inline-flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium",
      RADIUS,
      "border border-neutral-300 bg-white hover:bg-neutral-50 transition",
      "dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 hover:dark:bg-neutral-800",
      className
    )}
  >
    {children}
  </button>
);

export const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    className={cx(
      "px-3 py-1 text-xs font-semibold",
      "bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200",
      "dark:bg-neutral-800 dark:text-neutral-200 dark:border-neutral-700"
    )}
  >
    {children}
  </span>
);
