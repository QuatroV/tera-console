import Button from "@/components/Button";
import { FaDocker } from "react-icons/fa6";

const Notification = () => {
  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
      <div className="p-4">
        <FaDocker size={48} className="fill-gray-700" />
      </div>
      <div className="pr-2">
        <div className="flex justify-between">
          <h3 className="font-bold text-gray-700 mb-2">Уведомление 1</h3>
          <p className="text-sm text-gray-500 italic">01 сентября 2022 16:14</p>
        </div>
        <p className="text-gray-500 text-sm mb-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo
          doloribus fuga in rem ullam autem. Velit pariatur perspiciatis rem
          magnam similique. Exercitationem enim magnam non cupiditate fuga
          placeat! Explicabo, assumenda. Lorem ipsum dolor sit amet, consectetur
          adipisicing elit. Aspernatur esse cupiditate earum ipsam! Magnam
          pariatur labore nisi quod nemo voluptatem fugit delectus dolorem. Eum
          nesciunt sunt, recusandae tenetur iure temporibus? Lorem ipsum dolor
          sit amet consectetur adipisicing elit. Laudantium veniam suscipit
          officiis explicabo aut delectus voluptatibus error corrupti
          asperiores, nulla deserunt dicta sint rerum amet architecto velit
          ducimus similique hic!
        </p>
        <Button size="large" variant="filled" className="bg-gray-200">
          Подробнее
        </Button>
      </div>
    </div>
  );
};

export default Notification;
