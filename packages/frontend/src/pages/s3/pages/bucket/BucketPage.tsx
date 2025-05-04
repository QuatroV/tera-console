import PageTitle from "@/components/PageTitle";
import { PAGES } from "@/router/constants";
import { FaBucket } from "react-icons/fa6";
import S3Tabs from "./components/S3Tabs";
import FileExplorer from "./components/FileExplorer";
import { useParams } from "react-router-dom";

const BucketPage = () => {
  const { id } = useParams<{ id: string }>();

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
      <S3Tabs />
      <FileExplorer />
    </div>
  );
};

export default BucketPage;
