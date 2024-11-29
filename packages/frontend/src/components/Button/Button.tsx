import cn from "@utils/cn";
import { ButtonColor, ButtonSize, ButtonVariant } from "./types";
import { getStyleString } from "./utils";
import { useMemo } from "react";

type ButtonProps = {
  children: React.ReactNode;
  color?: ButtonColor;
  disabled?: boolean;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: ButtonProps) => {
  const {
    children = null,
    color = "primary",
    disabled = false,
    className = "",
    variant = "text",
    size = "medium",
    type = "button",
    ...other
  } = props;

  const styleString = useMemo(
    () => getStyleString(color, disabled, variant, size),
    [color, disabled, variant, size]
  );

  return (
    <button type={type} {...other} className={cn(styleString, className)}>
      {children}
    </button>
  );
};

export default Button;
