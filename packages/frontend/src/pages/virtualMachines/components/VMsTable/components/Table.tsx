import { PAGES } from "@/router/constants";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NoInstances from "./NoInstances";
import { InstanceInfo } from "../types";
import { useNavigate } from "react-router-dom";
import InstanceStatusMarker from "../../InstanceStatusMarker";
import Spinner from "@/components/Spinner";

const columns: ColumnDef<InstanceInfo>[] = [
  {
    header: "Статус",
    accessorKey: "status",
    cell: ({ row }) => (
      <InstanceStatusMarker instanceStatus={row.original.status} />
    ),
  },
  {
    header: "Имя инстанса",
    accessorKey: "name",
  },
  {
    header: "Тип",
    accessorKey: "instanceType",
  },
  {
    header: "Ссылка",
    accessorKey: "link",
    cell: ({ row }) => (
      <a
        href={row.original.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline overflow-hidden text-ellipsis line-clamp-1 break-words"
        /** ← главное: не даём клику всплыть на div-строку */
        onClick={(e) => e.stopPropagation()}
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

  const table = useReactTable({
    columns,
    data: instances,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-2 p-8">
        <Spinner className="size-16 text-gray-400" />
        <div className="text-gray-400">Загрузка данных</div>
      </div>
    );
  }

  if (!instances.length) {
    return <NoInstances />;
  }

  return (
    <div className="w-full flex flex-col">
      <div className="flex ">
        {table.getHeaderGroups().map((headerGroup) => (
          <div
            className="flex w-full rounded-2xl bg-gray-200 px-4"
            key={headerGroup.id}
          >
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
      <div className="flex flex-col">
        {table.getRowModel().rows.map((row) => (
          <div
            className="flex w-full p-4 hover:bg-gray-50 rounded-2xl cursor-pointer"
            key={row.id}
            onClick={() =>
              navigate(`${PAGES.VIRTUAL_MACHINES.path}/${row.original.id}`)
            }
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
