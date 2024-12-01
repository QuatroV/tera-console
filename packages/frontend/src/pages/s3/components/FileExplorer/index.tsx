import Table from "./Table";
import TableHeader from "./TableHeader";

const FileExplorer = () => {
  return (
    <div className="bg-white rounded-2xl p-2">
      <TableHeader />{" "}
      <Table
        files={[
          { name: "app/", size: "-", storageClass: "-", lastModified: "-" },
          { name: "pages/", size: "-", storageClass: "-", lastModified: "-" },
          {
            name: "115-7216fae7309918a25.js",
            size: "120.91 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "132-8bbb91959476fd29.js",
            size: "2.51 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "146.1d33a58c15e8dd5c.js",
            size: "3.98 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "207-6cae96d3cd217f06.js",
            size: "34.78 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "265.fe6609060f6ab888.js",
            size: "11.5 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "2fb094e8-e28265c6fcb39aa1.js",
            size: "44.94 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "457-c5dcaf813039912c.js",
            size: "152.16 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "6f210a00.952287aeaba50fd5.js",
            size: "178.99 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "704.dda5efa4c92b4b47.js",
            size: "7 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "146.1d33a58c15e8dd5c.js",
            size: "3.98 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "207-6cae96d3cd217f06.js",
            size: "34.78 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "265.fe6609060f6ab888.js",
            size: "11.5 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "2fb094e8-e28265c6fcb39aa1.js",
            size: "44.94 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "457-c5dcaf813039912c.js",
            size: "152.16 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "6f210a00.952287aeaba50fd5.js",
            size: "178.99 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
          {
            name: "704.dda5efa4c92b4b47.js",
            size: "7 KB",
            storageClass: "Стандартное",
            lastModified: "17.10.2024, 12:32",
          },
        ]}
      />
    </div>
  );
};

export default FileExplorer;
