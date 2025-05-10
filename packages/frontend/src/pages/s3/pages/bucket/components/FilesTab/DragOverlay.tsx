import { IoDownload } from "react-icons/io5";

const DragOverlay = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center pointer-events-none rounded-lg">
      <div className="bg-white p-6 rounded-lg text-center outline-dashed -outline-offset-8 outline-gray-500">
        <div className="text-lg flex flex-col gap-4 items-center text-gray-500">
          <IoDownload className="size-20 " />
          <p>Перетащите сюда файлы или папки, чтобы загрузить их на S3</p>
        </div>
      </div>
    </div>
  );
};

export default DragOverlay;
