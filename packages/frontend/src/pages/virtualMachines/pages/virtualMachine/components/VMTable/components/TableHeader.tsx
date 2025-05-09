import Button from "@/components/Button";
import InstanceControlButtons from "./InstanceControlButtons";
import { MdOutlineBackup } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import GoToContainerButton from "./GoToContainerButton";
import { useState } from "react";
import RenameInstanceModal from "./RenameInstanceModal";
import BackupInstanceModal from "./BackupInstanceModal";

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
  const [renameModal, setRenameModal] = useState(false);
  const [backupModal, setBackupModal] = useState(false);

  return (
    <>
      <RenameInstanceModal
        instanceId={instanceId}
        modalOpen={renameModal}
        setModalOpen={setRenameModal}
      />

      <BackupInstanceModal
        instanceId={instanceId}
        open={backupModal}
        onClose={() => setBackupModal(false)}
      />

      <div className="flex mb-2 justify-between">
        <div className="flex gap-2">
          <Button
            onClick={() => setBackupModal(true)}
            variant="outlined"
            size="large"
            className="p-3 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50 border-gray-300"
          >
            <MdOutlineBackup size={20} />
            <p className="text-sm">Сделать бэкап</p>
          </Button>
          <Button
            onClick={() => setRenameModal(true)}
            variant="outlined"
            size="large"
            className="p-3 text-md flex gap-2 items-center rounded-2xl hover:bg-indigo-50 border-gray-300"
          >
            <BiEdit size={20} />
            <p className="text-sm">Переименовать инстанс</p>
          </Button>
        </div>

        <div className="flex gap-2">
          {instanceStatus === "RUNNING" && instanceType === "jupiter_hub" && (
            <GoToContainerButton containerLink={containerLink} />
          )}
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
