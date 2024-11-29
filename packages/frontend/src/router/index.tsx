import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { PAGES_ROUTES } from "./constants";

const router = createBrowserRouter(PAGES_ROUTES);

const Router = () => <RouterProvider router={router} />;

export default Router;
