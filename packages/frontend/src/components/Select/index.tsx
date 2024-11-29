import React, { useRef, useState } from "react";
import SelectButton from "./components/SelectButton";
import Dropdown from "./components/Dropdown";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import cn from "@/utils/cn";

type SelectProps = {
  children: React.ReactNode;
  options: React.ReactNode[];
  dropdownClassName?: string;
  className?: string;
};

const Select = (props: SelectProps) => {
  const { children, options, dropdownClassName, className } = props;
  const [collapsed, setCollapsed] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => {
    setCollapsed(true);
  });

  return (
    <div className={cn("relative overflow-visible", className)}>
      <SelectButton onClick={() => setCollapsed((prevState) => !prevState)}>
        {children}
      </SelectButton>
      {!collapsed && (
        <Dropdown
          dropdownRef={dropdownRef}
          className={dropdownClassName}
          options={options}
        />
      )}
    </div>
  );
};

export default Select;
