import Checkbox from "@/components/Checkbox";
import localStore from "@/utils/localStore";
import { useFormikContext } from "formik";
import React, { useEffect } from "react";

type RememberMeCheckboxProps = {
  checked: boolean;
  onClick: () => void;
  label: React.ReactNode;
};

const RememberMeCheckbox = ({
  checked,
  onClick,
  label,
}: RememberMeCheckboxProps) => {
  const { setValues } = useFormikContext();

  useEffect(() => {
    if (checked) {
      const values = localStore.get("user");

      console.log({ values, setValues });
      setValues(values);
    }
  }, []);

  return (
    <Checkbox checked={checked} onClick={onClick}>
      <label className={"ml-2 overflow-hidden text-sm text-gray-500"}>
        {label}
      </label>
    </Checkbox>
  );
};

export default RememberMeCheckbox;
