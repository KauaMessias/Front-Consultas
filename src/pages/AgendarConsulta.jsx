import { useEffect, useRef, useState } from "react";
import { apiPrivate } from "../services/api";
import BuscarMedicos from "../components/BuscarMedicos";
import HorariosDisponiveis from "../components/HorariosDisponiveis";
import { Link } from "react-router";
import { IoIosArrowRoundBack } from "react-icons/io";
import { Spinner } from "../components/Spinner";
import { toast } from "sonner";

function AgendarConsulta() {
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setSelecionado] = useState(null);
  const [medicosLoading, setMedicosLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputEspecialidade = useRef();
  const inputCidade = useRef();
  const page = 0;
  const size = 10;

  async function getMedicos() {
    const especialidade = inputEspecialidade.current.value;
    const cidade = inputCidade.current.value;

    setMedicosLoading(true);
    try {
      const medicosApi = await apiPrivate.get("/api/v1/medicos", {
        params: {
          especialidade: especialidade || undefined,
          cidade: cidade || undefined,
          page: page,
          size: size,
        },
      });

      setMedicos(medicosApi.data.content ?? []);
    } catch (error) {
      toast.error("Erro ao buscar médicos.");
    } finally {
      setMedicosLoading(false);
    }
  }

  function selecionar(medico) {
    setSelecionado(medico);
  }

  return (
    <div className="bg-neutral-950 w-screen h-screen flex items-center justify-center">
      <div className="pb-8 overflow-y-auto relative bg-neutral-300 p-8 max-h-160  w-full max-w-3xl min-h-130 h-fit rounded-2xl flex flex-col gap-12">
        <header className="flex items-center static pt-6">
          <h1 className="text-4xl font-bold text-center w-full">
            Agendar Consulta
          </h1>
          <Link
            className="absolute left-0 top-0 text-6xl hover:scale-110 transition-all duration-300 ease-out"
            to={"/home"}
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
            value={medicosLoading ? "Pesquisando..." : "Pesquisar"}
            onClick={getMedicos}
            className="bg-neutral-800 cursor-pointer hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 shadow-lg shadow-neutral-500 flex items-center justify-center text-md gap-2"
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-6 ">
          <p className="text-md self-center font-semibold text-neutral-600">
            Médicos disponíveis
          </p>
          {medicosLoading ? (
            <Spinner />
          ) : medicos.length <= 0 ? (
            "Nenhum médico encontrado."
          ) : (
            <BuscarMedicos medicos={medicos} setSelecionado={selecionar} />
          )}
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
