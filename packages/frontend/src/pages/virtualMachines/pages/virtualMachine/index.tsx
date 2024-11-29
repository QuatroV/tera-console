import { useEffect, useState } from "react";
import VirtualMachinePageTitle from "./components/VMPageTitle";
import trpc from "@/utils/api";
import { useParams } from "react-router-dom";
import VMTable from "./components/VMTable";
import { InstanceProperties } from "./types";
import VMTabs from "./components/VMTabs";
import Spinner from "@/components/Spinner";

const VirtualMachine = () => {
  const { id } = useParams<{ id: string }>();
  const [instanceName, setInstanceName] = useState("");
  const [instanceStatus, setInstanceStatus] = useState<string>();
  const [instanceProperties, setInstanceProperties] =
    useState<InstanceProperties>();

  useEffect(() => {
    const fetchVMInfo = async () => {
      try {
        if (!id) {
          throw new Error("ID инстанса отсутствует в URL");
        }
        const res = await trpc.vm.getInstance.query({ id });

        if (res.status !== "success") {
          throw new Error("Ошибка на стороне сервера");
        }

        setInstanceName(res.instance.name);
        setInstanceProperties({
          instanceName: res.instance.name,
          instanceType: res.instance.instanceType,
          createdAt: res.instance.createdAt,
          link: res.instance.link,
        });
        setInstanceStatus(res.instance.status);
      } catch (e) {
        console.error(e);
      }
    };

    // Выполняем первоначальный запрос при монтировании компонента
    fetchVMInfo();

    // Устанавливаем интервал для поллинга каждые 5 секунд
    const intervalId = setInterval(fetchVMInfo, 5000);

    // Очищаем интервал при размонтировании компонента или изменении ID
    return () => {
      clearInterval(intervalId);
    };
  }, [id]);

  return (
    <div className="flex flex-col gap-2">
      <VirtualMachinePageTitle
        instanceStatus={instanceStatus}
        instanceId={id || ""}
        instanceName={instanceName}
      />
      <VMTabs />
      {instanceProperties ? (
        <VMTable
          instanceId={id || ""}
          instanceStatus={instanceStatus || ""}
          setInstanceStatus={setInstanceStatus}
          properties={instanceProperties}
        />
      ) : (
        <div className="bg-white rounded-2xl h-64 p-2 mb-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Spinner className="size-16 text-gray-400" />
            <div className="text-gray-400">Загрузка данных</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualMachine;
