import cn from "@/utils/cn";
import { LuLoader2 } from "react-icons/lu";

type SpinnerProps = {
  className?: string;
};

const Spinner = (props: SpinnerProps) => {
  const { className } = props;
  return <LuLoader2 className={cn("animate-spin", className)} />;
};

export default Spinner;
