import { SiJupyter } from "react-icons/si";

import Button from "@/components/Button";

type GoToContainerButtonProps = {
  containerLink: string;
};

const GoToContainerButton = (props: GoToContainerButtonProps) => {
  const { containerLink } = props;

  return (
    <a className=" flex" rel="noreferrer" target="_blank" href={containerLink}>
      <Button
        className="rounded-2xl text-sm flex items-center border-orange-300 bg-orange-300 p-0"
        variant="outlined"
      >
        <div className="bg-white h-full rounded-2xl flex items-center px-2">
          <SiJupyter className="size-8 text-orange-400" />
        </div>
        <span className="px-2">Перейти в JupiterHub</span>
      </Button>
    </a>
  );
};

export default GoToContainerButton;
