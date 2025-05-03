import cn from "@/utils/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

const Card = ({ children, className, ...other }: CardProps) => {
  return (
    <div className={cn("bg-white rounded-xl p-2", className)} {...other}>
      {children}
    </div>
  );
};

export default Card;
