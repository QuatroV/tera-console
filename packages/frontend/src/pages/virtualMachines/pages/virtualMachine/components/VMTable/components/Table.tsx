import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

type InstanceProperties = Record<string, string>;

const columns: ColumnDef<[string, string]>[] = [
  {
    header: "Характеристика",
    cell: ({ row }) => row.original[0],
  },
  {
    header: "Значение",
    cell: ({ row }) => {
      const key = row.original[0]; // id столбца (name / status / link …)
      const value = row.original[1]; // строковое значение

      // если это строка-ссылка → рендерим <a>
      if (key === "link" && value) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline"
          >
            {value}
          </a>
        );
      }
      return value;
    },
  },
];

type TableProps = { properties: InstanceProperties };

const Table = ({ properties }: TableProps) => {
  const table = useReactTable({
    columns,
    data: Object.entries(properties), // [["name","Jupyter"],["link","http://…"] ...]
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full flex flex-col">
      {/* заголовки */}
      <div className="flex">
        {table.getHeaderGroups().map((hg) => (
          <div key={hg.id} className="flex w-full rounded-2xl bg-gray-200 px-4">
            {hg.headers.map((h) => (
              <div key={h.id} className="flex-1 font-semibold py-4">
                {h.isPlaceholder
                  ? null
                  : flexRender(h.column.columnDef.header, h.getContext())}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* строки */}
      <div className="flex flex-col">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="flex w-full p-4 hover:bg-gray-50 rounded-2xl"
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
