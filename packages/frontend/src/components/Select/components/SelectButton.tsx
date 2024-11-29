type SelectButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

const SelectButton = (props: SelectButtonProps) => {
  const { children, onClick } = props;
  return (
    <div className="cursor-pointer h-full" onClick={onClick}>
      {children}
    </div>
  );
};

export default SelectButton;
