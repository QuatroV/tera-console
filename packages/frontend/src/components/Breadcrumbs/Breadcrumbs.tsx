type BreadcrumbsObj = {
  name: string;
  link: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbsObj[];
};

const Breadcrumbs = (props: BreadcrumbsProps) => {
  const { items } = props;
  return (
    <div className=" text-gray-500 text-sm flex gap-2">
      {items.map((item, idx) => (
        <>
          <a className="hover:text-indigo-500" href={item.link} key={item.link}>
            {item.name}
          </a>
          {items.length - 1 !== idx && " > "}
        </>
      ))}
    </div>
  );
};

export default Breadcrumbs;
