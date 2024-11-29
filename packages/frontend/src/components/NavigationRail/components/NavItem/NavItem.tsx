import cn from "@utils/cn";

type NavItemProps = {
  Icon?: React.ReactNode;
  label: React.ReactNode;
  collapsed?: boolean;
  active?: boolean;
  onClick: () => void;
};

const NavItem = (props: NavItemProps) => {
  const { Icon, collapsed, label, active, onClick } = props;

  return (
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
        <div className={cn("ml-2 whitespace-pre", active && "text-indigo-500")}>
          {label}
        </div>
      )}
    </div>
  );
};

export default NavItem;
