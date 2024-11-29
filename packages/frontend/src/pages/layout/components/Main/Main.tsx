import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <main className="flex justify-center w-full px-2">
      <div className="max-w-7xl w-full flex flex-col gap-4">
        <Outlet />
      </div>
    </main>
  );
};

export default Main;
