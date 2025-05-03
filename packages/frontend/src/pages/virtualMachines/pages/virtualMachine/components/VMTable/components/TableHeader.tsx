import Button from "@/components/Button";
import { PAGES } from "@/router/constants";
import { useNavigate } from "react-router-dom";
import InstanceControlButtons from "./InstanceControlButtons";
import { MdOutlineBackup } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import GoToContainerButton from "./GoToContainerButton";
import { useState } from "react";
import RenameInstanceModal from "./RenameInstanceModal";

type TableHeaderProps = {
  instanceId: string;
  setInstanceStatus: (status: string) => void;
  instanceStatus: string;
  containerLink: string;
  instanceType: string;
};

const TableHeader = ({
  instanceId,
  setInstanceStatus,
  instanceStatus,
  containerLink,
  instanceType,
}: TableHeaderProps) => {
  const navigate = useNavigate();

  const [renameInstanceModalOpened, setRenameInstanceModalOpened] =
    useState(false);

  return (
    <>
      <RenameInstanceModal
        instanceId={instanceId}
        modalOpen={renameInstanceModalOpened}
        setModalOpen={setRenameInstanceModalOpened}
      />

      <div className="flex mb-2 justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => navigate(PAGES.CREATE_VIRTUAL_MACHINE.path)}
            variant="outlined"
            size="large"
            className="p-3 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50 border-gray-300"
          >
            <MdOutlineBackup size={20} />
            <p className="text-sm ">Сделать бэкап</p>
          </Button>
          <Button
            onClick={() => setRenameInstanceModalOpened(true)}
            variant="outlined"
            size="large"
            className="p-3 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50 border-gray-300"
          >
            <BiEdit size={20} />
            <p className="text-sm ">Переименовать инстанс</p>
          </Button>
        </div>

        <div className="flex gap-2">
          {instanceStatus === "RUNNING" && instanceType === "jupiter_hub" ? (
            <GoToContainerButton containerLink={containerLink} />
          ) : null}

          <InstanceControlButtons
            instanceStatus={instanceStatus}
            instanceId={instanceId}
            setInstanceStatus={setInstanceStatus}
          />
        </div>
      </div>
    </>
  );
};

export default TableHeader;
