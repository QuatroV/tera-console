import cn from "@/utils/cn";
import { PiGraphFill } from "react-icons/pi";

type LogoProps = {
  className?: string;
  svgClassName?: string;
  collapsed?: boolean;
  variant: "default" | "main" | "footer";
};

const Logo = (props: LogoProps) => {
  const { variant, className, svgClassName } = props;
  return (
    <div className={cn("flex items-center", className)}>
      <PiGraphFill
        className={cn(
          "shrink-0",
          variant === "main" && "w-12 h-12 text-indigo-900",
          svgClassName
        )}
      />
      {variant === "main" && (
        <h1 className="hidden sm:block text-xl lg:text-4xl font-dela font-black text-indigo-900 ml-2 tracking-wide">
          teraCloud
        </h1>
      )}
      {variant === "footer" && (
        <h1 className="text-2xl font-dela font-black text-gray-700 ml-2 tracking-wide">
          teraCloud
        </h1>
      )}
    </div>
  );
};

export default Logo;
