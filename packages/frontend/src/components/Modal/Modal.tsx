import cn from "@/utils/cn";
import { IoClose } from "react-icons/io5";
import IconButton from "../IconButton";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  closable?: boolean;
};

const Modal = ({
  open,
  onClose,
  children,
  className,
  title,
  closable,
}: Props) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    <dialog
      onClose={onClose}
      className={cn(
        className,
        "p-4 rounded-xl shadow-md fixed inset-0 z-10 backdrop:pointer-events-none backdrop:backdrop-blur-sm"
      )}
      ref={ref}
    >
      {title ? (
        <header className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-black mr-2 tracking-wide">{title}</h2>
          {closable ? (
            <IconButton onClick={onClose}>
              <IoClose size={26} />
            </IconButton>
          ) : null}
        </header>
      ) : null}
      <div>{children}</div>
    </dialog>
  );
};

export default Modal;
