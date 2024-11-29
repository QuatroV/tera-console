import Logo from "@/components/Logo";
import HeaderAuth from "./components/HeaderAuth";
import HeaderNotifications from "./components/HeaderNotifications";
import HeaderSearch from "./components/HeaderSearch";
import { useAppSelector } from "@/utils/redux";
import HeaderProject from "./components/HeaderProjects";
import { useLocation } from "react-router-dom";
import { PAGES } from "@/router/constants";
import HeaderSearchInput from "./components/HeaderSearchInput";

const Header = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.authenticated);

  const user = useAppSelector((state) => state.auth.user);

  const currentPage = useLocation();

  const isSearchPage = currentPage.pathname === PAGES.SEARCH.path;

  return (
    <div className="py-2 flex items-center justify-between min-h-[76px] mr-2 mb-2">
      <HeaderProject isAuthenticated={isAuthenticated} />
      {isSearchPage ? <HeaderSearchInput /> : <Logo variant="main" />}
      <div className="flex gap-3 items-center">
        {isAuthenticated && !isSearchPage && (
          <div>
            <HeaderSearch />
            <HeaderNotifications />
          </div>
        )}

        <HeaderAuth
          isAuthenticated={isAuthenticated}
          name={user?.name}
          surname=""
          email={user?.email}
        />
      </div>
    </div>
  );
};

export default Header;
