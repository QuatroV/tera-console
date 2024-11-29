import Card from "@/components/Card";
import ProjectSettingsTabs from "./components/ProjectSettingsTabs";
import Input from "@/components/Input";
import Button from "@/components/Button";

const ProjectSettings = () => {
  return (
    <div className="flex flex-col gap-2">
      <ProjectSettingsTabs />
      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col w-96 gap-2">
          <label className="font-semibold">Название проекта</label>
          <Input className="border p-4" />
        </div>
        <div>
          <Button
            variant="filled"
            size="large"
            className="p-4 text-md flex items-center gap-2 rounded-2xl"
          >
            Сохранить изменения
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProjectSettings;
