import { FaBucket } from "react-icons/fa6";

const NoBuckets = () => {
  return (
    <div className="flex items-center flex-col gap-2 p-4">
      <div className=" bg-gray-300 rounded-3xl p-2">
        <FaBucket
          size={64}
          className="text-gray-500 group-hover:text-indigo-500 shrink-0 transition-all p-2"
        />
      </div>
      <p className="w-48 text-center text-gray-500 ">
        Не найдено ни одного бакета
      </p>
    </div>
  );
};

export default NoBuckets;
