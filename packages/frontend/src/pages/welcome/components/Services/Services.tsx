import { AiOutlineCluster } from "react-icons/ai";
import { FaBucket, FaDatabase } from "react-icons/fa6";
import { IoIosBrush } from "react-icons/io";
import { MdDataUsage } from "react-icons/md";
import { RiInstanceFill } from "react-icons/ri";

const Services = () => {
  return (
    <div>
      <h2 className="text-2xl tracking-wide font-dela mb-1 ml-2">Продукты</h2>
      <h3 className="mb-4 ml-2 text-gray-500">Решения для каждой задачи</h3>
      <div className="flex w-full justify-center">
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          <div className="bg-white col-span-2 row-span-1 p-6 rounded-3xl flex gap-4 hover:outline outline-indigo-500 outline-1 outline-offset-2 group">
            <div className="bg-gray-200 p-4 rounded-3xl h-min group-hover:bg-indigo-100 transition-all group-hover:shadow">
              <RiInstanceFill
                size={96}
                className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
              />
            </div>
            <div className="flex flex-col items-end justify-end">
              <h4 className="font-semibold text-2xl mb-4">
                Виртуальные машины
              </h4>
              <p className="text-end text-gray-500 text-xs">
                Мощная и гибкая вычислительную среду, позволяя вам
                масштабировать ресурсы в соответствии с потребностями вашего
                проекта. Благодаря быстрой настройке и удобному управлению, вы
                получаете полный контроль над вашими приложениями и данными,
                обеспечивая оптимальную производительность и безопасность.
              </p>
            </div>
          </div>
          <div className="bg-white col-span-1 row-span-1 p-6 rounded-3xl flex justify-between flex-col gap-2 hover:outline outline-indigo-500 outline-1 outline-offset-2 group">
            <div className="bg-gray-200 p-4 rounded-3xl w-min group-hover:bg-indigo-100 transition-all group-hover:shadow">
              <FaBucket
                size={64}
                className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
              />
            </div>
            <div>
              <h4 className="font-semibold text-end">S3 Хранилище</h4>
              <p className="text-end text-gray-500 text-xs">
                S3 хранилище обеспечивает надежное и масштабируемое облачное
                решение для хранения любых объемов данных. Это идеальный выбор
                для безопасного хранения, архивации и резервного копирования
                ваших цифровых активов.
              </p>
            </div>
          </div>
          <div className="bg-white col-span-1 row-span-1 p-6 rounded-3xl flex flex-col justify-between gap-2 hover:outline outline-indigo-500 outline-1 outline-offset-2 group">
            <div className="bg-gray-200 p-4 rounded-3xl w-min group-hover:bg-indigo-100 transition-all group-hover:shadow">
              <AiOutlineCluster
                size={64}
                className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
              />
            </div>
            <div>
              <h4 className="font-semibold text-end">Кластеры Kubernetes</h4>
              <p className="text-end text-gray-500 text-xs">
                Готовое решение для управления контейнеризированными
                приложениями, обеспечивая их эффективное развертывание,
                масштабирование и управление.
              </p>
            </div>
          </div>
          <div className="bg-white col-span-1 row-span-1 p-6 rounded-3xl flex justify-between flex-col gap-2 hover:outline outline-indigo-500 outline-1 outline-offset-2 group">
            <div className="bg-gray-200 p-4 rounded-3xl w-min group-hover:bg-indigo-100 transition-all group-hover:shadow">
              <MdDataUsage
                size={64}
                className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
              />
            </div>
            <div>
              <h4 className="font-semibold text-end">Большие данные</h4>
              <p className="text-end text-gray-500 text-xs">
                Мощные инструменты для обработки и анализа огромных объемов
                данных в реальном времени, позволяя вашему бизнесу принимать
                обоснованные решения на основе глубоких аналитических данных
              </p>
            </div>
          </div>
          <div className="bg-white col-span-1 row-span-1 p-6 rounded-3xl flex justify-between flex-col gap-2 hover:outline outline-indigo-500 outline-1 outline-offset-2 group">
            <div className="bg-gray-200 p-4 rounded-3xl w-min group-hover:bg-indigo-100 transition-all group-hover:shadow">
              <FaDatabase
                size={64}
                className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
              />
            </div>
            <div>
              <h4 className="font-semibold text-end">Базы данных</h4>
              <p className="text-end text-gray-500 text-xs">
                Надежные, масштабируемые и удобные в управлении решения для
                хранения данных, поддерживая как традиционные реляционные, так и
                современные NoSQL базы данных.
              </p>
            </div>
          </div>
          <div className="bg-white col-span-2 row-span-1 p-6 rounded-3xl flex gap-4 hover:outline outline-indigo-500 outline-1 outline-offset-2 group">
            <div className="flex flex-col ">
              <h4 className="font-semibold text-2xl mb-4">
                Визуализация графов
              </h4>
              <p className="text-gray-500 text-xs">
                Мощные инструменты для наглядного представления сложных сетей и
                взаимосвязей данных, позволяя пользователям легко анализировать
                и интерпретировать большие объемы информации
              </p>
            </div>
            <div className="flex items-end">
              <div className="bg-gray-200 p-4 rounded-3xl h-min group-hover:bg-indigo-100 transition-all group-hover:shadow ">
                <IoIosBrush
                  size={96}
                  className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
