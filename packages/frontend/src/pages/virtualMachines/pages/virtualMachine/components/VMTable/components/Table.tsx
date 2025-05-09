import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  FaServer,
  FaLink,
  FaRegClock,
  FaKey,
  FaDatabase,
  FaTag,
} from "react-icons/fa6";

type InstanceProperties = Record<string, string>;

const RUSSIAN_LABELS: Record<string, string> = {
  instanceType: "Тип инстанса",
  instanceName: "Имя",
  link: "Ссылка",
  status: "Статус",
  lastBackupBucket: "Бакет с последним бэкапом",
  lastBackupKey: "Ключ последнего бэкапа",
  lastBackupAt: "Дата последнего бэкапа",
  createdAt: "Создан",
};

const ICONS: Record<string, JSX.Element> = {
  instanceType: <FaServer className="inline mr-2 text-gray-500" />,
  instanceName: <FaTag className="inline mr-2 text-gray-500" />,
  link: <FaLink className="inline mr-2 text-gray-500" />,
  status: <FaTag className="inline mr-2 text-gray-500" />,
  lastBackupBucket: <FaDatabase className="inline mr-2 text-gray-500" />,
  lastBackupKey: <FaKey className="inline mr-2 text-gray-500" />,
  lastBackupAt: <FaRegClock className="inline mr-2 text-gray-500" />,
  createdAt: <FaRegClock className="inline mr-2 text-gray-500" />,
};

const columns: ColumnDef<[string, string]>[] = [
  {
    header: "Характеристика",
    cell: ({ row }) => {
      const key = row.original[0];
      const label = RUSSIAN_LABELS[key] || key;
      const icon = ICONS[key];

      return (
        <span className="flex items-center">
          {icon}
          {label}
        </span>
      );
    },
  },
  {
    header: "Значение",
    cell: ({ row }) => {
      const key = row.original[0];
      const value = row.original[1];

      if (key === "link" && value) {
        return (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 underline "
          >
            {value}
          </a>
        );
      }

      if (key === "createdAt" && value) {
        return (
          <span>
            {Intl.DateTimeFormat("ru-RU", {
              dateStyle: "long",
              timeStyle: "short",
            }).format(new Date(value))}
          </span>
        );
      }

      if (key === "lastBackupBucket" && value !== "-" && value) {
        return (
          <a
            href={`/s3/${encodeURIComponent(value)}`}
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
    data: Object.entries(properties),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full flex flex-col border bg-gray-50 rounded-2xl isolate overflow-hidden">
      <div className="flex flex-col">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id} className="flex w-full p-4 hover:bg-gray-100">
            {row.getVisibleCells().map((cell) => (
              <div
                key={cell.id}
                className="flex-1 text-ellipsis overflow-hidden"
              >
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
