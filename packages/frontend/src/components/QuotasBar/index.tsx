import { GiProcessor } from "react-icons/gi";
import QuotaDiagram from "./components/QuotaDiagram";
import { FaFloppyDisk, FaMemory, FaServer } from "react-icons/fa6";
import { MdMemory } from "react-icons/md";

const QuotasBar = () => {
  return (
    <div className="flex gap-2 mb-4 overflow-auto scrollbar">
      <QuotaDiagram
        label="Инстансы"
        remainingText="1"
        outOfText="из 4 шт"
        progress={40}
        idx={0}
        Icon={<FaServer size="100%" className="fill-gray-700" />}
      />
      <QuotaDiagram
        label="CPU"
        remainingText="1"
        outOfText="из 8 шт"
        progress={60}
        Icon={<GiProcessor size="100%" className="fill-gray-700" />}
        idx={1}
      />
      <QuotaDiagram
        label="RAM"
        remainingText="1"
        outOfText="из 16 ГБ"
        progress={20}
        Icon={<FaMemory size="100%" className="fill-gray-700" />}
        idx={2}
      />
      <QuotaDiagram
        label="Объем"
        remainingText="10"
        outOfText="из 200 ГБ"
        progress={100}
        Icon={<MdMemory size="100%" className="fill-gray-700" />}
        idx={3}
      />
      <QuotaDiagram
        label="Диски"
        remainingText="1"
        outOfText="из 10 шт"
        progress={10}
        Icon={<FaFloppyDisk size="100%" className="fill-gray-700" />}
        idx={4}
      />
    </div>
  );
};

export default QuotasBar;
