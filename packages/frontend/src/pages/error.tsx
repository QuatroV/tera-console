import Button from "@/components/Button";
import Logo from "@/components/Logo";
import { PAGES } from "@/router/constants";
import { FaRegSadCry } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen bg-gradient-to-b from-gray-100 to-gray-200 font-rubik flex flex-col">
      <header className="p-4 justify-center flex w-full">
        <Logo variant="main" />
      </header>
      <main className="flex justify-center items-center flex-1">
        <div className="p-4 bg-white w-fit rounded-xl md:ml-4 shadow">
          <div className="p-4 bg-indigo-200 w-min rounded-2xl">
            <FaRegSadCry size={64} className="fill-gray-700" />
          </div>
          <h1 className="font-dela my-2 text-2xl">Произошла ошибка!</h1>
          <p className="max-w-sm mb-2">
            Ну и ну! Похоже, что-то пошло не так. Стоит вернуться назад и
            попробовать по-другому
          </p>
          <div className="flex justify-end">
            <Button
              variant="filled"
              size="large"
              onClick={() => navigate(PAGES.WELCOME.path)}
            >
              Вернуться на главную страницу
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Error;
