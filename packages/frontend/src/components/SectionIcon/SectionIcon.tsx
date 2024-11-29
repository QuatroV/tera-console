import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type SectionIconProps = {
  children: React.ReactNode;
};

const SectionIcon = ({ children }: SectionIconProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="group bg-gray-300 rounded-2xl p-2 hover:bg-indigo-200 relative cursor-pointer overflow-hidden transition-all"
      onClick={() => navigate(-1)}
    >
      <div className="opacity-100 group-hover:opacity-0 transition-all">
        {children}
      </div>
      <IoIosArrowBack className="text-indigo-500 size-6 -left-20 group-hover:left-0 absolute transition-all top-0 translate-x-1/2 translate-y-1/2" />
    </div>
  );
};

export default SectionIcon;
