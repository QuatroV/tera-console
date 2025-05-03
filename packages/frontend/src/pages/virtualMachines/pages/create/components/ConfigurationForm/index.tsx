import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Spinner from "@/components/Spinner";
import { PAGES } from "@/router/constants";
import { addNotification } from "@/store/notification";
import trpc from "@/utils/api";
import { useAppDispatch } from "@/utils/redux";
import { nanoid } from "@reduxjs/toolkit";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const ConfiguraionForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<boolean | undefined>(undefined);
  const [instanceId, setInstanceId] = useState("");
  const [instanceName, setInstanceName] = useState("");
  const [instanceType, setInstanceType] = useState("jupiter_hub");

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const handleClick = async () => {
    try {
      setLoading(true);
      const res = await trpc.vm.createInstance.mutate({
        instanceName,
        instanceType,
      });

      console.log("Инстанс успешно создан", res);
      setInstanceId(res.instanceId);
      setSuccess(true);

      // Далее тут редирект на страницу инстанса
      navigate(`${PAGES.VIRTUAL_MACHINES.path}/${res.instanceId}`);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);

        dispatch(
          addNotification({
            id: nanoid(),
            title: "Ошибка при создании инстанса",
            description: err.message,
            type: "failure",
          })
        );
      } else {
        setError("Ошибка при содании инстанса");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 flex">
      <div className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">Имя виртуальной машины</label>
          <Input
            value={instanceName}
            className="border p-4"
            placeholder="Ubuntu-01"
            onChange={(e) => setInstanceName(e.target.value)}
          />
        </div>
        {/* <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">Название образа Docker</label>
          <Input
            value={dockerImage}
            className="border p-4"
            placeholder="ubuntu:20.04"
            onChange={(e) => setDockerImage(e.target.value)}
          />
        </div> */}
        <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">Категория виртуальной машины</label>
          <Select
            className="border p-4 rounded-xl"
            dropdownClassName="min-w-full mt-4"
            options={[
              <div className="p-2 cursor-pointer" key="1">
                Jupiter Hub
              </div>,
            ]}
          >
            <div
              className="flex justify-between items-center"
              onClick={() => setInstanceType("jupiter_hub")}
            >
              <div>Jupiter Hub</div>
              <IoIosArrowDown size={20} />
            </div>
          </Select>
        </div>
        {/* <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">Размер диска</label>
          <div className="flex gap-2">
            <Button className="text-black rounded-xl bg-gray-200 px-6">
              -
            </Button>
            <Input className="border p-4 w-32 " />
            <Button className="text-black rounded-xl bg-gray-200 px-6">
              +
            </Button>
          </div>
        </div> */}
        <div className="flex gap-2">
          <Button
            variant="filled"
            size="large"
            className="p-4 text-md flex items-center gap-2 rounded-2xl"
            onClick={handleClick}
          >
            {loading ? (
              <Spinner className="h-6 w-6 text-gray-500" />
            ) : (
              "Создать инстанс"
            )}
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="filled"
            size="large"
            className="p-4 text-md flex items-center gap-2 rounded-2xl bg-gray-200"
          >
            Отменить
          </Button>
          {error}
          {success ? (
            <div>Успешно создан новый инстанс c id {instanceId} </div>
          ) : null}
        </div>
      </div>
      {/* <div className="flex flex-1 justify-end">
        <Card className="flex border h-min min-w-[400px] flex-col p-0">
          <h4 className=" text-xl font-semibold p-4">Стоимость конфигурации</h4>
          <div className="bg-indigo-200 w-fit px-4 py-2 rounded-r-full mb-2">
            <span className="text-xl font-bold">983 ₽</span> за 1 месяц
            <IoIosArrowDown
              size={20}
              className="text-gray-500 inline ml-2 fill-black cursor-pointer"
            />
          </div>
          <div className="bg-indigo-200 w-fit px-4 py-2 rounded-r-3xl  text-gray-700">
            <div className="flex justify-between gap-16">
              <span>1 CPU</span> <span>743 ₽</span>
            </div>
            <div className="flex justify-between gap-16">
              <span>1 ГБ RAM</span> <span>200 ₽</span>
            </div>
            <div className="flex justify-between gap-16">
              <span>10 ГБ HDD </span> <span>40 ₽</span>
            </div>
          </div>
          <div className="p-4">
            <a className="text-indigo-500 cursor-pointer">Все тарифы</a>
          </div>
        </Card>
      </div> */}
    </Card>
  );
};

export default ConfiguraionForm;
