import Card from "@/components/Card";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center mb-2">
        <IoChevronBack
          size={24}
          onClick={() => navigate(-1)}
          className="cursor-pointer"
        />
        <h1 className="font-dela text-2xl mb-2">Поиск</h1>
      </div>
      <Card className="">Результаты поиска</Card>
    </div>
  );
};

export default Search;
