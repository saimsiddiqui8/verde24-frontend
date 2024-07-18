import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const baseStyles =
  "bg-gradient-to-b from-[#3FB946] via-[#3DB54B] via-[#3BB150] to-[#125DB9] rounded-[20px] text-white font-semibold border-0 py-2 px-4 w-full";


export default function Button({
  title,
  className,
  onClick,
  type,
  secondary,
}: InputProps) {
  return (
    <button
      className={twMerge(
        `${baseStyles} ${className ?? ""} ${secondary ? "btn-back" : ""}`
      )}
      onClick={onClick}
      type={type ?? "submit"}
    >
      {title}
    </button>
  );
}

type InputProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  title: string;
  className?: any;
  onClick?: () => void;
  type?: string;
  secondary?: true;
};
