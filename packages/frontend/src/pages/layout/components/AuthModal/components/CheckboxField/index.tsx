import { useState } from "react";
import Checkbox from "@/components/Checkbox";
import { useField } from "formik";
import cn from "@/utils/cn";

type CheckboxFieldProps = {
  label: React.ReactNode;
  id: string;
};

const CheckboxField = (props: CheckboxFieldProps) => {
  const { label, id } = props;

  const [checked, setChecked] = useState(false);

  const [, meta, helpers] = useField(id);

  const handleClick: React.MouseEventHandler<HTMLInputElement> = () => {
    const newState = !checked;
    helpers.setValue(newState, true);
    setChecked(newState);
  };

  const hasError = meta.touched && meta.error;

  return (
    <Checkbox
      checked={checked}
      onClick={handleClick}
      className={cn(hasError && "border-red-500 border")}
    >
      <label
        className={cn(
          "ml-2 overflow-hidden text-sm text-gray-500",
          hasError && "text-red-500"
        )}
      >
        {label}
      </label>
    </Checkbox>
  );
};

export default CheckboxField;
