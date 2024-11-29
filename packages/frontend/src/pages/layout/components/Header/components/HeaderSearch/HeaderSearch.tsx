import { PAGES } from "@/router/constants";
import IconButton from "@components/IconButton";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const HeaderSearch = () => {
  const navigate = useNavigate();
  return (
    <IconButton onClick={() => navigate(PAGES.SEARCH.path)}>
      <FiSearch size={20} />
    </IconButton>
  );
};

export default HeaderSearch;
