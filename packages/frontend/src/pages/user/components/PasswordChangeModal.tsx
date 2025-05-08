import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";
import trpc from "@/utils/api";
import { useState } from "react";

const PasswordChangeModal = ({
  modalOpen,
  setModalOpen,
  onClose,
}: {
  modalOpen: boolean;
  setModalOpen: (modalOpen: boolean) => void;
  onClose: () => void;
}) => {
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [saving, setSaving] = useState(false);

  const change = async () => {
    if (pwd1.length < 6) return alert("Минимум 6 символов");
    if (pwd1 !== pwd2) return alert("Пароли не совпадают");
    setSaving(true);
    try {
      await trpc.user.updateMe.mutate({ password: pwd1 });
      alert("Пароль обновлён");
      onClose();
    } catch (e) {
      alert("Не удалось изменить пароль");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Смена пароля"
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      closable
    >
      <div className="flex flex-col gap-4 w-96">
        <Input
          type="password"
          className="border p-4 w-96"
          placeholder="Новый пароль"
          value={pwd1}
          onChange={(e) => setPwd1(e.target.value)}
        />
        <Input
          type="password"
          className="border p-4 w-96"
          placeholder="Повторите пароль"
          value={pwd2}
          onChange={(e) => setPwd2(e.target.value)}
        />
        <Button
          className="p-4 rounded-2xl w-min"
          variant="filled"
          onClick={change}
          disabled={saving}
        >
          {saving ? "Обновление…" : "Сменить"}
        </Button>
      </div>
    </Modal>
  );
};

export default PasswordChangeModal;
