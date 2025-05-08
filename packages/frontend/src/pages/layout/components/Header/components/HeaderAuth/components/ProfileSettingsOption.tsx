import DropdownOption from "@/components/Select/components/DropdownOption";
import { PAGES } from "@/router/constants";
import { FaUserGear } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const ProfileSettingsOption = () => {
  const navigate = useNavigate();
  return (
    <DropdownOption
      onClick={() => navigate(PAGES.USER.path)}
      className="flex items-center gap-2 "
    >
      <FaUserGear size={20} className="shrink-0" />
      Настройки профиля
    </DropdownOption>
  );
};

export default ProfileSettingsOption;
