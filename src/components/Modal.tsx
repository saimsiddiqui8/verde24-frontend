import { IoCloseSharp } from "react-icons/io5";
import { ReactNode } from "react";

export default function Modal({
  title,
  children,
  showModal,
  setModal,
}: ModalInputProps) {
  return (
    <div
      style={{ display: showModal ? "flex" : "none" }}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-40 flex bg-black/50 justify-center items-center w-full md:inset-0 h-screen max-h-full "
    >
      <div className="relative p-4 w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-primary">{title}</h3>
            <IoCloseSharp
              size={25}
              className="absolute top-4 right-2 cursor-pointer"
              onClick={() => setModal(false)}
            />
          </div>
          <div className="p-4 md:p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

interface ModalInputProps {
  title: string;
  children: ReactNode;
  showModal: boolean;
  setModal: (x: boolean) => void;
}
