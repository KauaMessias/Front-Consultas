import { useEffect, useRef, useState } from "react";
import { apiPrivate } from "../services/api";
import BuscarMedicos from "../components/BuscarMedicos";
import HorariosDisponiveis from "../components/HorariosDisponiveis";
import { Link } from "react-router";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { Spinner } from "../components/Spinner";
import { toast } from "sonner";

function AgendarConsulta() {
  const [medicos, setMedicos] = useState([]);
  const [medicoSelecionado, setSelecionado] = useState(null);
  const [medicosLoading, setMedicosLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [paginas, setPaginas] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputEspecialidade = useRef();
  const inputCidade = useRef();

  async function getMedicos(paginaAtual) {
    const especialidade = inputEspecialidade.current.value;
    const cidade = inputCidade.current.value;

    setMedicosLoading(true);
    try {
      const medicosApi = await apiPrivate.get("/api/v1/medicos", {
        params: {
          page: paginaAtual,
          especialidade: especialidade || undefined,
          cidade: cidade || undefined,
        },
      });

      setMedicos(medicosApi.data ?? []);
      setPaginaAtual(paginaAtual);
      criarPaginas(paginaAtual, medicosApi.data.totalPages);
    } catch (error) {
      toast.error("Erro ao buscar médicos.");
    } finally {
      setMedicosLoading(false);
    }
  }

  async function alterarPaginaAtual(alterar) {
    const novapaginaAtual = alterar ? paginaAtual + 1 : paginaAtual - 1;

    if (novapaginaAtual < 0) return;

    getMedicos(novapaginaAtual);
  }

  function selecionar(medico) {
    setSelecionado(medico);
  }

  function criarPaginas(paginaAtual, total) {
    const novasPaginas = [];
    if (paginaAtual < 7) {
      for (let i = 0; i < 10; i++) {
        if (i < total) novasPaginas.push(i);
      }
    } else {
      for (let i = paginaAtual - 4; i <= paginaAtual + 5; i++) {
        if (i < total) novasPaginas.push(i);
      }
    }
    setPaginas(novasPaginas);
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
            onClick={() => getMedicos(0)}
            className="bg-neutral-800 cursor-pointer hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 shadow-lg shadow-neutral-500 flex items-center justify-center text-md gap-2"
          />
        </div>

        <div className="flex flex-col justify-center items-center gap-6 ">
          <p className="text-md self-center font-semibold text-neutral-600">
            Médicos disponíveis
          </p>
          {medicosLoading ? (
            <Spinner />
          ) : !medicos.content ? (
            "Nenhum médico encontrado."
          ) : (
            <>
              <BuscarMedicos
                medicos={medicos.content}
                setSelecionado={selecionar}
              />

              <div className="flex text-center items-center gap-2">
                <button
                  className=" cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center text-4xl gap-2"
                  onClick={() => alterarPaginaAtual(false)}
                  disabled={paginaAtual === 0}
                >
                  <IoIosArrowRoundBack />
                </button>
                <div className="flex gap-2">
                  {paginas.map((pagina) => {
                    return (
                      <button
                        className={`${pagina === paginaAtual ? "text-lg font-bold" : "hover:underline transition-all active:scale-95"}`}
                        key={pagina}
                        disabled={pagina === paginaAtual}
                        onClick={() => getMedicos(pagina)}
                      >
                        {pagina + 1}
                      </button>
                    );
                  })}
                </div>
                <button
                  className=" cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 flex items-center justify-center text-4xl gap-2"
                  onClick={() => alterarPaginaAtual(true)}
                >
                  <IoIosArrowRoundForward />
                </button>
              </div>
            </>
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
