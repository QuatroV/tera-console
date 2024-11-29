import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { InstanceProperties } from "../../../types";

const columns: ColumnDef<[string, string]>[] = [
  {
    header: "Характеристика",
    cell: ({ row }) => row.original[0],
  },
  {
    header: "Значение",
    cell: ({ row }) => row.original[1],
  },
];

type TableProps = {
  properties: InstanceProperties;
};

const Table = (props: TableProps) => {
  const table = useReactTable({
    columns,
    data: Object.entries(props.properties),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full flex flex-col">
      <div className="flex">
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

      {/* Строки таблицы */}
      <div className="flex flex-col">
        {table.getRowModel().rows.map((row) => (
          <div
            className="flex w-full p-4 hover:bg-gray-50 rounded-2xl"
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
