import NavigationRail from "@/components/NavigationRail";
import NavItem from "@/components/NavigationRail/components/NavItem";
import NavigationRailGroup from "@/components/NavigationRail/components/NavigationItemGroup/NavigationItemGroup";
import { useAppSelector } from "@/utils/redux";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getSidebarItems } from "./getSidebarItems";
import ExpandableNavItem from "@/components/NavigationRail/components/ExpandableNavItem";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true);

  const navigate = useNavigate();
  const currentPage = useLocation();

  const isAuthenticated = useAppSelector((state) => state.auth.authenticated);

  if (!isAuthenticated) return null;

  return (
    <aside className="p-2">
      <NavigationRail
        collapsed={collapsed}
        onCollapse={() => setCollapsed((state) => !state)}
      >
        <NavigationRailGroup align="top" className="flex flex-col gap-1">
          {getSidebarItems()
            .filter((page) => (page.protected ? isAuthenticated : true))
            .map((page) =>
              page.children ? (
                <ExpandableNavItem
                  onClick={() => navigate(page.path)}
                  key={page.name}
                  collapsed={collapsed}
                  active={
                    currentPage.pathname === page.path ||
                    page.children.some(
                      (child) => child.path === currentPage.pathname
                    )
                  }
                  label={page.label}
                  Icon={<page.Icon size={24} className="text-gray-500" />}
                  options={page.children.map((child) => (
                    <NavItem
                      onClick={() => navigate(child.path)}
                      key={child.name}
                      collapsed={collapsed}
                      active={currentPage.pathname === child.path}
                      label={child.label}
                    />
                  ))}
                />
              ) : (
                <NavItem
                  onClick={() => navigate(page.path)}
                  key={page.name}
                  collapsed={collapsed}
                  active={currentPage.pathname === page.path}
                  label={page.label}
                  Icon={<page.Icon size={24} className="text-gray-500" />}
                />
              )
            )}
        </NavigationRailGroup>
      </NavigationRail>
    </aside>
  );
};

export default Sidebar;
