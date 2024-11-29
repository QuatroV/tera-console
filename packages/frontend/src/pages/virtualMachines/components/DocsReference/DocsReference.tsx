import Card from "@/components/Card";
import { SlDocs } from "react-icons/sl";

const DocsReference = () => {
  return (
    <div className="flex gap-2">
      <Card className="w-96 p-4 group cursor-pointer hover:-translate-y-1 transition-all">
        <h4 className=" font-semibold text-sm  group-hover:text-indigo-500 mb-2">
          Диагностика ВМ
        </h4>

        <p className="text-xs text-gray-500">
          Управление виртуальной машиной с помощью консоли. Просмотр логов
          сообщений ВМ
        </p>
      </Card>
      <Card className="w-96 p-4 group cursor-pointer hover:-translate-y-1 transition-all">
        <h4 className=" font-semibold text-sm  group-hover:text-indigo-500 mb-2">
          Диагностика и устранение проблем
        </h4>

        <p className="text-xs text-gray-500">
          Способы диагностики и устранения проблем с виртуальными машинами
        </p>
      </Card>
      <Card className="w-96 p-4 group cursor-pointer hover:-translate-y-1 transition-all">
        <h4 className=" font-semibold text-sm  group-hover:text-indigo-500 mb-2">
          Шифрование диска
        </h4>

        <p className="text-xs text-gray-500">
          Как настроить шифрование диска виртуальной машины
        </p>
      </Card>
      <Card className="group flex items-center justify-center cursor-pointer hover:-translate-y-1 transition-all">
        <div className="flex flex-col items-center gap-2">
          <SlDocs size={24} className="text-2xl group-hover:text-indigo-500" />
          <h4 className=" font-semibold text-sm  group-hover:text-indigo-500 text-center">
            Вся документация
          </h4>
        </div>
      </Card>
    </div>
  );
};

export default DocsReference;
