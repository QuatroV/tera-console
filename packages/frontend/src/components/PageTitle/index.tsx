import Breadcrumbs from "@/components/Breadcrumbs";
import SectionIcon from "../SectionIcon";
import { IconType } from "react-icons";

type BreadcrumbItem = {
  name: string;
  link: string;
};

type PageTitleProps = {
  title: string;
  items: BreadcrumbItem[];
  Icon: IconType;
};

const PageTitle: React.FC<PageTitleProps> = ({ title, items, Icon }) => {
  return (
    <div className="flex gap-4 items-center mb-4">
      <SectionIcon>
        <Icon
          size={32}
          className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
        />
      </SectionIcon>
      <div>
        <Breadcrumbs items={items} />
        <h1 className="font-dela text-2xl">{title}</h1>
      </div>
    </div>
  );
};

export default PageTitle;
