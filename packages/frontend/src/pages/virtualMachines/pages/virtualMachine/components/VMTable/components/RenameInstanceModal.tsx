import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import trpc from "@/utils/api";
import { useState } from "react";

const RenameInstanceModal = ({
  instanceId,
  modalOpen,
  setModalOpen,
}: {
  instanceId: string;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");

  const onConfirm = async () => {
    try {
      await trpc.vm.renameInstance.mutate({
        instanceId,
        newName,
      });
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Переименовать инстанс"
      closable
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    >
      <p className="mb-1 w-96 break-words">
        Введите новое название для инстанса
      </p>
      <Input
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Новое название..."
        className="mb-6 border border-gray-200 w-full p-2"
      />
      <div className="flex gap-2 justify-end">
        <Button
          className="bg-indigo-200"
          size="large"
          variant="filled"
          onClick={() => {
            setLoading(true);
            onConfirm();
          }}
        >
          {loading ? (
            <Spinner className="h-6 w-6 text-gray-500" />
          ) : (
            "Подтвердить"
          )}
        </Button>
        <Button
          className="bg-gray-200"
          size="large"
          variant="filled"
          onClick={() => setModalOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </Modal>
  );
};

export default RenameInstanceModal;
