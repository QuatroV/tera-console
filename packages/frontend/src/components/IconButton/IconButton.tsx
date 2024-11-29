import cn from "@utils/cn";

type IconButtonProps = {
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton = ({ className, children, ...other }: IconButtonProps) => {
  return (
    <button
      className={cn(
        "hover:bg-gray-200 active:bg-gray-300 cursor-pointer rounded-full p-3 transition-all",
        className
      )}
      {...other}
    >
      {children}
    </button>
  );
};

export default IconButton;
