import cn from "@utils/cn";
import { ButtonColor, ButtonSize, ButtonVariant } from "./types";

const BUTTON_STATES = {
  normal:
    "rounded-full hover:backdrop-brightness-95 transition-all active:backdrop-brightness-90 hover:brightness-95 active:brightness-90",
  disabled: "opacity-50 cursor-not-allowed",
};

const BUTTON_SIZES = {
  large: "py-2 px-5 text-md",
  medium: "py-1 px-3 text-md",
  small: "py-0.5 px-2 text-sm",
};

const BUTTON_STYLES = {
  filled: {
    primary: "bg-primary",
    secondary: "bg-secondary",
    info: "bg-info",
    error: "bg-error",
    success: "bg-success",
    warning: "bg-warning",
    black: "bg-black",
    white: "bg-white",
  },
  outlined: {
    primary: "border border-primary",
    secondary: "border border-secondary",
    info: "border border-info",
    error: "border border-error",
    success: "border border-success",
    warning: "border border-warning",
    black: "border border-black",
    white: "border border-white",
  },
  text: {
    primary: "text-primary",
    secondary: "text-secondary",
    info: "text-info",
    error: "text-error",
    success: "text-success",
    warning: "text-warning",
    black: "text-black",
    white: "text-white",
  },
};

const defaultStyles = "rounded-full";

export const getStyleString = (
  color: ButtonColor,
  disabled: boolean,
  variant: ButtonVariant,
  size: ButtonSize
) => {
  return cn(
    defaultStyles,
    BUTTON_STATES[disabled ? "disabled" : "normal"],
    BUTTON_SIZES[size],
    BUTTON_STYLES[variant][color]
  );
};
