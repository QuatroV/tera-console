import cn from "@utils/cn";

type NavigationRailGroupProps = {
  children: React.ReactNode;
  align: "top" | "bottom" | "center";
  className?: string;
};

const NavigationRailGroup = (props: NavigationRailGroupProps) => {
  const { children, align, className } = props;
  return (
    <div
      className={cn(
        align === "top" && "mb-auto",
        align === "bottom" && "mt-auto",
        align === "center" && "my-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export default NavigationRailGroup;
