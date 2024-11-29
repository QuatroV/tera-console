import { PAGES } from "@/router/constants";
import { IconBaseProps } from "react-icons";
import { FaComputer } from "react-icons/fa6";
import { HiDocumentDuplicate } from "react-icons/hi";
import { IoMdHelpBuoy } from "react-icons/io";
import { MdSpaceDashboard } from "react-icons/md";

export const getSidebarItems = () => [
  {
    name: PAGES.CONSOLE.name,
    path: PAGES.CONSOLE.path,
    label: "Консоль",
    protected: true,
    Icon: (props: IconBaseProps) => <MdSpaceDashboard {...props} />,
  },
  {
    name: PAGES.VIRTUAL_MACHINES.name,
    path: PAGES.VIRTUAL_MACHINES.path,
    label: "ВМ",
    protected: true,
    Icon: (props: IconBaseProps) => <FaComputer {...props} />,
    children: [
      {
        name: PAGES.VIRTUAL_MACHINES.name,
        path: PAGES.VIRTUAL_MACHINES.path,
        label: "Все ВМ",
        protected: true,
      },
      {
        name: PAGES.CREATE_VIRTUAL_MACHINE.name,
        path: PAGES.CREATE_VIRTUAL_MACHINE.path,
        label: "Создать ВМ",
        protected: true,
      },
    ],
  },
  {
    name: "docs",
    path: "/docs",
    label: "Документация",
    protected: true,
    Icon: (props: IconBaseProps) => <HiDocumentDuplicate {...props} />,
    children: [],
  },
  {
    name: "help",
    path: "/help",
    label: "Центр помощи",
    protected: true,
    Icon: (props: IconBaseProps) => <IoMdHelpBuoy {...props} />,
    children: [],
  },
];
