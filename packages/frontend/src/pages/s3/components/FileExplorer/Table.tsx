import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Типы данных для файлов
interface S3File {
  name: string;
  size: string;
  storageClass: string;
  lastModified: string;
}

type TableProps = {
  files: S3File[];
};

const columns: ColumnDef<S3File>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        onChange={(e) =>
          table
            .getRowModel()
            .rows.forEach((row) => row.toggleSelected(e.target.checked))
        }
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(e.target.checked)}
      />
    ),
  },
  {
    header: "Имя",
    accessorKey: "name",
    size: 200,
    cell: ({ row }) => (
      <div
        className="text-blue-600 hover:underline cursor-pointer"
        onClick={() => {
          if (row.original.name.endsWith("/")) {
            // Если это директория, добавляем в query параметр key
            const searchParams = new URLSearchParams(window.location.search);
            searchParams.set("key", row.original.name);
            window.history.replaceState(
              null,
              "",
              `?${searchParams.toString()}`
            );
          } else {
            // Если это файл, показываем модальное окно
            alert(`Открыть модальное окно для файла: ${row.original.name}`);
          }
        }}
      >
        {row.original.name}
      </div>
    ),
  },
  {
    header: "Размер",
    accessorKey: "size",
  },
  {
    header: "Класс хранилища",
    accessorKey: "storageClass",
  },
  {
    header: "Последнее изменение",
    accessorKey: "lastModified",
  },
];

const Table: React.FC<TableProps> = ({ files }) => {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const table = useReactTable({
    columns,
    data: files,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection: selectedRows },
    onRowSelectionChange: setSelectedRows,
  });

  if (!files.length) {
    return <div className="text-gray-500">Нет доступных файлов</div>;
  }

  return (
    <div className="w-full flex flex-col">
      {/* Заголовки таблицы */}
      <div className="flex bg-gray-200 rounded-2xl px-4 mb-2 sticky top-2 z-10 ">
        {table.getHeaderGroups().map((headerGroup) => (
          <div className="flex w-full" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <div className="flex-1 font-semibold py-4" key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Содержимое таблицы */}
      <div className="flex flex-col">
        {table.getRowModel().rows.map((row) => (
          <div
            className="flex w-full p-4 hover:bg-gray-50 rounded-2xl cursor-pointer"
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => (
              <div className="flex-1" key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
