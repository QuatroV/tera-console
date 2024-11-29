import Card from "@/components/Card";
import Notification from "./components/Notification";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const navigate = useNavigate();
  return (
    <div className="">
      <div className="flex gap-2 items-center mb-2">
        <IoChevronBack
          size={24}
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <h1 className="font-dela text-2xl mb-2">Уведомления</h1>
      </div>

      <Card>
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
        <Notification />
      </Card>
    </div>
  );
};

export default Notifications;
