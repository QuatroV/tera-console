import Button from "@/components/Button";
import Spinner from "@/components/Spinner";
import { PAGES } from "@/router/constants";
import trpc from "@/utils/api";
import { useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";
import { MdDelete, MdRefresh } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteInstanceModal from "./ConfirmDeleteInstanceModal";

type InstanceControlButtonsProps = {
  setInstanceStatus: (status: string) => void;
  instanceId: string;
  instanceStatus: string;
};

const InstanceControlButtons = ({
  setInstanceStatus,
  instanceId,
  instanceStatus,
}: InstanceControlButtonsProps) => {
  const [loadingStopBtn, setLoadingStopBtn] = useState(false);
  const [loadingStartBtn, setLoadingStartBtn] = useState(false);

  const handleStopContainer = async () => {
    try {
      setLoadingStopBtn(true);
      const res = await trpc.vm.stopInstance.mutate({ id: instanceId });
      setInstanceStatus(res.instance.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStopBtn(false);
    }
  };

  const handleStartContainer = async () => {
    try {
      setLoadingStartBtn(true);
      const res = await trpc.vm.startInstance.mutate({ id: instanceId });
      setInstanceStatus(res.instance.status);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStartBtn(false);
    }
  };

  const navigate = useNavigate();

  const handleDeleteContainer = async () => {
    try {
      const res = await trpc.vm.deleteInstance.mutate({ id: instanceId });

      if (res.status !== "success") {
        throw new Error("Ошибка на стороне сервера");
      }

      navigate(PAGES.VIRTUAL_MACHINES.path);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestartContainer = () => {};

  const [modalOpen, setModalOpen] = useState(false);

  if (instanceStatus === "STOPPED") {
    return (
      <div className="flex text-black bg-indigo-200 rounded-2xl">
        <ConfirmDeleteInstanceModal
          modalOpen={modalOpen}
          onConfirm={handleDeleteContainer}
          setModalOpen={setModalOpen}
        />
        <Button
          onClick={handleStartContainer}
          title="Запустить инстанс"
          className="rounded-none rounded-l-2xl  group flex flex-col items-center justify-center"
        >
          {loadingStartBtn ? (
            <Spinner className="h-6 w-6 text-gray-500" />
          ) : (
            <FaPlay className="w-6 h-6 text-black group-hover:text-indigo-500" />
          )}
        </Button>
        <Button
          onClick={() => setModalOpen(true)}
          title="Удалить инстанс"
          className="rounded-none rounded-r-2xl group flex flex-col items-center justify-center"
        >
          <MdDelete className="w-6 h-6 text-black group-hover:text-red-500" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex text-black bg-indigo-200 rounded-2xl">
      <ConfirmDeleteInstanceModal
        modalOpen={modalOpen}
        onConfirm={handleDeleteContainer}
        setModalOpen={setModalOpen}
      />
      <Button
        onClick={handleStopContainer}
        title="Остановить инстанс"
        className="rounded-none rounded-l-2xl  group flex flex-col items-center justify-center"
      >
        {loadingStopBtn ? (
          <Spinner className="h-6 w-6 text-gray-500" />
        ) : (
          <FaPause className="w-6 h-6 text-black group-hover:text-indigo-500" />
        )}
      </Button>
      <Button
        onClick={handleRestartContainer}
        title="Перезапустить инстанс"
        className="rounded-none group flex flex-col items-center justify-center"
      >
        <MdRefresh className="w-6 h-6 text-black group-hover:text-indigo-500" />
      </Button>
      <Button
        onClick={() => setModalOpen(true)}
        title="Удалить инстанс"
        className="rounded-none rounded-r-2xl group flex flex-col items-center justify-center"
      >
        <MdDelete className="w-6 h-6 text-black group-hover:text-red-500" />
      </Button>
    </div>
  );
};

export default InstanceControlButtons;
