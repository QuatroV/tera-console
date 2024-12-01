import Button from "@/components/Button";
import Input from "@/components/Input";
import { useState } from "react";
import { BiUpload } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";

const TableHeader = () => {
  const [, setSearchTerm] = useState("");
  return (
    <div className="mb-2 flex justify-between">
      <div className="relative flex items-center max-w-96">
        <IoSearch className="fill-gray-700 absolute left-3" size={24} />
        <Input
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Поиск по инстансам"
          className="w-full p-4 outline-indigo-300 px-12 border"
        ></Input>
        <IoMdClose
          className="fill-gray-700 absolute right-3 cursor-pointer"
          size={24}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outlined"
          size="large"
          className="p-4 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50"
        >
          <BiUpload size={20} />
          <p className="text-sm ">Создать папку</p>
        </Button>
        <Button
          variant="filled"
          size="large"
          className="p-4 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50"
        >
          <BiUpload size={20} />
          <p className="text-sm ">Загрузить</p>
        </Button>
      </div>
    </div>
  );
};

export default TableHeader;
