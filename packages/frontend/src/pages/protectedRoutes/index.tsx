import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/utils/redux";
import AuthWaitLoaderScreen from "./components/AuthWaitLoaderScreen";

const ProtectedRoutes = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.authenticated);
  const isWaitingForAuth = useAppSelector((state) => state.auth.waitForAuth);

  if (isWaitingForAuth) {
    return <AuthWaitLoaderScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/welcome" />;
};

export default ProtectedRoutes;
