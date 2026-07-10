import heroBg from "@/assets/Hero 1.jpg.jpeg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden h-[60vh] md:h-[72vh]">
      <img
        src={heroBg}
        alt="Jokku hero"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* <div className="relative z-10 ...">
        ...commented content...
      </div> */}
    </section>
  );
};

export default HeroSection;
