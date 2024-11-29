import Card from "@/components/Card";

const ProjectSettingsTabs = () => {
  return (
    <div className="flex gap-2 bg-gray-200 p-2 rounded-xl w-min">
      <Card className="cursor-pointer font-semibold p-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Общая информация
      </Card>
      <Card className="bg-transparent cursor-pointer font-semibold p-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Квоты
      </Card>
      <Card className="bg-transparent cursor-pointer font-semibold p-4 hover:bg-gray-300 active:shadow-inner transition-all whitespace-pre">
        Цены
      </Card>
    </div>
  );
};

export default ProjectSettingsTabs;
