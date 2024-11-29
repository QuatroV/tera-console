import cn from "@utils/cn";
import { IoIosArrowDown } from "react-icons/io";

type NavItemProps = {
  Icon?: React.ReactNode;
  label: React.ReactNode;
  collapsed?: boolean;
  active?: boolean;
  onClick: () => void;
  options: React.ReactNode[];
};

const ExpandableNavItem = (props: NavItemProps) => {
  const { Icon, collapsed, label, active, onClick, options } = props;

  return (
    <>
      <div
        onClick={onClick}
        className={cn(
          active && "bg-indigo-100",
          "flex items-center p-2 rounded-2xl cursor-pointer transition-all active:scale-95"
        )}
      >
        <div
          className={cn(
            "text-xl flex justify-center items-center",
            active && "[&>*]:fill-indigo-500"
          )}
        >
          {Icon}
        </div>
        {!collapsed && (
          <div
            className={cn(
              "ml-2 whitespace-pre flex justify-between w-full items-center",
              active && "text-indigo-500"
            )}
          >
            <div>{label}</div>
            <IoIosArrowDown size={20} className="text-gray-500" />
          </div>
        )}
      </div>
      {!collapsed && active && (
        <div className="border bg-gray-100 rounded-2xl p-1">
          {options.map((option) => option)}
        </div>
      )}
    </>
  );
};

export default ExpandableNavItem;
