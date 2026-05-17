import { IoIosArrowRoundBack } from "react-icons/io";
import { Link } from "react-router";

function NotFound() {
  return (
    <div className="bg-neutral-950 w-screen h-screen text-center justify-center flex flex-col gap-2 ">
      <div>
        <h1 className="text-6xl font-black text-neutral-50">404</h1>
        <p className="text-2xl text-neutral-50 font-semibold">
          Página não encontrada
        </p>
        <p className="text-neutral-400">
          A página que você tentou acessar não existe ou foi movida.
        </p>
      </div>
      <Link
        to="/home"
        className=" text-neutral-100 bg-neutral-900 w-fit self-center rounded-lg py-2 px-4 font-semibold shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <IoIosArrowRoundBack className="text-xl" />
        Voltar para o início
      </Link>
    </div>
  );
}

export default NotFound;
