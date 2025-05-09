import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import Button from "@/components/Button";
import trpc from "@/utils/api";
import { useAppDispatch } from "@/utils/redux";
import { nanoid } from "@reduxjs/toolkit";
import { addNotification } from "@/store/notification";
import { IoIosArrowDown } from "react-icons/io";
import Select from "@/components/Select";

/* ─────────────────────────────────────────────────────────── */

type Props = {
  instanceId: string;
  open: boolean;
  onClose: () => void;
};

export default function BackupInstanceModal({
  instanceId,
  open,
  onClose,
}: Props) {
  /* ---------- state ---------- */
  const [buckets, setBuckets] = useState<string[]>([]);
  const [loadingBuckets, setLoadingBuckets] = useState(true);
  const [selectedBucket, setSelectedBucket] = useState("");
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100, псевдо-прогресс

  const dispatch = useAppDispatch();

  /* ---------- 1. При открытии — список бакетов ---------- */
  useEffect(() => {
    if (!open) return;

    setLoadingBuckets(true);
    trpc.s3.listBuckets
      .query()
      .then((res) => {
        if (res.status === "success")
          setBuckets(res.buckets.map((b) => b.Name!));
      })
      .finally(() => setLoadingBuckets(false));
  }, [open]);

  /* ---------- 2. Сохранить бэкап ---------- */
  const handleSave = async () => {
    if (!selectedBucket) {
      alert("Пожалуйста, выберите бакет");
      return;
    }

    setSaving(true);
    setProgress(0);

    /* простой псевдо-прогресс: постепенно растёт, потом мгновенно 100 % */
    const timer = setInterval(
      () => setProgress((p) => (p < 90 ? p + 5 : p)),
      500
    );

    try {
      const key = `${instanceId}_${Date.now()}.tar`;

      const response = await trpc.vm.backupInstance.mutate({
        instanceId,
        bucket: selectedBucket,
        key,
      });

      clearInterval(timer);

      if (response.status === "error") {
        dispatch(
          addNotification({
            id: nanoid(),
            title: "Ошибка при попытке сделать бэкап инстанса",
            description: response.description,
            type: "failure",
          })
        );
        return;
      }

      /* успешный ответ — ставим прогресс 100 % и уведомляем */
      setProgress(100);

      dispatch(
        addNotification({
          id: nanoid(),
          title: "Бэкап успешно создан",
          description: `Файл сохранён в «${response.bucket}/${response.key}»`,
          type: "success",
        })
      );

      onClose();
    } catch (err) {
      clearInterval(timer);
      console.error(err);
      alert("Ошибка при сохранении бэкапа: " + err);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <Modal
      title="Создать бэкап"
      className="overflow-visible"
      open={open}
      closable
      onClose={onClose}
    >
      <div className="flex flex-col w-96">
        {loadingBuckets ? (
          <p>Загрузка списка бакетов…</p>
        ) : (
          <>
            <label className="flex flex-col gap-1 mb-2">
              <span className="font-medium">Выберите бакет</span>
              <Select
                className="border p-4 rounded-xl"
                dropdownClassName="min-w-full mt-4 z-20"
                options={buckets.map((b) => (
                  <div
                    className="p-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 rounded-lg"
                    key={b}
                    onClick={() => setSelectedBucket(b)}
                  >
                    {b}
                  </div>
                ))}
              >
                <div className="flex justify-between items-center">
                  <div>{selectedBucket}</div>
                  <IoIosArrowDown size={20} />
                </div>
              </Select>
            </label>

            {/* прогресс */}
            {true && (
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <Button
                size="large"
                variant="outlined"
                onClick={onClose}
                disabled={saving}
              >
                Отмена
              </Button>
              <Button
                size="large"
                variant="filled"
                onClick={handleSave}
                disabled={saving || !selectedBucket}
              >
                {saving ? `Сохраняем… ${progress}%` : "Сохранить"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
