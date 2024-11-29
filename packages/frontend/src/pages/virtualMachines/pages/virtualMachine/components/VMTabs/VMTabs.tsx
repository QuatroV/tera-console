import Card from "@/components/Card";

const VMTabs = () => {
  return (
    <div className="flex gap-2 bg-gray-200 p-2 rounded-xl w-min">
      <Card className="cursor-pointer font-semibold p-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Общая информация
      </Card>
      <Card className="bg-transparent cursor-pointer font-semibold p-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Мониторинг
      </Card>
      <Card className="bg-transparent cursor-pointer font-semibold p-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Консоль
      </Card>
      <Card className="bg-transparent cursor-pointer font-semibold p-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Логи
      </Card>
    </div>
  );
};

export default VMTabs;
