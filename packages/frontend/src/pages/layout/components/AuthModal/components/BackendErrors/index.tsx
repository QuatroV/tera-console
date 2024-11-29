type BackendErrorsProps = {
  errorMsg: string;
};

const BackendErrors = (props: BackendErrorsProps) => {
  const { errorMsg } = props;
  return (
    <div className="rounded-xl p-4 bg-red-100 border border-red-500 text-sm ">
      <p className="max-w-[410px]">
        <span className="font-semibold">Ошибка сервера:</span> {errorMsg}
      </p>
    </div>
  );
};

export default BackendErrors;
