import PageTitle from "@/components/PageTitle";
import { PAGES } from "@/router/constants";
import { FaBucket } from "react-icons/fa6";
import S3Tabs from "./components/S3Tabs";
import FileExplorer from "./components/FileExplorer";

const S3 = () => {
  return (
    <div>
      <PageTitle
        title="S3 Хранилище"
        items={[
          { name: "teraCloud", link: PAGES.CONSOLE.path },
          {
            name: "S3 Хранилище",
            link: PAGES.S3.path,
          },
        ]}
        Icon={FaBucket}
      />
      <S3Tabs />
      <FileExplorer />
    </div>
  );
};

export default S3;
