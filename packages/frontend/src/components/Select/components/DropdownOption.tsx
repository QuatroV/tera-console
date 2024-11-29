import cn from "@/utils/cn";

type DropdownOptionProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
};

const DropdownOption = (props: DropdownOptionProps) => {
  const { children, className, onClick, active = false } = props;
  return (
    <div
      onClick={onClick}
      className={cn(
        "whitespace-pre hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer active:shadow-inner",
        active && "bg-gray-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export default DropdownOption;
