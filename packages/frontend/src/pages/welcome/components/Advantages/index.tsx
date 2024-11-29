import AdvantagesList from "./components/AdvantagesList";

const Advantages = () => {
  return (
    <section>
      <h2 className="text-2xl tracking-wide font-dela ml-2 mb-1">
        Преимущества
      </h2>
      <h3 className="mb-4 ml-2 text-gray-500">Ключ к инновациям</h3>
      <AdvantagesList />
    </section>
  );
};

export default Advantages;
