import clsx from "clsx";

interface SwitchProps {
  id?: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
}

const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  onCheckedChange,
  disabled,
}) => {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onCheckedChange(!checked)}
      className={clsx(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        checked ? "bg-indigo-600" : "bg-gray-300"
      )}
    >
      <span
        className={clsx(
          "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-1"
        )}
      />
    </button>
  );
};

export default Switch;
