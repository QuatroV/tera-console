import cn from "@/utils/cn";
import React from "react";

type DropdownProps = {
  options: React.ReactNode[];
  className?: string;
  dropdownRef: React.Ref<HTMLDivElement>;
  onDropdownClick: React.MouseEventHandler<HTMLDivElement> | undefined;
};

const Dropdown = (props: DropdownProps) => {
  const { options, className, dropdownRef, onDropdownClick } = props;
  return (
    <div
      ref={dropdownRef}
      className={cn(
        "bg-white absolute p-2 rounded-2xl border shadow border-gray-300 mt-1 right-0",
        className
      )}
      onClick={onDropdownClick}
    >
      {options.map((option) => option)}
    </div>
  );
};

export default Dropdown;
