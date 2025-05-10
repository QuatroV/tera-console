import PageTitle from "@/components/PageTitle";
import { PAGES } from "@/router/constants";
import { FaBucket } from "react-icons/fa6";
import S3Tabs from "./components/S3Tabs";
import { useParams } from "react-router-dom";
import { lazy, Suspense, useState } from "react";

const FilesTab = lazy(() => import("./components/FilesTab"));
const SettingsTab = lazy(() => import("./components/SettingsTab/SettingsTab"));

export type BucketPageTab = "files" | "settings";

const BucketPage = () => {
  const { id } = useParams<{ id: string }>();

  const [tab, setTab] = useState<BucketPageTab>("files");

  return (
    <div>
      <PageTitle
        title={id || ""}
        items={[
          { name: "teraCloud", link: PAGES.CONSOLE.path },
          {
            name: "S3 Хранилище",
            link: PAGES.S3.path,
          },
          {
            name: id || "",
            link: "",
          },
        ]}
        Icon={FaBucket}
      />
      <S3Tabs tab={tab} setTab={setTab} />

      {tab === "files" ? (
        <Suspense fallback={null}>
          <FilesTab />
        </Suspense>
      ) : null}

      {tab === "settings" ? (
        <Suspense fallback={null}>
          <SettingsTab />
        </Suspense>
      ) : null}
    </div>
  );
};

export default BucketPage;
