import QuotaProgressbar from "./QuotaProgressbar";
import cn from "@/utils/cn";
import { ReactNode } from "react";

type QuotaDiagramProps = {
  idx: keyof typeof COLOR_IDX;
  label: string;
  remainingText: string;
  outOfText: string;
  progress: number;
  Icon: ReactNode;
};

const COLOR_IDX = {
  0: { main: "bg-blue-200", bg: "bg-blue-100" },
  1: { main: "bg-indigo-200", bg: "bg-indigo-100" },
  2: { main: "bg-violet-200", bg: "bg-violet-100" },
  3: { main: "bg-purple-200", bg: "bg-purple-100" },
  4: { main: "bg-fuchsia-200", bg: "bg-fuchsia-100" },
} as const;

const QuotaDiagram = ({
  idx,
  label,
  remainingText,
  outOfText,
  progress,
  Icon,
}: QuotaDiagramProps) => {
  return (
    <section className="bg-white rounded-2xl p-1 flex-1 flex flex-col min-w-[160px] gap-0.5">
      <div
        className={cn("rounded-2xl flex justify-between", COLOR_IDX[idx]?.bg)}
      >
        <div
          className={cn(
            "p-4 rounded-2xl aspect-square w-20 h-20",
            COLOR_IDX[idx]?.main
          )}
        >
          {Icon}
        </div>
        <div className="flex flex-col items-end">
          <div className="flex flex-col items-end justify-end px-4 py-2 ">
            <p className="xl:text-lg font-semibold">{remainingText}</p>
            <p className="text-gray-500 text-xs">{outOfText}</p>
          </div>

          <h6 className="bg-white px-4 rounded-tl-2xl text-sm flex justify-end w-min">
            {label}
          </h6>
        </div>
      </div>

      <div className="flex justify-end font-medium"></div>

      <QuotaProgressbar progress={progress} />
    </section>
  );
};

export default QuotaDiagram;
