import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { apiPrivate } from "../services/api";
import { Spinner } from "./Spinner";
import { toast } from "sonner";

function HorariosMedico({ medico, onClose }) {
  const [horarios, setHorarios] = useState([]);
  const [data, setData] = useState("");
  const [consultaForm, setConsultaForm] = useState({
    dataConsulta: "",
    tipoConsulta: "",
    descricaoConsulta: "",
    medico_id: medico.id,
    cliente_id: sessionStorage.getItem("id"),
  });
  const [horariosLoading, setHorariosLoading] = useState(false);
  const [agendarLoading, setAgendarLoading] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  async function buscarHorarios(dataSelecionada) {
    setHorarios([]);

    setHorariosLoading(true);
    try {
      const response = await apiPrivate.get(
        `/api/v1/medicos/${medico.id}/horarios/disponiveis`,
        {
          params: {
            data: dataSelecionada,
          },
        },
      );
      setHorarios(response.data);
    } catch (error) {
      toast.error("Erro ao buscar horários disponíveis.");
    } finally {
      setHorariosLoading(false);
    }
  }

  async function agendarConsulta() {
    setAgendarLoading(true);
    try {
      await apiPrivate.post("/api/v1/consultas", consultaForm);
      limparConsulta();
      onClose();
      toast.success("Consulta agendada com sucesso!");
    } catch (error) {
      toast.error("Erro ao agendar consulta.");
    } finally {
      setAgendarLoading(false);
    }
  }

  function mostrarHorario(horario) {
    return (
      <input
        key={horario.horario}
        className={`rounded-lg border px-2 py-1.5 text-sm shadow-sm cursor-pointer transition-all duration-200
    ${
      horarioSelecionado?.horario === horario.horario
        ? "bg-neutral-900 text-white border-neutral-900 shadow-md scale-105"
        : "bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-900 hover:text-white"
    }`}
        type="button"
        value={horario.horario.slice(0, 5)}
        onClick={(e) => {
          setHorarioSelecionado(horario);
          setConsultaForm({
            ...consultaForm,
            dataConsulta: data + "T" + horario.horario,
          });
        }}
      />
    );
  }

  function limparConsulta() {
    setConsultaForm({
      ...consultaForm,
      dataConsulta: "",
      tipoConsulta: "",
      descricaoConsulta: "",
    });
  }

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="fixed w-fit h-fit rounded-2xl bg-neutral-200 flex flex-col p-4 items-center shadow-lg "
      >
        <header className="flex justify-end text-3xl w-full">
          <button
            className="hover:scale-110 transition-all duration-300 ease-out"
            onClick={onClose}
          >
            <IoCloseOutline />
          </button>
        </header>
        <form
          className="overflow-y-auto w-full h-full rounded-2xl p-4 flex flex-col items-center gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            agendarConsulta();
          }}
        >
          <h1 className="font-semibold text-2xl">{medico.nome}</h1>{" "}
          <h1 className="font-medium mb-4 bg-neutral-400/35 px-1 py-0.5 rounded-xl">
            {medico.especialidade}
          </h1>
          <input
            type="date"
            name="data"
            id="data"
            className="border border-neutral-300 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
            onChange={(e) => {
              const novaData = e.target.value;
              if (!novaData) {
                setHorarios([]);
                setData("");
                setHorarioSelecionado("");
              } else {
                setHorarioSelecionado("");
                setData(novaData);
                buscarHorarios(novaData);
              }
            }}
          />
          <p className="text-sm font-semibold text-neutral-600">
            Horários disponíveis
          </p>
          <div className="w-full max-w-xs flex flex-wrap justify-center gap-2">
            {horariosLoading ? (
              <Spinner />
            ) : !data ? null : horarios.length > 0 ? (
              horarios.map((horario) => mostrarHorario(horario))
            ) : (
              <p>Nenhum horário encontrado</p>
            )}
          </div>
          <input
            type="text"
            name="tipoConsulta"
            id="tipoConsulta"
            placeholder="Tipo de Consulta"
            required
            className="border border-neutral-300 rounded-lg bg-neutral-50 focus:bg-white transition px-2 py-1"
            onChange={(e) => {
              setConsultaForm({
                ...consultaForm,
                tipoConsulta: e.target.value,
              });
            }}
          />
          <input
            type="text"
            name="descricao"
            id="descricao"
            placeholder="descrição"
            required
            className="border border-neutral-300 rounded-lg bg-neutral-50 focus:bg-white transition px-2 py-1"
            onChange={(e) => {
              setConsultaForm({
                ...consultaForm,
                descricaoConsulta: e.target.value,
              });
            }}
          />
          <input
            type="submit"
            value={agendarLoading ? "Agendando..." : "Agendar"}
            disabled={!horarioSelecionado || agendarLoading}
            className="ease-out bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-lg p-1 w-1/2 shadow-lg shadow-neutral-500"
          />
        </form>
      </div>
    </div>
  );
}

export default HorariosMedico;
