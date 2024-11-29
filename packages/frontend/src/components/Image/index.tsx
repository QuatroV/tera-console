const Image = (
  props: React.HTMLProps<HTMLImageElement> & {
    loading?: "lazy" | "eager";
  }
) => {
  return <img {...props} />;
};

export default Image;
