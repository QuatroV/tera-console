import cn from "@utils/cn";
import { FaUser } from "react-icons/fa6";

type AvatarProps = {
  src?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>;

const defaultStyles = "rounded-full w-10 h-10";

const Avatar = (props: AvatarProps) => {
  const { className, ...other } = props;

  if (!other.src) {
    return (
      <div>
        <FaUser className={cn(defaultStyles, "fill-gray-700", className)} />
      </div>
    );
  }
  return (
    <div>
      <img className={cn(defaultStyles, className)} {...other} />
    </div>
  );
};

export default Avatar;
