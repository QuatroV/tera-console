import Breadcrumbs from "@/components/Breadcrumbs";
import SectionIcon from "@/components/SectionIcon/SectionIcon";
import { PAGES } from "@/router/constants";
import { RiInstanceFill } from "react-icons/ri";

const PageTitle = () => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <SectionIcon>
        <RiInstanceFill
          size={32}
          className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
        />
      </SectionIcon>
      <div>
        <Breadcrumbs
          items={[
            { name: "teraCloud", link: PAGES.CONSOLE.path },
            {
              name: "Виртуальные машины",
              link: PAGES.VIRTUAL_MACHINES.path,
            },
          ]}
        />
        <h1 className="font-dela text-2xl">Виртуальные машины</h1>
      </div>
    </div>
  );
};

export default PageTitle;
