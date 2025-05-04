import Card from "@/components/Card";

const S3Tabs = () => {
  return (
    <div className="flex gap-2 bg-gray-200 p-2 rounded-xl w-min mb-2">
      <Card className="cursor-pointer font-semibold px-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Объекты
      </Card>
      <Card className="bg-transparent cursor-pointer font-semibold px-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Настройки
      </Card>
      <Card className="bg-transparent cursor-pointer font-semibold px-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Мониторинг
      </Card>
    </div>
  );
};

export default S3Tabs;
