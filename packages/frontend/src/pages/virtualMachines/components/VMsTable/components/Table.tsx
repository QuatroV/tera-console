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

const columns: ColumnDef<InstanceInfo>[] = [
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
      <a href={row.original.link} target="_blank" rel="noopener noreferrer">
        {row.original.link}
      </a>
    ),
  },
];

type TableProps = {
  instances: InstanceInfo[];
};

const Table = ({ instances }: TableProps) => {
  const navigate = useNavigate();

  const table = useReactTable({
    columns,
    data: instances,
    getCoreRowModel: getCoreRowModel(),
  });

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
