import Card from "@/components/Card";
import { BucketPageTab } from "../BucketPage";
import cn from "@/utils/cn";

type S3TabsProps = {
  tab: BucketPageTab;
  setTab: (tab: BucketPageTab) => void;
};

const S3Tabs = ({ tab, setTab }: S3TabsProps) => {
  return (
    <div className="flex gap-2 bg-gray-200 p-2 rounded-xl w-min mb-2">
      <div
        className={cn(
          "cursor-pointer font-semibold px-4 py-2 rounded-xl hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre",
          tab === "files" && "bg-white"
        )}
        onClick={() => setTab("files")}
      >
        Объекты
      </div>
      <div
        className={cn(
          "cursor-pointer font-semibold px-4 py-2 rounded-xl hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre",
          tab === "settings" && "bg-white"
        )}
        onClick={() => setTab("settings")}
      >
        Настройки
      </div>
      {/* <Card
        className={
          "bg-transparent cursor-pointer font-semibold px-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre"
        }
      >
        Мониторинг
      </Card> */}
    </div>
  );
};

export default S3Tabs;
