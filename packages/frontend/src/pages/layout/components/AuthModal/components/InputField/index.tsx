import { useField } from "formik";
import Input from "@/components/Input/Input";
import cn from "@/utils/cn";

type InputFieldProps = {
  label?: string;
  id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField = (props: InputFieldProps) => {
  const { label, id, ...other } = props;

  const [field, meta] = useField(id);

  const hasError = meta.touched && meta.error;

  return (
    <div className="flex gap-0 md:gap-2 items-start flex-col md:flex-row">
      {label && (
        <label className="w-48 h-[33.6px] flex items-center">{label}</label>
      )}
      <div className=" w-full">
        <Input
          className={cn(
            "border border-gray-200 w-full",
            hasError && "rounded-b-none border-red-500 border-b-0"
          )}
          {...other}
          {...field}
        />
        {hasError && (
          <div className="border border-red-500 p-1 px-2 bg-red-100 rounded-b-xl text-xs flex-none ">
            <div className="max-w-[197px]">{meta.error?.at(0)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputField;
