import Button from "@/components/Button";
import Input from "@/components/Input/Input";
import { PAGES } from "@/router/constants";
import { BiPlus } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

type TableHeaderProps = {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const TableHeader = ({ setSearchTerm }: TableHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between mb-2">
      <Button
        onClick={() => navigate(PAGES.CREATE_VIRTUAL_MACHINE.path)}
        variant="filled"
        size="large"
        className="p-3 text-sm flex items-center gap-2 rounded-2xl"
      >
        <BiPlus size={32} />
        Добавить инстанс
      </Button>
      <div className="relative flex items-center">
        <IoSearch className="fill-gray-700 absolute left-3" size={24} />
        <Input
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по инстансам"
          className="w-full p-3 outline-indigo-300 px-12 border text-sm"
        ></Input>
        <IoMdClose
          className="fill-gray-700 absolute right-3 cursor-pointer"
          size={24}
        />
      </div>
    </div>
  );
};

export default TableHeader;
