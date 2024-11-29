import Table from "./components/Table";
import TableHeader from "./components/TableHeader";
import { InstanceProperties } from "../../types";
type VMTableProps = {
  instanceId: string;
  setInstanceStatus: (status: string) => void;
  properties: InstanceProperties;
  instanceStatus: string;
};

const VMTable = ({
  instanceId,
  properties,
  setInstanceStatus,
  instanceStatus,
}: VMTableProps) => {
  return (
    <div className="rounded-2xl bg-white p-2 mb-4">
      <TableHeader
        instanceStatus={instanceStatus}
        instanceId={instanceId}
        setInstanceStatus={setInstanceStatus}
      />
      <Table properties={properties} />
    </div>
  );
};

export default VMTable;
