import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Spinner from "@/components/Spinner";
import {
  RiDeleteBin6Line,
  RiEyeLine,
  RiShareForwardLine,
  RiFolderFill,
  RiFile3Fill,
} from "react-icons/ri";
import { IoDownload } from "react-icons/io5";

export interface RowFile {
  Key: string;
  StorageClass: string;
  LastModified: string;
  Size: string;
  IsDir: boolean;
}

type TableRow = RowFile & { Name: string };

type Props = {
  files: RowFile[];
  isLoading: boolean;
  onDirClick: (dirKey: string) => void;
  onFileClick: (fileKey: string) => void;
  onDownload: (key: string) => void;
  onPreview: (key: string) => void;
  onDelete: (key: string) => void;
  onShare: (key: string) => void;
};

const getPrefix = () =>
  new URLSearchParams(window.location.search).get("key") ?? "";

function formatBytes(bytes: number): string {
  console.log(bytes);
  if (bytes === 0) return "0 Б";
  const sizes = ["Б", "КБ", "МБ", "ГБ", "ТБ"];
  const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${sizes[i]}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function Table({
  files,
  isLoading,
  onDirClick,
  onFileClick,
  onDownload,
  onPreview,
  onDelete,
  onShare,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);

  // 1) готовим строки + пункт “..”
  const prefix = getPrefix();
  const rows: TableRow[] = useMemo(() => {
    const tail = files.map((f) => ({
      ...f,
      Name: f.Key.slice(prefix.length),
    }));
    if (prefix) {
      const up = prefix.split("/").filter(Boolean).slice(0, -1).join("/");
      tail.unshift({
        Key: up ? up + "/" : "",
        IsDir: true,
        Name: "..",
        LastModified: "",
        Size: "",
        StorageClass: "",
      });
    }
    return tail;
  }, [files, prefix]);

  // 2) колонки
  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        header: "Имя",
        accessorKey: "Name",
        sortingFn: "alphanumeric",
        cell: ({ row }) => (
          <span
            className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
            onClick={() =>
              row.original.IsDir
                ? onDirClick(row.original.Key)
                : onFileClick(row.original.Key)
            }
          >
            {row.original.IsDir ? <RiFolderFill /> : <RiFile3Fill />}
            {row.original.Name}
          </span>
        ),
      },
      {
        header: "Размер",
        accessorKey: "Size",
        cell: ({ row }) =>
          row.original.IsDir || row.original.Size === "-"
            ? "-"
            : formatBytes(Number(row.original.Size)),
      },
      {
        header: "Класс хранения",
        accessorKey: "StorageClass",
      },
      {
        header: "Изменён",
        accessorKey: "LastModified",
        cell: ({ row }) =>
          row.original.IsDir || !row.original.LastModified
            ? "-"
            : formatDate(row.original.LastModified),
      },
      {
        id: "actions",
        header: "Действия",
        cell: ({ row }) =>
          row.original.Name === ".." || row.original.IsDir ? null : (
            <div className="flex gap-3 justify-end text-gray-600">
              <IoDownload
                title="Загрузить"
                className="cursor-pointer hover:text-indigo-600"
                onClick={() => onDownload(row.original.Key)}
              />
              <RiEyeLine
                title="Предпросмотр"
                className="cursor-pointer hover:text-indigo-600"
                onClick={() => onPreview(row.original.Key)}
              />
              <RiShareForwardLine
                title="Поделиться"
                className="cursor-pointer hover:text-indigo-600"
                onClick={() => onShare(row.original.Key)}
              />
              <RiDeleteBin6Line
                title="Удалить"
                className="cursor-pointer hover:text-red-600"
                onClick={() => onDelete(row.original.Key)}
              />
            </div>
          ),
      },
    ],
    [onDirClick, onFileClick, onPreview, onShare, onDelete]
  );

  // 3) создаём table instance
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // 4) рендер
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Spinner className="text-indigo-500" /> Загрузка…
      </div>
    );
  }
  if (!rows.length) {
    return <div className="p-6 text-gray-400">Нет объектов</div>;
  }

  return (
    <div className="flex flex-col gap-1">
      {table.getHeaderGroups().map((hg) => (
        <div
          key={hg.id}
          className="flex bg-gray-200 rounded-xl p-3 select-none"
        >
          {hg.headers.map((h) => {
            const dir =
              h.column.getIsSorted() === "asc"
                ? "▲"
                : h.column.getIsSorted() === "desc"
                ? "▼"
                : "";
            return (
              <div
                key={h.id}
                className={`${
                  h.column.id === "actions" ? "w-32" : "flex-1"
                } font-semibold cursor-pointer`}
                onClick={h.column.getToggleSortingHandler()}
              >
                {flexRender(h.column.columnDef.header, h.getContext())} {dir}
              </div>
            );
          })}
        </div>
      ))}
      {table.getRowModel().rows.map((r) => (
        <div
          key={r.id}
          className="flex items-center px-4 py-2 hover:bg-gray-50 rounded-xl"
        >
          {r.getVisibleCells().map((cell) => (
            <div
              key={cell.id}
              className={cell.column.id === "actions" ? "w-32" : "flex-1"}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
