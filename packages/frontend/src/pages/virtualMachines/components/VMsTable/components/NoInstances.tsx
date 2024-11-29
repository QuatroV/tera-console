import { RiInstanceFill } from "react-icons/ri";

const NoInstances = () => {
  return (
    <div className="flex items-center flex-col gap-2 p-4">
      <div className=" bg-gray-300 rounded-3xl p-2">
        <RiInstanceFill
          size={64}
          className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all"
        />
      </div>
      <p className="w-48 text-center text-gray-500 ">
        Не найдено ни одного инстанса
      </p>
    </div>
  );
};

export default NoInstances;
