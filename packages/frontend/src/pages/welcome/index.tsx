import Advantages from "./components/Advantages";
import CustomersInfo from "./components/CustomersInfo";
import Services from "./components/Services/Services";
import TeragraphInfo from "./components/TeragraphInfo/TeragraphInfo";
import WelcomeCard from "./components/WelcomeCard";

const Welcome = () => {
  return (
    <>
      <WelcomeCard />
      <Advantages />
      <Services />
      <CustomersInfo />
      <div className="w-full flex justify-center p-10">
        <hr className="w-72 h-1 bg-gray-300 rounded " />
      </div>

      <TeragraphInfo />
    </>
  );
};

export default Welcome;
