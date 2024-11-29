type QuotaProgressbarProps = {
  progress: number;
};

const QuotaProgressbar = ({ progress }: QuotaProgressbarProps) => {
  return (
    <div className="bg-gray-300 h-2 rounded-b-lg">
      <div
        className="bg-indigo-300 h-2 rounded-b-lg"
        style={{ width: progress }}
      ></div>
    </div>
  );
};

export default QuotaProgressbar;
