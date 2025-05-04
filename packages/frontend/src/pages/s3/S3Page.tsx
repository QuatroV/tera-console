import { FaBucket } from "react-icons/fa6";

import PageTitle from "@/components/PageTitle";
import QuotasBar from "@/components/QuotasBar";
import DocsReference from "../virtualMachines/components/DocsReference";
import BucketsTable from "./components/BucketsTable";

export default function S3Page() {
  return (
    <div>
      <PageTitle
        title="S3 Хранилище"
        items={[
          { name: "teraCloud", link: "/" },
          { name: "S3 Хранилище", link: "/s3" },
        ]}
        Icon={FaBucket}
      />
      <QuotasBar />
      <BucketsTable />
      <DocsReference />
    </div>
  );
}
