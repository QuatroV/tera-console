import Card from "@/components/Card";
import { VMTab } from "../../types";

type VMTabsProps = {
  tab: VMTab;
  setTab: (tab: VMTab) => void;
};

const TABS: { label: string; value: VMTab }[] = [
  { label: "Общая информация", value: "main" },
  { label: "Мониторинг", value: "monitoring" },
  { label: "Консоль", value: "console" },
  { label: "Логи", value: "logs" },
];

const VMTabs = ({ tab, setTab }: VMTabsProps) => {
  return (
    <div className="flex gap-2 bg-gray-200 p-2 rounded-xl w-min">
      {TABS.map(({ label, value }) => (
        <Card
          key={value}
          onClick={() => setTab(value)}
          className={`cursor-pointer font-semibold px-4 transition-all whitespace-pre ${
            tab === value
              ? "bg-white shadow-md"
              : "bg-transparent hover:bg-gray-300 active:shadow-inner"
          }`}
        >
          {label}
        </Card>
      ))}
    </div>
  );
};

export default VMTabs;
