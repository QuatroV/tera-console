import Card from "@/components/Card";

type ServiceBlockProps = {
  label: string;
  description: string;
  Icon: React.ReactNode;
  onClick?: () => void;
};

const ServiceBlock = ({
  label,
  description,
  Icon,
  onClick,
}: ServiceBlockProps) => {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col items-start cursor-pointer pt-2 flex-1"
    >
      <div className="bg-gray-300 rounded-2xl p-4 group-hover:bg-indigo-200 transition-all w-min translate-y-3 group-hover:translate-y-2 group-hover:shadow-lg ml-4">
        {Icon}
      </div>
      <Card className="bg-white flex-1 rounded-2xl flex flex-col gap-2 items-start p-4 pt-5">
        <div>
          <h4 className="font-semibold mb-1">{label}</h4>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </Card>
    </div>
  );
};

export default ServiceBlock;
