import DropdownOption from "@/components/Select/components/DropdownOption";
import { FaUserGear } from "react-icons/fa6";

const ProfileSettingsOption = () => {
  return (
    <DropdownOption className="flex items-center gap-2 ">
      <FaUserGear size={20} className="shrink-0" />
      Настройки профиля
    </DropdownOption>
  );
};

export default ProfileSettingsOption;
