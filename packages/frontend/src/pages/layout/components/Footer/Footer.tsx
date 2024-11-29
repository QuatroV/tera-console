import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="mt-4 mb-2 rounded-xl p-4 flex flex-col items-start mr-2 max-w-7xl w-max">
        <Logo svgClassName="w-10 h-10 text-gray-700" variant="footer" />
        <p className="text-gray-600 italic text-sm max-w-xl text-start font-semibold">
          teraCloud team
        </p>
        <p className="text-gray-700 italic text-xs max-w-xl text-start">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris
        </p>
        <p className="text-gray-700 italic text-sm">2024</p>
      </div>
    </div>
  );
};

export default Footer;
