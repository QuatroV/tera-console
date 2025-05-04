import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import trpc from "@/utils/api";
import Modal from "@/components/Modal";

type Props = {
  onSuccess: () => void;
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
};

// Функция валидации имени бакета
const isValidBucketName = (name: string) => {
  const regex = /^[a-z0-9]([a-z0-9.-]{1,61}[a-z0-9])?$/;
  const hasConsecutiveDots = name.includes("..");
  return regex.test(name) && !hasConsecutiveDots;
};

export default function CreateBucketModal({
  onSuccess,
  modalOpen,
  setModalOpen,
}: Props) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;

    if (!isValidBucketName(name.trim())) {
      setError("Недопустимое имя бакета. См. правила ниже.");
      return;
    }

    setError("");
    setCreating(true);
    try {
      await trpc.s3.createBucket.mutate({ name: name.trim() });
      setName("");
      onSuccess();
      setModalOpen(false);
    } catch (e) {
      console.error("[CreateBucketForm] createBucket error", e);
      alert("Не удалось создать бакет");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Modal
      title="Создать бакет"
      closable
      open={modalOpen}
      onClose={() => setModalOpen(false)}
    >
      <div className="flex flex-col gap-4 items-start w-96">
        <h1 className="font-semibold">Введите имя бакета:</h1>

        <Input
          value={name}
          className="border p-4 w-96"
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="Имя бакета (a-z0-9.-)"
        />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="text-gray-500 text-xs leading-snug bg-blue-100 border border-blue-500 p-2 rounded-xl">
          Имя может содержать только <b>строчные латинские буквы</b>,{" "}
          <b>цифры</b>,<b>дефисы</b> и <b>точки</b>. Должно начинаться и
          заканчиваться буквой или цифрой. Длина — от 3 до 63 символов.
        </div>

        <Button
          onClick={handleCreate}
          disabled={creating}
          className="p-4 rounded-2xl"
          variant="filled"
          size="large"
        >
          {creating ? "Создание…" : "Создать"}
        </Button>
      </div>
    </Modal>
  );
}
