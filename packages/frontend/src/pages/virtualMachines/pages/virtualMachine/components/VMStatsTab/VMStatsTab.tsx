import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip,
  ChartOptions,
} from "chart.js";
import { useEffect, useState } from "react";
import trpc from "@/utils/api";
import Card from "@/components/Card";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Legend,
  Tooltip
);

type VMStatsTabProps = { instanceId: string };

type StatsPoint = {
  time: number; // unix ms
  cpuPercent: number;
  memoryUsage: number;
  memoryLimit: number;
  blkRead: number;
  blkWrite: number;
  netRxBytes: number;
  netTxBytes: number;
};

const chartColor = "rgb(79, 70, 229)";
const chartColorSecondary = "rgb(99, 102, 241)";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Б";
  const sizes = ["Б", "КБ", "МБ", "ГБ", "ТБ"];
  const i = Math.max(0, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(1)} ${sizes[i]}`;
}

export default function VMStatsTab({ instanceId }: VMStatsTabProps) {
  const [data, setData] = useState<StatsPoint[]>([]);

  useEffect(() => {
    const sub = trpc.vm.streamStats.subscribe(
      { instanceId },
      {
        onData(stats) {
          setData((prev) =>
            [
              ...prev,
              {
                time: Date.now(),
                cpuPercent: stats.cpu_percent,
                memoryUsage: Number(stats.memory_usage),
                memoryLimit: Number(stats.memory_limit),
                blkRead: Number(stats.blk_read),
                blkWrite: Number(stats.blk_write),
                netRxBytes: Number(stats.net_rx_bytes),
                netTxBytes: Number(stats.net_tx_bytes),
              },
            ].slice(-100)
          );
        },
        onError(err) {
          console.error("[VMStatsTab] streamStats error:", err);
        },
      }
    );
    return () => sub.unsubscribe();
  }, [instanceId]);

  const labels = data.map((d) => new Date(d.time).toLocaleTimeString());
  const cpuDs = data.map((d) => d.cpuPercent);
  const memDs = data.map((d) => (d.memoryUsage / d.memoryLimit) * 100);
  const ioReadDs = data.map((d) => d.blkRead);
  const ioWriteDs = data.map((d) => d.blkWrite);
  const netRxDs = data.map((d) => d.netRxBytes);
  const netTxDs = data.map((d) => d.netTxBytes);

  const baseOpts: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: true },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number | string) {
            if (typeof value === "number") return formatBytes(value);
            return value;
          },
        },
      },
    },
    plugins: {
      legend: { position: "bottom" },
      tooltip: { enabled: true },
    },
  };

  return (
    <Card className="grid grid-cols-2 gap-8 p-4 pb-10">
      {/* CPU */}
      <div className="h-48">
        <h2 className="font-medium flex justify-between mb-2">
          <span>Загрузка CPU (%)</span>
          <span className="text-sm text-gray-500">
            {cpuDs.at(-1)?.toFixed(1) ?? "–"}%
          </span>
        </h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "CPU %",
                data: cpuDs,
                borderColor: chartColor,
                backgroundColor: chartColor,
              },
            ],
          }}
          options={{
            ...baseOpts,
            scales: {
              ...baseOpts.scales,
              y: { min: 0, max: 100 },
            },
          }}
        />
      </div>

      {/* Memory */}
      <div className="h-48">
        <h2 className="font-medium flex justify-between mb-2">
          <span>Использование памяти (%)</span>
          <span className="text-sm text-gray-500">
            {memDs.at(-1)?.toFixed(1) ?? "–"}%
          </span>
        </h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Память %",
                data: memDs,
                borderColor: chartColor,
                backgroundColor: chartColor,
              },
            ],
          }}
          options={{
            ...baseOpts,
            scales: {
              ...baseOpts.scales,
              y: { min: 0, max: 100 },
            },
          }}
        />
      </div>

      {/* Disk IO */}
      <div className="h-48">
        <h2 className="font-medium flex justify-between mb-2">
          <span>Диск (байты)</span>
          <span className="text-sm text-gray-500">
            Чтение: {formatBytes(ioReadDs.at(-1) ?? 0)} / Запись:{" "}
            {formatBytes(ioWriteDs.at(-1) ?? 0)}
          </span>
        </h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Чтение с диска",
                data: ioReadDs,
                borderColor: chartColor,
                backgroundColor: chartColor,
              },
              {
                label: "Запись на диск",
                data: ioWriteDs,
                borderColor: chartColorSecondary,
                backgroundColor: chartColorSecondary,
              },
            ],
          }}
          options={baseOpts}
        />
      </div>

      {/* Network IO */}
      <div className="h-48">
        <h2 className="font-medium flex justify-between mb-2">
          <span>Сеть (байты)</span>
          <span className="text-sm text-gray-500">
            Вход: {formatBytes(netRxDs.at(-1) ?? 0)} / Выход:{" "}
            {formatBytes(netTxDs.at(-1) ?? 0)}
          </span>
        </h2>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Входящий трафик",
                data: netRxDs,
                borderColor: chartColor,
                backgroundColor: chartColor,
              },
              {
                label: "Исходящий трафик",
                data: netTxDs,
                borderColor: chartColorSecondary,
                backgroundColor: chartColorSecondary,
              },
            ],
          }}
          options={baseOpts}
        />
      </div>
    </Card>
  );
}
