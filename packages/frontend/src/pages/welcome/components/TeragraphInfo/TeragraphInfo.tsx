import Button from "@/components/Button";
import Image from "@/components/Image";

const TeragraphInfo = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <section className="bg-white p-16 rounded-xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl tracking-wide font-dela mb-4">
              Что такое <span className=" text-indigo-500">Тераграф</span>?
            </h2>
            <p className="text-justify">
              В Московском государственном техническом университете (МГТУ) им.
              Н.Э.Баумана созданы первые в мире микропроцессор и суперкомпьютер,
              в которых на аппаратном уровне реализован набор команд дискретной
              математики DISC (Discrete Mathematics Instruction Set computer).
              Суперкомпьютер Тераграф предназначен для хранения и обработки
              графов сверхбольшой размерности и будет применяться для
              моделирования биологических систем, анализа финансовых потоков в
              режиме реального времени, для хранения знаний в системах
              искусственного интеллекта и в других прикладных задачах.
            </p>
          </div>

          <Button className="bg-indigo-100 text-black  rounded-xl p-4 w-min whitespace-nowrap">
            Подробнее
          </Button>
        </section>
        <Image
          src="../images/Popov.png"
          className="rounded-xl h-[500px]"
          loading="lazy"
        />
      </div>
      {/* <div className="flex w-full gap-2">
        <div className="flex-1 bg-white rounded-xl p-4">1</div>
        <div className="flex-1 bg-white rounded-xl p-4">2</div>
        <div className="flex-1 bg-white rounded-xl p-4">3</div>
      </div> */}
    </div>
  );
};

export default TeragraphInfo;
