import Button from "@/components/Button";
import Card from "@/components/Card";
import { FaUniversity } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import { MdOutlineBusinessCenter } from "react-icons/md";

const CustomersInfo = () => {
  return (
    <div>
      <h2 className="text-2xl tracking-wide font-dela ml-2 mb-1">Клиенты</h2>
      <h3 className="mb-4 ml-2 text-gray-500">
        Кто может воспользоваться сервисом
      </h3>
      <div className="flex gap-2 w-full">
        <Card className="flex-1 flex gap-4">
          <div className="bg-sky-50 rounded-2xl">
            <div className="p-4 bg-sky-100 w-min rounded-2xl">
              <FaUniversity size={96} className="fill-gray-700" />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h3 className=" tracking-wide font-dela text-gray-700">
                Университеты
              </h3>
              <p className=" text-sm text-gray-500 mb-2">
                Академическое партнерство
              </p>
              <p className="text-gray-500 mb-4 text-xs text-justify">
                Наш сервис предлагает университетам уникальные возможности для
                исследований, обучения и разработки, обеспечивая доступ к
                передовым технологиям обработки и анализа данных. Тераграф
                открывает новые горизонты для научных исследований, позволяя
                студентам и преподавателям использовать мощные инструменты
                визуализации графов для решения сложных задач, способствуя
                глубокому пониманию данных и ускорению научных открытий.
              </p>
            </div>
            <Button
              className="w-full text-start flex items-center gap-2 group hover:bg-indigo-100 hover:backdrop-brightness-100"
              size="large"
              variant="outlined"
            >
              Войти как студент или преподаватель{" "}
              <IoMdArrowRoundForward className="w-0 group-hover:w-4 transition-all " />
            </Button>
          </div>
        </Card>
        <Card className="flex-1 flex gap-4">
          <div className="bg-blue-50 rounded-2xl">
            <div className="p-4 bg-blue-100 w-min rounded-2xl">
              <MdOutlineBusinessCenter size={96} className="fill-gray-700" />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <h3 className=" tracking-wide font-dela text-gray-700">Бизнес</h3>
              <p className=" text-sm text-gray-500 mb-2">
                Решения для каждой отрасли
              </p>
              <p className="text-gray-500 mb-4 text-xs text-justify">
                Тераграф предлагает компаниям мощные инструменты для анализа
                данных, оптимизации процессов и повышения конкурентоспособности
                на рынке. Сотрудничая с нами, бизнес получает доступ к передовым
                технологиям обработки и визуализации данных, позволяющим
                выявлять тренды, прогнозировать рыночные изменения и эффективно
                управлять ресурсами. Это открывает новые возможности для роста,
                инноваций и укрепления позиций компании в своей отрасли.
              </p>
            </div>
            <Button
              className="w-full text-start flex items-center gap-2 group hover:bg-indigo-100"
              size="large"
              variant="outlined"
            >
              Войти как клиент{" "}
              <IoMdArrowRoundForward className="w-0 group-hover:w-4 transition-all hover:backdrop-brightness-100" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomersInfo;
