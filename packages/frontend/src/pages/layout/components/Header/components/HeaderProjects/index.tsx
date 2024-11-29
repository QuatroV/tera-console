import Select from "@/components/Select";
import { CgFolder } from "react-icons/cg";
import cn from "@/utils/cn";
import { IoIosArrowDown } from "react-icons/io";
import ProjectOption from "./components/ProjectOption";

type HeaderProjectProps = {
  isAuthenticated: boolean;
};

const HeaderProject = ({ isAuthenticated }: HeaderProjectProps) => {
  return (
    <Select
      className={cn(
        "h-full z-10 w-[100px] md:w-[300px]",
        !isAuthenticated && "invisible"
      )}
      dropdownClassName="min-w-full "
      options={[<ProjectOption key="1" />]}
    >
      <div className="flex gap-4 rounded-xl py-2 px-3 items-center justify-between bg-white  hover:shadow active:translate-y-0.5 cursor-pointer transition-all">
        <div className="flex gap-4">
          <CgFolder className="hidden md:block" size={24} />
          <div>
            <p className="font-semibold">Тестовый проект</p>
            <p className="text-sm text-gray-400">Тестовая организация</p>
          </div>
        </div>

        <IoIosArrowDown size={20} className="text-gray-500" />
      </div>
    </Select>
  );
};

export default HeaderProject;
