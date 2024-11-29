import Modal from "@/components/Modal";
import { useAppDispatch, useAppSelector } from "@/utils/redux";
import { closeAuthModal } from "@/store/auth";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import { FaUserPlus } from "react-icons/fa6";
import { PiSignInBold } from "react-icons/pi";
import { MdRestore } from "react-icons/md";
import RestorePasswordForm from "./components/RestorePasswordForm";

const TITLES = {
  login: (
    <div className="flex gap-4 items-center font-dela">
      <PiSignInBold size={32} />
      Войти в аккаунт
    </div>
  ),
  register: (
    <div className="flex gap-4 items-center font-dela">
      <FaUserPlus size={32} />
      Зарегистрироваться
    </div>
  ),
  restorePassword: (
    <div className="flex gap-4 items-center font-dela">
      <MdRestore size={32} />
      Восстановить пароль
    </div>
  ),
} as const;

const AuthModal = () => {
  const authModalPage = useAppSelector((state) => state.auth.authModalPage);

  const dispatch = useAppDispatch();

  const modalOpen = authModalPage !== null;

  return (
    <Modal
      title={modalOpen ? TITLES[authModalPage] : undefined}
      closable
      open={modalOpen}
      onClose={() => dispatch(closeAuthModal())}
    >
      {authModalPage === "login" && <LoginForm />}
      {authModalPage === "register" && <RegisterForm />}
      {authModalPage === "restorePassword" && <RestorePasswordForm />}
    </Modal>
  );
};

export default AuthModal;
