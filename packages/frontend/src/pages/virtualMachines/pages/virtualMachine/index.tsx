import { lazy, Suspense, useEffect, useState } from "react";
import VirtualMachinePageTitle from "./components/VMPageTitle";
import trpc from "@/utils/api";
import { useParams } from "react-router-dom";
import { InstanceProperties, VMTab } from "./types";
import VMTabs from "./components/VMTabs";

const VMMainTab = lazy(() => import("./components/VMMainTab"));
const VMLogTab = lazy(() => import("./components/VMLogTab"));
const VMConsoleTab = lazy(() => import("./components/VMConsoleTab"));
const VMStatsTab = lazy(() => import("./components/VMStatsTab"));

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

  const [tab, setTab] = useState<VMTab>("main");

  return (
    <div className="flex flex-col gap-2">
      <VirtualMachinePageTitle
        instanceType={instanceProperties?.instanceType}
        instanceStatus={instanceStatus}
        instanceName={instanceName}
      />
      <VMTabs tab={tab} setTab={setTab} />
      {tab === "main" ? (
        <Suspense fallback={null}>
          <VMMainTab
            instanceId={id || ""}
            instanceStatus={instanceStatus || ""}
            setInstanceStatus={setInstanceStatus}
            instanceProperties={instanceProperties}
          />
        </Suspense>
      ) : null}
      {tab === "logs" ? (
        <Suspense fallback={null}>
          <VMLogTab instanceId={id || ""} />
        </Suspense>
      ) : null}
      {tab === "console" ? (
        <Suspense fallback={null}>
          <VMConsoleTab instanceId={id || ""} />
        </Suspense>
      ) : null}
      {tab === "monitoring" ? (
        <Suspense>
          <VMStatsTab instanceId={id || ""} />
        </Suspense>
      ) : null}
    </div>
  );
};

export default VirtualMachine;
