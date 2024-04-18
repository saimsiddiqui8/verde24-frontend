import { ReactNode } from "react";

export default function GooglePlayButton({ icon }: InputProps) {
  return (
    <button className="bg-[#222] w-fit text-white text-sm flex items-center gap-1 rounded-2xl py-2 px-4 font-semibold">
      {icon}
      Google Play
    </button>
  );
}

interface InputProps {
  icon: ReactNode;
}
