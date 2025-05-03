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
} from "chart.js";
import { useEffect, useState } from "react";
import trpc from "@/utils/api";

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
  blkRead: number;
  blkWrite: number;
  netRxBytes: number;
  netTxBytes: number;
};

export default function VMStatsTab({ instanceId }: VMStatsTabProps) {
  const [data, setData] = useState<StatsPoint[]>([]);

  useEffect(() => {
    const sub = trpc.vm.streamStats.subscribe(
      { instanceId },
      {
        onData(stats) {
          setData((prev) => [
            ...prev.slice(-100),
            { time: Date.now(), ...stats },
          ]);
        },
        onError(err) {
          console.error(err);
        },
      }
    );
    return () => sub.unsubscribe();
  }, [instanceId]);

  // Подготовим данные для графиков
  const labels = data.map((d) => new Date(d.time).toLocaleTimeString());
  const cpuDs = data.map((d) => d.cpuPercent);
  const memDs = data.map((d) => (d.memoryUsage / 1000) * 100);
  const ioReadDs = data.map((d) => d.blkRead);
  const ioWriteDs = data.map((d) => d.blkWrite);
  const netRxDs = data.map((d) => d.netRxBytes);
  const netTxDs = data.map((d) => d.netTxBytes);

  const baseOpts = { responsive: true, scales: { x: { display: true } } };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Line
        data={{ labels, datasets: [{ label: "CPU %", data: cpuDs }] }}
        options={baseOpts}
      />
      <Line
        data={{ labels, datasets: [{ label: "Memory %", data: memDs }] }}
        options={baseOpts}
      />
      <Line
        data={{ labels, datasets: [{ label: "Disk Read", data: ioReadDs }] }}
        options={baseOpts}
      />
      <Line
        data={{ labels, datasets: [{ label: "Disk Write", data: ioWriteDs }] }}
        options={baseOpts}
      />
      <Line
        data={{ labels, datasets: [{ label: "Net RX", data: netRxDs }] }}
        options={baseOpts}
      />
      <Line
        data={{ labels, datasets: [{ label: "Net TX", data: netTxDs }] }}
        options={baseOpts}
      />
    </div>
  );
}
