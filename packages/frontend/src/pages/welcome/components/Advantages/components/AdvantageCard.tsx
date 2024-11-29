import Card from "@/components/Card";

type AdvantageCardProps = {
  children: React.ReactNode;
};

const AdvantageCard = ({ children }: AdvantageCardProps) => {
  return (
    <li className="h-full">
      <Card className=" flex flex-col items-between justify-between p-2 gap-2 h-full">
        {children}
      </Card>
    </li>
  );
};

export default AdvantageCard;
