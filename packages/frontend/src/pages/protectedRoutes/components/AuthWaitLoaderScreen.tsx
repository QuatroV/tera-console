import Spinner from "@/components/Spinner";

const AuthWaitLoaderScreen = () => {
  return (
    <div className="bg-white rounded-2xl w-fit flex ">
      <div className="bg-indigo-200 rounded-2xl p-2 w-fit">
        <Spinner className="w-24 h-24 text-gray-500" />
      </div>
      <div className="flex flex-col items-end justify-end p-4">
        <h2 className="font-bold">Идет авторизация пользователя...</h2>
        <p className="text-xs">Пожалуйста, подождите</p>
      </div>
    </div>
  );
};

export default AuthWaitLoaderScreen;
