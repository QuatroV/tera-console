import Spinner from "@/components/Spinner";
import VMTable from "../VMTable";
import { InstanceProperties } from "../../types";

type VMMainTabProps = {
  instanceId: string;
  instanceStatus: string;
  setInstanceStatus: (status: string) => void;
  instanceProperties?: InstanceProperties;
};

const VMMainTab = (props: VMMainTabProps) => {
  const { instanceProperties, instanceStatus, instanceId, setInstanceStatus } =
    props;

  return instanceProperties ? (
    <VMTable
      instanceId={instanceId || ""}
      instanceStatus={instanceStatus || ""}
      setInstanceStatus={setInstanceStatus}
      properties={instanceProperties}
    />
  ) : (
    <div className="bg-white rounded-2xl h-64 p-2 mb-4 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner className="size-16 text-gray-400" />
        <div className="text-gray-400">Загрузка данных</div>
      </div>
    </div>
  );
};

export default VMMainTab;
