import AdvantageCard from "./AdvantageCard";
import { FaServer } from "react-icons/fa6";
import { GiStrongbox } from "react-icons/gi";
import { SlGraph } from "react-icons/sl";
import { FaHandsHelping } from "react-icons/fa";

const AdvantagesList = () => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 w-full justify-around items-stretch">
      <AdvantageCard>
        <div className="bg-purple-100 rounded-2xl">
          <div className="p-4 bg-purple-200 w-min rounded-2xl">
            <SlGraph size={72} className="fill-gray-700" />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-end">Уникальная архитектура</h4>
          <p className="text-xs text-gray-500 text-end">
            Эксклюзивная отечественная микроархитектура &quot;Леонард
            Эйлер&quot;
          </p>
        </div>
      </AdvantageCard>
      <AdvantageCard>
        <div className="bg-violet-100 rounded-2xl">
          <div className="p-4 bg-violet-200 w-min rounded-2xl">
            <GiStrongbox size={72} className="fill-gray-700" />
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-end">Отказоустойчивость</h4>
          <p className="text-xs text-gray-500 text-end">
            Непрерывная работа сервисов даже в условиях непредвиденных сбоев и
            нагрузок
          </p>
        </div>
      </AdvantageCard>
      <AdvantageCard>
        <div className="bg-indigo-100 rounded-2xl">
          <div className="p-4 bg-indigo-200 w-min rounded-2xl">
            <FaHandsHelping size={72} className="fill-gray-700" />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-end">Поддержка</h4>
          <p className="text-xs text-gray-500 text-end">
            Своевременная помощь и решение любых вопросов и проблем
          </p>
        </div>
      </AdvantageCard>

      <AdvantageCard>
        <div className="bg-blue-100 rounded-2xl">
          <div className="p-4 bg-blue-200 w-min rounded-2xl">
            <FaServer size={72} className="fill-gray-700" />
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold text-end">Производительность</h4>
          <p className="text-xs text-gray-500 text-end">
            Системы, спроектированные для обеспечения высочайшей эффективности
          </p>
        </div>
      </AdvantageCard>
    </ul>
  );
};

export default AdvantagesList;
