import { useEffect, useRef, useState } from "react";
import { apiPrivate } from "../services/api";
import BuscarMedicos from "../components/BuscarMedicos";
import HorariosDisponiveis from "../components/HorariosDisponiveis";
import { Link } from "react-router";
import { IoIosArrowRoundBack } from "react-icons/io";

function AgendarConsulta() {
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setSelecionado] = useState(null);

  const inputEspecialidade = useRef();
  const inputCidade = useRef();
  const page = 0;
  const size = 10;

  async function getMedicos() {
    const especialidade = inputEspecialidade.current.value;
    const cidade = inputCidade.current.value;
    const medicosApi = await apiPrivate.get("/api/v1/medicos", {
      params: {
        especialidade: especialidade || undefined,
        cidade: cidade || undefined,
        page: page,
        size: size,
      },
    });

    setMedicos(medicosApi.data.content ?? []);
  }

  function selecionar(medico) {
    setSelecionado(medico);
  }

  return (
    <div className="bg-neutral-950 w-screen h-screen flex items-center justify-center">
      <div className="pb-8 overflow-y-auto bg-neutral-300 h-4/5 w-1/2 rounded-2xl flex flex-col gap-16">
        <header className="flex items-center relative pt-14">
          <h1 className="text-5xl font-bold text-center w-full">
            Agendar Consulta
          </h1>
          <Link
            className="absolute right-0 top-0 text-6xl hover:scale-110 transition-all duration-300 ease-out"
            to={"/"}
          >
            <IoIosArrowRoundBack />
          </Link>
        </header>

        <div className="flex justify-center items-center gap-6">
          <input
            type="text"
            name="especialidade"
            id="especialidade"
            placeholder="Especialidade"
            ref={inputEspecialidade}
            className="border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
          />
          <input
            type="text"
            placeholder="Cidade"
            ref={inputCidade}
            className="border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
          />
          <input
            type="button"
            value="Pesquisar"
            onClick={getMedicos}
            className="ease-out bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:scale-105 transition-all duration-200 text-neutral-300 rounded-lg p-1 w-fit shadow-lg shadow-neutral-500"
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-6 ">
          <BuscarMedicos medicos={medicos} setSelecionado={selecionar} />
        </div>
      </div>

      {medicoSelecionado && (
        <HorariosDisponiveis
          medico={medicoSelecionado}
          onClose={() => setSelecionado(null)}
        />
      )}
    </div>
  );
}

export default AgendarConsulta;
