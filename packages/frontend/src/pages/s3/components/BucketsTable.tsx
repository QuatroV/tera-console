import Button from "@/components/Button";
import Input from "@/components/Input";
import Spinner from "@/components/Spinner";
import trpc from "@/utils/api";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import BucketList from "./BucketList";
import CreateBucketModal from "./CreateBucketModal";

export type Bucket = {
  Name?: string;
  CreationDate?: string;
  BucketRegion?: string;
  ObjectCount?: number;
  TotalSize?: number;
};

const BucketsTable = () => {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuckets = async () => {
    setLoading(true);
    try {
      const res = await trpc.s3.listBuckets.query();
      if (res.status === "success" && res.buckets) setBuckets(res.buckets);
    } catch (e) {
      console.error("[S3Page] listBuckets error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center pt-12">
        <Spinner className="size-12 text-indigo-500" />
      </div>
    );
  }

  return (
    <>
      {
        <CreateBucketModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          onSuccess={fetchBuckets}
        />
      }
      <div className="bg-white rounded-2xl p-2 mb-4">
        <div className="flex justify-between mb-2">
          <Button
            variant="filled"
            size="large"
            className="p-3 text-sm flex items-center gap-2 rounded-2xl"
            onClick={() => setModalOpen(true)}
          >
            <BiPlus size={32} />
            Добавить бакет
          </Button>
          <div className="relative flex items-center">
            <IoSearch className="fill-gray-700 absolute left-3" size={24} />
            <Input
              placeholder="Поиск по бакетам"
              className="w-full p-3 outline-indigo-300 px-12 border text-sm"
            ></Input>
            <IoMdClose
              className="fill-gray-700 absolute right-3 cursor-pointer"
              size={24}
            />
          </div>
        </div>
        <BucketList buckets={buckets} onRefresh={fetchBuckets} />
      </div>
    </>
  );
};

export default BucketsTable;
