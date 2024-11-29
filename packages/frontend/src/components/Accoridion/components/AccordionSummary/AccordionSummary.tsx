type AccordionSummaryProps = {
  children: React.ReactNode;
};

const AccordionSummary: React.FC<AccordionSummaryProps> = (props) => {
  const { children } = props;
  return <div>{children}</div>;
};

export default AccordionSummary;
