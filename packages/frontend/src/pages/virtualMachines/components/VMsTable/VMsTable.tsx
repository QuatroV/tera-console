import { useEffect, useState } from "react";
import Table from "./components/Table";
import TableHeader from "./components/TableHeader";
import { InstanceInfo } from "./types";
import trpc from "@/utils/api";

const VMsTable = () => {
  const [loading, setLoading] = useState(true);
  const [instances, setInstances] = useState<InstanceInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchInstances = async () => {
      try {
        const result = await trpc.vm.getInstances.query();

        if (result.status !== "success") {
          throw new Error("Ошибка на сервере");
        }

        setInstances(result.instances);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInstances();
  }, []);

  return (
    <div className="rounded-2xl bg-white p-2 mb-4">
      <TableHeader setSearchTerm={setSearchTerm} />
      <Table
        loading={loading}
        instances={instances.filter((instance) =>
          instance.name.includes(searchTerm)
        )}
      />
    </div>
  );
};

export default VMsTable;
