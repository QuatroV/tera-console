import { AiOutlineCluster } from "react-icons/ai";
import { FaBucket } from "react-icons/fa6";
import { IoIosBrush } from "react-icons/io";
import { RiInstanceFill } from "react-icons/ri";
import ServiceBlock from "./components/ServiceBlock";
import { useNavigate } from "react-router-dom";
import { PAGES } from "@/router/constants";

const BlocksContainer = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="font-dela mb-2">Сервисы</h2>
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2">
        <ServiceBlock
          onClick={() => navigate(PAGES.VIRTUAL_MACHINES.path)}
          label="Виртуальные машины"
          description="Управление виртуальными машинами в облачной среде, масштабируемость и гибкость для различных вычислительных задач"
          Icon={
            <RiInstanceFill
              size={64}
              className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
            />
          }
        />
        <ServiceBlock
          onClick={() => navigate(PAGES.S3.path)}
          label="S3 Хранилище"
          description="Надежное и масштабируемое облачное решение для хранения данных любого типа и размера с высокой доступностью и безопасностью хранимых данных"
          Icon={
            <FaBucket
              size={64}
              className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
            />
          }
        />
        <ServiceBlock
          label="Кластеры Kubernetes"
          description="Мощная платформа для управления контейнеризированными приложениями, с автоматизицией их развертывания, масштабирования и операций обслуживания"
          Icon={
            <AiOutlineCluster
              size={64}
              className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
            />
          }
        />
        <ServiceBlock
          label="Визуализация графов"
          description="Визуализация сложных данных в виде графов и сетей, упрощая их анализ. Помощь в выявлении закономерностей, взаимосвязей и ключевых элементов в данных"
          Icon={
            <IoIosBrush
              size={64}
              className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
            />
          }
        />
      </div>
    </div>
  );
};

export default BlocksContainer;
