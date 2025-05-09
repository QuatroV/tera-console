import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import trpc from "@/utils/api";
import Card from "@/components/Card";
import TableHeader from "./TableHeader";
import Table, { RowFile } from "./Table";
import DragOverlay from "./DragOverlay";
import ProgressModal from "./ProgressModal";

export default function FileExplorer() {
  const [params, setParams] = useSearchParams();
  const prefix = params.get("key") ?? "";
  const { id: bucket } = useParams<{ id: string }>();

  const [files, setFiles] = useState<RowFile[]>([]);
  const [loading, setLoading] = useState(true);

  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // 1) fetch list
  const fetchList = useCallback(
    async (p = prefix) => {
      if (!bucket) return;
      setLoading(true);
      try {
        const res = await trpc.s3.listObjects.query({ bucket, prefix: p });
        if (res.status === "success") setFiles(res.items);
      } finally {
        setLoading(false);
      }
    },
    [bucket, prefix]
  );

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // 2) navigation
  const goTo = (dir: string) => {
    setParams((p) => {
      p.set("key", dir);
      return p;
    });
  };

  // 3) actions
  const download = async (key: string) => {
    if (!bucket) return;
    const { url } = await trpc.s3.getObjectPresigned.query({ bucket, key });
    window.open(url, "_blank");
  };
  const preview = download;
  const remove = async (key: string) => {
    if (!bucket) return;
    await trpc.s3.deleteObject.mutate({ bucket, key });
    fetchList();
  };
  const share = async (key: string) => {
    if (!bucket) return;
    const { url } = await trpc.s3.getObjectPresigned.query({ bucket, key });
    await navigator.clipboard.writeText(url);
    alert("Ссылка скопирована в буфер");
  };

  // 4) create folder
  const createFolder = async () => {
    if (!bucket) return;
    const name = prompt("Имя новой папки:");
    if (!name) return;
    await trpc.s3.createFolder.mutate({ bucket, prefix: `${prefix}${name}/` });
    fetchList();
  };

  // 5) helper: recurse DataTransferItemList → File[]
  const getFilesFromDataTransfer = async (
    items: DataTransferItemList
  ): Promise<File[]> => {
    const files: File[] = [];
    const traverse = async (entry: any, path: string): Promise<void> => {
      if (entry.isFile) {
        const file: File = await new Promise((r) => entry.file(r));
        // re-construct full path so webkitRelativePath works downstream
        files.push(
          new File([file], path + file.name, {
            type: file.type,
            lastModified: file.lastModified,
          })
        );
      } else if (entry.isDirectory) {
        const reader = entry.createReader();
        const ents: any[] = await new Promise((r) => reader.readEntries(r));
        await Promise.all(
          ents.map((e) => traverse(e, path + entry.name + "/"))
        );
      }
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === "file") {
        const entry = (item as any).webkitGetAsEntry();
        if (entry) await traverse(entry, "");
      }
    }
    return files;
  };

  // 6) upload with progress
  const handleFiles = async (fileList: File[]) => {
    if (!bucket || !fileList.length) return;
    const total = fileList.reduce((sum, f) => sum + f.size, 0);
    let uploaded = 0;

    setUploading(true);
    setProgress(0);

    for (const file of fileList) {
      const key = `${prefix}${file.name}`;
      // presign
      const { url } = await trpc.s3.putObjectPresigned.mutate({ bucket, key });
      // upload via XHR
      await new Promise<void>((res, rej) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (e) => {
          if (!e.lengthComputable) return;
          const prev = (xhr as any).__lastLoaded || 0;
          uploaded += e.loaded - prev;
          (xhr as any).__lastLoaded = e.loaded;
          setProgress((uploaded / total) * 100);
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // account remainder
            const prev = (xhr as any).__lastLoaded || 0;
            uploaded += file.size - prev;
            setProgress((uploaded / total) * 100);
            res();
          } else {
            rej(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => rej(new Error("Network error"));
        xhr.open("PUT", url, true);
        xhr.send(file);
      });
    }

    setUploading(false);
    setTimeout(() => setProgress(0), 500);
    fetchList();
  };

  // 7) drag-&-drop handlers
  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (dragCounter.current === 1) setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    let filesToUpload: File[];
    if (e.dataTransfer.items && e.dataTransfer.items.length) {
      filesToUpload = await getFilesFromDataTransfer(e.dataTransfer.items);
    } else {
      filesToUpload = Array.from(e.dataTransfer.files);
    }
    handleFiles(filesToUpload);
  };

  return (
    <Card
      className="relative p-2 bg-white rounded-2xl"
      onDragEnter={onDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <TableHeader
        prefix={prefix}
        onCreateFolder={createFolder}
        onUpload={(f) => handleFiles([f])}
      />

      <Table
        files={files}
        isLoading={loading}
        onDirClick={goTo}
        onFileClick={preview}
        onDownload={download}
        onPreview={preview}
        onDelete={remove}
        onShare={share}
      />

      {isDragging && !uploading ? <DragOverlay /> : null}

      {uploading ? <ProgressModal progress={progress} /> : null}
    </Card>
  );
}
