import Button from "@/components/Button";
import Input from "@/components/Input";
import { BiFolderPlus, BiUpload } from "react-icons/bi";
import { IoClose, IoSearch } from "react-icons/io5";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

type Props = {
  prefix: string;
  onCreateFolder: () => void;
  onUpload: (f: File) => void;
};

export default function TableHeader({
  prefix,
  onCreateFolder,
  onUpload,
}: Props) {
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { id: bucket } = useParams<{ id: string }>();

  const handleFileClick = () => inputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(onUpload);
    e.target.value = "";
  };

  return (
    <div className="mb-2 flex justify-between items-center gap-2">
      <div className="pl-2 font-medium flex-1 border p-2 rounded-xl">
        <span className="bg-gray-100 rounded-xl px-2 py-1">Путь:</span>{" "}
        <span className="text-sm">/{prefix}</span>
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative">
          <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Поиск…"
            className="p-2 pl-8 pr-3 border w-full"
          />
          {term && (
            <IoClose
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setTerm("")}
            />
          )}
        </div>
        <Button
          variant="outlined"
          size="large"
          className="flex items-center rounded-xl gap-1"
          onClick={onCreateFolder}
        >
          <BiFolderPlus /> Новая папка
        </Button>

        <input
          type="file"
          ref={inputRef}
          className="hidden"
          multiple
          // @ts-expect-error fix me later
          webkitdirectory="true"
          onChange={onFileChange}
        />
        <Button
          variant="filled"
          size="large"
          className="flex items-center rounded-xl gap-1"
          onClick={handleFileClick}
        >
          <BiUpload /> Загрузить
        </Button>
      </div>
    </div>
  );
}
