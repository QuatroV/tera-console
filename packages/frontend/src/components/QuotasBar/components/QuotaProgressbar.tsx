type QuotaProgressbarProps = {
  progress: number;
};

const QuotaProgressbar = ({ progress }: QuotaProgressbarProps) => {
  return (
    <div className="bg-gray-300 h-1 rounded-lg mx-4">
      <div
        className="bg-indigo-300 h-1 rounded-lg"
        style={{ width: progress }}
      ></div>
    </div>
  );
};

export default QuotaProgressbar;
