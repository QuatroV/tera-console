import Input from "@/components/Input/Input";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const HeaderSearchInput = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 bg-white flex-1  mx-2 h-[60px] rounded-xl relative ">
      <IoSearch className="fill-gray-700 absolute left-3" size={24} />
      <Input autoFocus className="w-full p-4 outline-indigo-300 px-12"></Input>
      <IoMdClose
        onClick={() => navigate(-1)}
        className="fill-gray-700 absolute right-3 cursor-pointer"
        size={24}
      />
    </div>
  );
};

export default HeaderSearchInput;
