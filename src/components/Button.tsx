import type { ReactElement } from "react";

interface ButtonProps {
  variant?: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const variants = {
  primary:
    "bg-blue-600 text-white font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 shadow-md hover:shadow-lg hover:shadow-blue-300/50 transform hover:-translate-y-0.5",
  secondary:
    "bg-white text-blue-600 border border-blue-600 font-medium hover:bg-blue-50 focus:ring-2 focus:ring-blue-200 shadow-sm hover:shadow-lg hover:shadow-blue-200/40",
};

const baseStyles =
  "flex items-center justify-center gap-2 py-2 px-4 rounded-md cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";

const Button = ({
  variant = "primary",
  text,
  startIcon,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      <span>{text}</span>
    </button>
  );
};

export default Button;