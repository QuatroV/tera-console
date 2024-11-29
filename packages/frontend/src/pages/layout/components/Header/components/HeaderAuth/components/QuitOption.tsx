import DropdownOption from "@/components/Select/components/DropdownOption";
import { logout } from "@/store/auth";
import trpc from "@/utils/api";
import { useAppDispatch } from "@/utils/redux";
import { FiLogOut } from "react-icons/fi";

const QuitOption = () => {
  const dispatch = useAppDispatch();
  const handleLogOut = async () => {
    await trpc.auth.logout.mutate();
    dispatch(logout());
  };

  return (
    <DropdownOption
      className="flex items-center gap-2 text-red-500"
      onClick={handleLogOut}
    >
      <FiLogOut size={20} />
      Выйти
    </DropdownOption>
  );
};

export default QuitOption;
