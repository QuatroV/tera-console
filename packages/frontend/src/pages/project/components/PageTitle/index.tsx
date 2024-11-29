import Breadcrumbs from "@/components/Breadcrumbs";
import { PAGES } from "@/router/constants";
import { IoIosApps } from "react-icons/io";

const PageTitle = () => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <div className=" bg-gray-300 rounded-2xl p-2">
        <IoIosApps
          size={32}
          className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
        />
      </div>
      <div>
        <Breadcrumbs
          items={[
            { name: "teraCloud", link: PAGES.CONSOLE.path },
            {
              name: "Настройки проекта",
              link: PAGES.PROJECT.path,
            },
          ]}
        />
        <h1 className="font-dela text-2xl">Настройки проекта</h1>
      </div>
    </div>
  );
};

export default PageTitle;
