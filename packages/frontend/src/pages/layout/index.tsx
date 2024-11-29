import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import useAuth from "./hooks/useAuth";
import NotificationPopupList from "@/components/NotificationPopupList/NotificationPopupList";

const Layout = () => {
  useAuth();

  return (
    <div className="font-rubik selection:bg-indigo-600 selection:text-white">
      <AuthModal />

      <div className="flex h-screen bg-gradient-to-b from-gray-100 to-gray-200 fixed overflow-hidden w-full">
        <Sidebar />
        <div className="flex flex-col w-full overflow-auto pb-4 scrollbar">
          <Header />
          <Main />
          {/* <Footer /> */}
        </div>
      </div>

      <NotificationPopupList />
    </div>
  );
};

export default Layout;
