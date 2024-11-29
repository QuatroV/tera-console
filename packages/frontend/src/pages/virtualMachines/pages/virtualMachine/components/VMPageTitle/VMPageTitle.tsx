import Breadcrumbs from "@/components/Breadcrumbs";
import { PAGES } from "@/router/constants";
import { RiInstanceFill } from "react-icons/ri";
import InstanceStatusMarker from "./components/InstanceStatusMarker";
import SectionIcon from "@/components/SectionIcon/SectionIcon";

type PageTitleProps = {
  instanceName: string;
  instanceId: string;
  instanceStatus?: string;
};

const VirtualMachinePageTitle = ({
  instanceName,
  instanceId,
  instanceStatus,
}: PageTitleProps) => {
  return (
    <div className="flex gap-4 items-center">
      <SectionIcon>
        <RiInstanceFill
          size={32}
          className="text-gray-500 shrink-0 transition-all"
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
            {
              name: instanceId,
              link: "",
            },
          ]}
        />
        <h1 className="font-dela text-2xl flex gap-2 items-center">
          {instanceName ? (
            instanceName
          ) : (
            <div className="bg-gray-300 h-7 w-48 mb-1  rounded-md animate-pulse" />
          )}
          <InstanceStatusMarker instanceStatus={instanceStatus} />
        </h1>
      </div>
    </div>
  );
};

export default VirtualMachinePageTitle;
