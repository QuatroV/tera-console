import Card from "@components/Card";
import WelcomeCardText from "./components/WelcomeCardText";
import Image from "@/components/Image";
import { AiFillCloud } from "react-icons/ai";
import { SlGraph } from "react-icons/sl";

const WelcomeCard = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:gap-0 gap-2">
      <Card className=" bg-gradient-to-tl from-pink-400 via-purple-400 to-indigo-400 h-96 p-4 md:p-12 overflow-hidden rounded-2xl grow @container relative">
        <section className="h-full">
          <WelcomeCardText />
          <Image
            src="./images/microschema.png"
            className=" overflow-hidden rounded-xl shrink-0 absolute right-0 bottom-0 h-full object-cover hidden xl:block"
          />
        </section>
      </Card>
      <div className="lg:min-h-full hidden sm:flex flex-row lg:flex-col lg:ml-4 gap-2 flex-1 lg:min-w-[260px] lg:max-w-[260px] w-full">
        <Card className="flex-1 w-full flex flex-col justify-between">
          <div className="p-4 bg-indigo-200 w-min rounded-2xl">
            <AiFillCloud size={64} className="fill-gray-700" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-end">Облако</h4>
            <p className="text-xs text-gray-500 text-end">
              Используйте Тераграф в облаке для быстрой и безопасной обработки
              данных
            </p>
          </div>
        </Card>
        <Card className="flex-1 w-full flex flex-col justify-between">
          <div className="p-4 bg-violet-200 w-min rounded-2xl">
            <SlGraph size={64} className="fill-gray-700" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-end">Графы</h4>
            <p className="text-xs text-gray-500 text-end">
              Откройте мощь комплексного анализа связей и взаимодействий для
              глубокого понимания данных
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeCard;
