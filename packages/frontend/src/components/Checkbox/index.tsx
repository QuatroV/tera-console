import cn from "@/utils/cn";
import { FaCheck } from "react-icons/fa6";

type CheckboxProps = {
  className?: string;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Checkbox = (props: CheckboxProps) => {
  const { className, checked, children, ...other } = props;

  const inputStyle = cn(
    "border border-gray-500 rounded-lg p-1 h-6 w-6 cursor-pointer",
    checked && "text-white bg-indigo-700",
    className
  );

  if (!children) {
    return <input type="checkbox" className={inputStyle} />;
  }

  return (
    <div className="flex items-center">
      <div className={inputStyle} {...other}>
        {checked && <FaCheck />}
      </div>
      {children}
    </div>
  );
};

export default Checkbox;
