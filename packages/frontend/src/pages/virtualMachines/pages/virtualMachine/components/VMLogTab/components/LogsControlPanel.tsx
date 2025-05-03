import Button from "@/components/Button";
import Input from "@/components/Input";
import { FiCopy } from "react-icons/fi";

type LogControlPanelProps = {
  searchPhrase: string;
  onChangeSearch: (phrase: string) => void;
  hasMatches: boolean;
  matchCount: number;
  activeMatch: number;
  onPrevMatchClick: () => void;
  onNextMatchClick: () => void;
  onCopyAllClick: () => void;
};

const LogControlPanel = ({
  searchPhrase,
  onChangeSearch,
  hasMatches,
  activeMatch,
  matchCount,
  onPrevMatchClick,
  onNextMatchClick,
  onCopyAllClick,
}: LogControlPanelProps) => {
  return (
    <div className="flex w-full sticky top-2 rounded-2xl bg-gray-200 p-2">
      <Input
        value={searchPhrase}
        className="text-sm"
        onChange={(e) => onChangeSearch(e.target.value)}
        placeholder="Поиск по логам…"
      />
      {hasMatches && (
        <div className="flex items-center gap-1 text-sm ml-2">
          <button
            onClick={onPrevMatchClick}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            ←
          </button>
          <span>
            {activeMatch + 1} / {matchCount}
          </span>
          <button
            onClick={onNextMatchClick}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            →
          </button>
        </div>
      )}
      <Button
        onClick={onCopyAllClick}
        variant="filled"
        size="large"
        className="ml-auto rounded-xl flex items-center gap-2 text-sm"
      >
        <FiCopy /> Копировать всё
      </Button>
    </div>
  );
};

export default LogControlPanel;
