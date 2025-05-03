import { PAGES } from "@/router/constants";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import NoInstances from "./NoInstances";
import { InstanceInfo } from "../types";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import InstanceStatusMarker from "../../InstanceStatusMarker";
import Spinner from "@/components/Spinner";
import { MdSort } from "react-icons/md";

/* ---------- описание колонок ---------- */
const columns: ColumnDef<InstanceInfo>[] = [
  {
    header: "Статус",
    accessorKey: "status",
    cell: ({ row }) => (
      <InstanceStatusMarker instanceStatus={row.original.status} />
    ),
    enableSorting: true,
  },
  {
    header: "Имя инстанса",
    accessorKey: "name",
    enableSorting: true,
  },
  {
    header: "Тип",
    accessorKey: "instanceType",
    enableSorting: true,
  },
  {
    header: "Ссылка",
    accessorKey: "link",
    enableSorting: false,
    cell: ({ row }) => (
      <a
        href={row.original.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline overflow-hidden text-ellipsis line-clamp-1 break-words"
        onClick={(e) => e.stopPropagation()} // не даём всплыть
      >
        {row.original.link}
      </a>
    ),
  },
];

type TableProps = {
  loading: boolean;
  instances: InstanceInfo[];
};

const Table = ({ instances, loading }: TableProps) => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data: instances,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 p-8">
        <Spinner className="size-16 text-gray-400" />
        <div className="text-gray-400">Загрузка данных</div>
      </div>
    );
  }

  if (!instances.length) return <NoInstances />;

  return (
    <div className="w-full flex flex-col">
      <div className="flex">
        {table.getHeaderGroups().map((hg) => (
          <div key={hg.id} className="flex w-full rounded-2xl bg-gray-200 px-4">
            {hg.headers.map((header) => {
              const sorted = header.column.getIsSorted();
              return (
                <div
                  key={header.id}
                  className="flex-1 font-semibold py-4 cursor-pointer select-none flex items-center gap-1"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {sorted === "asc" && (
                    <MdSort className="rotate-180 scale-x-[-1]" />
                  )}
                  {sorted === "desc" && <MdSort />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="flex w-full p-4 hover:bg-gray-50 rounded-2xl cursor-pointer"
            onClick={() =>
              navigate(`${PAGES.VIRTUAL_MACHINES.path}/${row.original.id}`)
            }
          >
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id} className="flex-1">
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
