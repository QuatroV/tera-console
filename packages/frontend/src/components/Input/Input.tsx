import cn from "@/utils/cn";

type Props = {
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: Props) => {
  const { className, ...other } = props;
  return (
    <input
      className={cn("rounded-xl px-4 py-1 invalid:border-danger", className)}
      {...other}
    ></input>
  );
};

export default Input;
