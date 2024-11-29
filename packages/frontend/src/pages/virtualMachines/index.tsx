import QuotasBar from "@/components/QuotasBar";
import PageTitle from "./components/PageTitle";
import VMsTable from "./components/VMsTable/VMsTable";
import DocsReference from "./components/DocsReference";

const VirtualMachines = () => {
  return (
    <div className="">
      <PageTitle />
      <QuotasBar />
      <VMsTable />
      <DocsReference />
    </div>
  );
};

export default VirtualMachines;
