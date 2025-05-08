import Console from "@/pages/console";
import VirtualMachinesCreate from "@/pages/virtualMachines/pages/create";
import Error from "@/pages/error";
import Layout from "@/pages/layout";
import Notifications from "@/pages/notifications";
import ProtectedRoutes from "@/pages/protectedRoutes";
import Search from "@/pages/search";
import VirtualMachines from "@/pages/virtualMachines";
import Welcome from "@/pages/welcome";
import { Navigate, RouteObject } from "react-router-dom";
import Project from "@/pages/project";
import VerifyEmail from "@/pages/verifyEmail";
import VirtualMachine from "@/pages/virtualMachines/pages/virtualMachine";
import S3 from "@/pages/s3";
import BucketPage from "@/pages/s3/pages/bucket/BucketPage";
import UserPage from "@/pages/user";

export const PAGES = {
  WELCOME: {
    name: "welcome",
    path: "/welcome",
  },
  CONSOLE: {
    name: "console",
    path: "/console",
  },
  SEARCH: {
    name: "search",
    path: "/search",
  },
  NOTIFICATIONS: {
    name: "notifications",
    path: "/notifications",
  },
  VIRTUAL_MACHINES: {
    name: "virtual_machines",
    path: "/virtual_machines",
  },
  CREATE_VIRTUAL_MACHINE: {
    name: "create_virtual_machine",
    path: "/virtual_machines/create",
  },
  VIRTUAL_MACHINE: {
    name: "virtual_machine",
    path: "/virtual_machines/:id",
  },
  PROJECT: {
    name: "project",
    path: "/project",
  },
  VERIFY_EMAIL: {
    name: "verify_email",
    path: "/verify_email",
  },
  S3: {
    name: "s3",
    path: "/s3",
  },
  BUCKET: {
    name: "bucket",
    path: "/s3/:id",
  },
  USER: {
    name: "user",
    path: "/user",
  },
} as const;

export const PAGES_ROUTES: RouteObject[] = [
  {
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Navigate to={PAGES.WELCOME.path} replace />,
      },
      {
        element: <ProtectedRoutes />,
        children: [
          {
            id: PAGES.CONSOLE.name,
            path: PAGES.CONSOLE.path,
            element: <Console />,
          },
          {
            id: PAGES.VIRTUAL_MACHINES.name,
            path: PAGES.VIRTUAL_MACHINES.path,
            element: <VirtualMachines />,
          },
          {
            id: PAGES.CREATE_VIRTUAL_MACHINE.name,
            path: PAGES.CREATE_VIRTUAL_MACHINE.path,
            element: <VirtualMachinesCreate />,
          },
          {
            id: PAGES.VIRTUAL_MACHINE.name,
            path: PAGES.VIRTUAL_MACHINE.path,
            element: <VirtualMachine />,
          },
          {
            id: PAGES.PROJECT.name,
            path: PAGES.PROJECT.path,
            element: <Project />,
          },
          {
            id: PAGES.SEARCH.name,
            path: PAGES.SEARCH.path,
            element: <Search />,
          },
          {
            id: PAGES.NOTIFICATIONS.name,
            path: PAGES.NOTIFICATIONS.path,
            element: <Notifications />,
          },
          {
            id: PAGES.S3.name,
            path: PAGES.S3.path,
            element: <S3 />,
          },
          {
            id: PAGES.BUCKET.name,
            path: PAGES.BUCKET.path,
            element: <BucketPage />,
          },
          { id: PAGES.USER.name, path: PAGES.USER.path, element: <UserPage /> },
        ],
      },
      {
        id: PAGES.WELCOME.name,
        path: PAGES.WELCOME.path,
        element: <Welcome />,
      },
      {
        id: PAGES.VERIFY_EMAIL.name,
        path: PAGES.VERIFY_EMAIL.path,
        element: <VerifyEmail />,
      },
    ],
  },
];
