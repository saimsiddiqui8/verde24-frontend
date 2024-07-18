import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function ContentSection({ children, className }: ContentProps) {
  return (
    <div
      className={twMerge(
        `border-primary border rounded-lg p-4 my-4 ${className ?? ""}`
      )}
    >
      {children}
    </div>
  );
}

interface ContentProps {
  children: ReactNode;
  className?: any;
}
