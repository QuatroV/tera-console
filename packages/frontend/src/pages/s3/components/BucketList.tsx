import { Bucket } from "./BucketsTable";
import { RiDeleteBin6Line, RiEdit2Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { trpc } from "@/utils/api";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import NoBuckets from "./NoBuckets";

type Props = {
  buckets: Bucket[];
  onRefresh: () => void;
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Б";
  const sizes = ["Б", "КБ", "МБ", "ГБ", "ТБ"];
  const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${sizes[i]}`;
}

export default function BucketList({ buckets, onRefresh }: Props) {
  const nav = useNavigate();
  const [processing, setProcessing] = useState<string | null>(null);

  const remove = async (name: string) => {
    if (!confirm(`Удалить бакет «${name}»? ВСЕ данные будут потеряны!`)) return;
    try {
      setProcessing(name);
      await trpc.s3.deleteBucket.mutate({ name });
      onRefresh();
    } catch (e) {
      alert("Не удалось удалить бакет");
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  const rename = async (oldName: string) => {
    const newName = prompt("Новое имя бакета:", oldName);
    if (!newName || newName === oldName) return;
    try {
      setProcessing(oldName);
      await trpc.s3.renameBucket.mutate({ oldName, newName });
      onRefresh();
    } catch (e) {
      alert("Не удалось переименовать бакет");
      console.error(e);
    } finally {
      setProcessing(null);
    }
  };

  if (!buckets.length) return <NoBuckets />;

  return (
    <>
      <div className="grid grid-cols-5 font-semibold bg-gray-200 p-4 rounded-2xl">
        <span>Имя</span>
        <span>Количество объектов</span>
        <span>Общий вес</span>
        <span>Дата создания</span>
        <span className="text-right">Действия</span>
      </div>

      {buckets.map((b) => (
        <div
          key={b.Name}
          className="grid grid-cols-5 px-4 py-3 hover:bg-gray-50 items-center rounded-2xl"
        >
          <span
            className="text-indigo-600 underline cursor-pointer"
            onClick={() => nav(`/s3/${b.Name}`)}
          >
            {b.Name}
          </span>

          <span>{b.ObjectCount}</span>

          <span>{b.TotalSize ? formatBytes(b.TotalSize) : "-"}</span>

          <span>
            {b.CreationDate
              ? new Date(b.CreationDate).toLocaleString("ru-RU", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—"}
          </span>

          <span className="flex justify-end gap-4">
            {processing === b.Name ? (
              <Spinner className="text-indigo-500" />
            ) : (
              <>
                <RiEdit2Line
                  title="Переименовать"
                  className="cursor-pointer hover:text-indigo-600"
                  onClick={() => rename(b.Name!)}
                />
                <RiDeleteBin6Line
                  title="Удалить"
                  className="cursor-pointer hover:text-red-600"
                  onClick={() => remove(b.Name!)}
                />
              </>
            )}
          </span>
        </div>
      ))}
    </>
  );
}
