import Button from "@/components/Button";
import Select from "@/components/Select";
import { openLoginModal, openRegisterModal } from "@/store/auth";
import cn from "@/utils/cn";
import { useAppDispatch } from "@/utils/redux";
import Avatar from "@components/Avatar/Avatar";
import QuitOption from "./components/QuitOption";
import { IoIosArrowDown } from "react-icons/io";
import ProfileSettingsOption from "./components/ProfileSettingsOption";
import { FiLogIn } from "react-icons/fi";

type HeaderAuthProps = {
  className?: string;
  src?: string;
  isAuthenticated: boolean;
  email?: string;
  name?: string;
  surname?: string;
};

const HeaderAuth = ({
  className,
  name,
  surname,
  email,
  src,
  isAuthenticated,
}: HeaderAuthProps) => {
  const dispatch = useAppDispatch();

  const handleOpenLoginModal = () => {
    dispatch(openLoginModal());
  };

  const handleOpenRegisterModal = () => {
    dispatch(openRegisterModal());
  };

  if (!isAuthenticated)
    return (
      <div className="flex gap-2 w-[100px] md:w-[300px] justify-end">
        <Button onClick={handleOpenLoginModal} color="black" size="large">
          <span className="hidden md:block">Войти</span>{" "}
          <FiLogIn className="md:hidden h-6 w-6" />
        </Button>
        <Button
          onClick={handleOpenRegisterModal}
          variant="filled"
          color="primary"
          size="large"
          className="hidden md:block"
        >
          Зарегистрироваться
        </Button>
      </div>
    );

  return (
    <Select
      className="z-10 w-[100px] md:w-[300px]"
      dropdownClassName="min-w-full"
      options={[
        <ProfileSettingsOption key="profile-settings" />,
        <hr key="hr-1" className="my-2" />,
        <QuitOption key="quit" />,
      ]}
    >
      <div
        className={cn(
          "flex gap-2 rounded-xl py-2 px-3 items-center bg-white  hover:shadow active:translate-y-0.5 cursor-pointer transition-all",
          className
        )}
      >
        <Avatar src={src} />
        <div className="hidden md:block">
          <p className="font-semibold">
            {name} {surname}
          </p>
          <p className="text-sm text-gray-400">{email}</p>
        </div>
        <IoIosArrowDown size={20} className="text-gray-500" />
      </div>
    </Select>
  );
};

export default HeaderAuth;
