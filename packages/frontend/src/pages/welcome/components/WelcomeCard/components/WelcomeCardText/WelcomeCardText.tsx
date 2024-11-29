import Button from "@/components/Button";

const WelcomeCardText = () => {
  return (
    <section className="h-full flex flex-col justify-end md:justify-center">
      <div>
        <h2 className=" font-dela text-white text-4xl md:text-6xl mb-4 md:mb-6 ">
          Тераграф
        </h2>
        <p className="text-white max-w-sm mb-4 md:mb-6 ">
          Встречайте: новое слово в анализе данных, компьютер, созданный в МГТУ
          им. Н.Э. Баумана, предоставляет уникальные решения для вашего бизнеса.
        </p>
        <Button color="white" variant="filled" size="large">
          Попробовать
        </Button>
      </div>
    </section>
  );
};

export default WelcomeCardText;
