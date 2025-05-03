import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { useParams } from "react-router-dom";

const ConfirmDeleteInstanceModal = ({
  modalOpen,
  setModalOpen,
  onConfirm,
}: {
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  onConfirm: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  return (
    <Modal
      title="Удалить инстанс?"
      closable
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    >
      <p className="mb-4 w-96 break-words">
        Вы уверены что хотите удалить инстанс {id}?
      </p>
      <div className="flex gap-2 justify-end">
        <Button
          className="bg-red-300"
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

export default ConfirmDeleteInstanceModal;
