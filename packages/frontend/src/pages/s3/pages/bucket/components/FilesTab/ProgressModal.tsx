const ProgressModal = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-80">
        <p className="mb-2">Загрузка… {Math.round(progress)}%</p>
        <div className="w-full h-3 bg-gray-200 rounded">
          <div
            className="h-3 bg-indigo-600 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;
