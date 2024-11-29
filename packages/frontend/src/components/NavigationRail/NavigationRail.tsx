import cn from "@/utils/cn";
import { MouseEventHandler } from "react";
import { MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";

type NavigationRailProps = {
  children: React.ReactNode;
  collapsed?: boolean;
  onCollapse: MouseEventHandler<HTMLDivElement>;
};

const NavigationRail: React.FC<NavigationRailProps> = (
  props: NavigationRailProps
) => {
  const { children, collapsed, onCollapse } = props;
  return (
    <div
      className={cn(
        "bg-white h-full flex flex-col p-2 rounded-2xl shadow transition-all",
        collapsed ? "w-14" : "w-52"
      )}
    >
      {children}
      <div
        className="p-2 flex gap-4 items-center hover:bg-gray-200 cursor-pointer transititon-all rounded-2xl"
        onClick={onCollapse}
      >
        <MdOutlineKeyboardDoubleArrowRight
          className={cn("w-6 h-6", !collapsed && "rotate-180")}
        />
        {!collapsed && <span className="whitespace-pre">Свернуть меню</span>}
      </div>
    </div>
  );
};

export default NavigationRail;
