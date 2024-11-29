import IconButton from "@/components/IconButton";
import { PAGES } from "@/router/constants";
import { AiOutlineNotification } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const HeaderNotifications = () => {
  const navigate = useNavigate();
  return (
    <IconButton onClick={() => navigate(PAGES.NOTIFICATIONS.path)}>
      <AiOutlineNotification size={20} />
    </IconButton>
  );
};

export default HeaderNotifications;
