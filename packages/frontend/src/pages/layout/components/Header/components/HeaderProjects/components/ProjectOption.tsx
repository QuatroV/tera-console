import { PAGES } from "@/router/constants";
import { CgFolder } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const ProjectOption = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(PAGES.PROJECT.path)}
      className="whitespace-pre hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer active:shadow-inner flex items-center gap-3"
    >
      <CgFolder size={24} />
      <div>
        <p className="font-semibold">Тестовый проект</p>
        <p className="text-sm text-gray-400">Тестовая организация</p>
      </div>
    </div>
  );
};

export default ProjectOption;
