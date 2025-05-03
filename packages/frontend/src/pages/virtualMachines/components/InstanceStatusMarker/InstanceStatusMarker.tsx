type InstanceStatusMarkerProps = {
  instanceStatus?: string;
};

const InstanceStatusMarker = ({
  instanceStatus,
}: InstanceStatusMarkerProps) => {
  if (instanceStatus === "RUNNING")
    return (
      <div className="text-xs font-rubik uppercase inline bg-emerald-100 px-2 rounded-full border-emerald-500 border">
        Работает
      </div>
    );
  if (instanceStatus === "CREATING") {
    return (
      <div className="text-xs font-rubik uppercase inline bg-gray-100 px-2 rounded-full border-gray-500 border">
        Создается
      </div>
    );
  }
  if (instanceStatus === "STOPPED") {
    return (
      <div className="text-xs font-rubik uppercase inline bg-yellow-100 px-2 rounded-full border-yellow-500 border">
        Приостановлен
      </div>
    );
  }
  if (instanceStatus === "ERROR") {
    return (
      <div className="text-xs font-rubik uppercase inline bg-red-100 px-2 rounded-full border-red-500 border">
        Ошибка
      </div>
    );
  }

  return null;
};

export default InstanceStatusMarker;
