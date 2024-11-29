import Button from "@/components/Button";
import { PAGES } from "@/router/constants";
import { useNavigate } from "react-router-dom";
import InstanceControlButtons from "./InstanceControlButtons";
import { MdOutlineBackup } from "react-icons/md";
import { BiEdit } from "react-icons/bi";

type TableHeaderProps = {
  instanceId: string;
  setInstanceStatus: (status: string) => void;
  instanceStatus: string;
};

const TableHeader = ({
  instanceId,
  setInstanceStatus,
  instanceStatus,
}: TableHeaderProps) => {
  const navigate = useNavigate();
  return (
    <div className="flex mb-2 justify-between">
      <div className="flex gap-2">
        <Button
          onClick={() => navigate(PAGES.CREATE_VIRTUAL_MACHINE.path)}
          variant="outlined"
          size="large"
          className="p-4 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50"
        >
          <MdOutlineBackup size={20} />
          <p className="text-sm ">Сделать бэкап</p>
        </Button>
        <Button
          onClick={() => navigate(PAGES.CREATE_VIRTUAL_MACHINE.path)}
          variant="outlined"
          size="large"
          className="p-4 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50"
        >
          <BiEdit size={20} />
          <p className="text-sm ">Переименовать инстанс</p>
        </Button>
      </div>

      <InstanceControlButtons
        instanceStatus={instanceStatus}
        instanceId={instanceId}
        setInstanceStatus={setInstanceStatus}
      />
    </div>
  );
};

export default TableHeader;
