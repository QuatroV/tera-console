import { useEffect, useState } from "react";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Spinner from "@/components/Spinner";
import { PAGES } from "@/router/constants";
import { addNotification } from "@/store/notification";
import trpc from "@/utils/api";
import { useAppDispatch } from "@/utils/redux";
import { nanoid } from "@reduxjs/toolkit";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ConfigurationForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<boolean>();
  const [instanceId, setInstanceId] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [instanceType, setInstanceType] = useState("jupiter_hub");

  // новое состояние для бэкапов
  const [buckets, setBuckets] = useState<string[]>([]);
  const [backupBucket, setBackupBucket] = useState("");
  const [backupKeys, setBackupKeys] = useState<string[]>([]);
  const [backupKey, setBackupKey] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 1) при загрузке формы — список бакетов
  useEffect(() => {
    trpc.s3.listBuckets.query().then((res) => {
      if (res.status === "success") {
        setBuckets(res.buckets.map((b) => b.Name!));
      }
    });
  }, []);

  // 2) когда выбрали бакет, подгружаем из него ключи *.tar
  useEffect(() => {
    if (!backupBucket) {
      setBackupKeys([]);
      return;
    }
    trpc.s3.listObjects
      .query({ bucket: backupBucket, prefix: "" })
      .then((res) => {
        if (res.status === "success") {
          setBackupKeys(
            res.items.map((i) => i.Key).filter((k) => k?.endsWith(".tar"))
          );
        }
      });
  }, [backupBucket]);

  const handleClick = async () => {
    setError("");
    setSuccess(undefined);
    setLoading(true);

    try {
      let res;
      if (backupKey) {
        // если выбран бэкап — вызываем специальную мутацию
        res = await trpc.vm.restoreInstance.mutate({
          instanceName,
          instanceType,
          bucket: backupBucket,
          key: backupKey,
        });
      } else {
        // иначе — обычное создание
        res = await trpc.vm.createInstance.mutate({
          instanceName,
          instanceType,
        });
      }

      setInstanceId(res.instanceId);
      setSuccess(true);
      navigate(`${PAGES.VIRTUAL_MACHINES.path}/${res.instanceId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      dispatch(
        addNotification({
          id: nanoid(),
          title: "Ошибка",
          description: msg,
          type: "failure",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 flex">
      <div className="flex flex-col gap-4 flex-1">
        {/* имя */}
        <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">Имя виртуальной машины</label>
          <Input
            value={instanceName}
            className="border p-4"
            placeholder="Ubuntu-01"
            onChange={(e) => setInstanceName(e.target.value)}
          />
        </div>

        {/* тип */}
        <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">Категория виртуальной машины</label>
          <Select
            className="border p-4 rounded-xl"
            dropdownClassName="min-w-full mt-4 z-10"
            options={[
              <div
                className="p-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 rounded-lg"
                key="jupyter_hub"
              >
                Jupiter Hub
              </div>,
            ]}
          >
            <div
              className="flex justify-between items-center "
              onClick={() => setInstanceType("jupiter_hub")}
            >
              <div>Jupiter Hub</div>
              <IoIosArrowDown size={20} />
            </div>
          </Select>
        </div>

        <h2 className=" font-bold text-lg">Подгрузка бэкапа</h2>

        <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">(Опционально) Выберите бакет</label>
          <Select
            className="border p-4 rounded-xl"
            dropdownClassName="min-w-full mt-4 z-10"
            options={buckets.map((b) => (
              <div
                className="p-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 rounded-lg"
                onClick={() => {
                  setBackupBucket(b);
                  setBackupKey("");
                }}
                key={b}
              >
                {b}
              </div>
            ))}
          >
            <div
              className="flex justify-between items-center"
              onClick={() => setInstanceType("jupiter_hub")}
            >
              <div>{backupBucket}</div>
              <IoIosArrowDown size={20} />
            </div>
          </Select>
        </div>

        {backupBucket && (
          <div className="flex flex-col w-96 gap-2">
            <label className="font-semibold">Выберите файл .tar</label>
            <Select
              className="border p-4 rounded-xl"
              dropdownClassName="w-full mt-4 z-10 overflow-hidden text-ellipsis"
              options={backupKeys.map((k) => (
                <div
                  className="p-2 cursor-pointer hover:bg-gray-100 active:bg-gray-200 rounded-lg overflow-hidden text-ellipsis"
                  onClick={() => {
                    setBackupKey(k);
                  }}
                  key={k}
                >
                  {k.replace(`${backupBucket}/`, "")}
                </div>
              ))}
            >
              <div
                className="flex justify-between items-center "
                onClick={() => setInstanceType("jupiter_hub")}
              >
                <div className="overflow-hidden text-ellipsis">{backupKey}</div>
                <IoIosArrowDown className=" shrink-0" size={20} />
              </div>
            </Select>
          </div>
        )}

        {/* кнопки */}
        <div className="flex gap-2">
          <Button
            variant="filled"
            size="large"
            className="p-4 text-md flex items-center gap-2 rounded-2xl"
            onClick={handleClick}
            disabled={loading || !instanceName.trim()}
          >
            {loading ? (
              <Spinner className="h-6 w-6 text-gray-500" />
            ) : (
              "Создать"
            )}
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="filled"
            size="large"
            className="p-4 text-md flex items-center gap-2 rounded-2xl bg-gray-200"
            disabled={loading}
          >
            Отменить
          </Button>
          {error && <span className="text-red-600">{error}</span>}
          {success && (
            <span className="text-green-600">
              Успешно создан инстанс {instanceId}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ConfigurationForm;
