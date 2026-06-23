import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { apiPrivate } from "../services/api";
import HorariosMedico from "./HorariosMedico";
import { Spinner } from "./Spinner";
import { toast } from "sonner";

function GerenciarHorarios({ isOpen, medicoId, onClose }) {
  const [horarios, setHorarios] = useState([]);
  const [horarioForm, setHorarioForm] = useState({
    diaSemana: "",
    horarioInicio: "",
    horarioFinal: "",
    duracao: "",
    ativo: true,
  });
  const [loading, setLoading] = useState(false);
  const [horariosLoading, setHorariosLoading] = useState(false);

  async function criarHorario(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPrivate.post("/api/v1/medicos/horarios", horarioForm, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      limparHorario();
      getHorarios();
      toast.success("Horário criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar horário.");
    } finally {
      setLoading(false);
    }
  }

  function limparHorario() {
    setHorarioForm({
      diaSemana: "",
      horarioInicio: "",
      horarioFinal: "",
      duracao: "",
      ativo: true,
    });
  }

  async function getHorarios() {
    setHorariosLoading(true);
    try {
      const response = await apiPrivate.get(
        `/api/v1/medicos/${medicoId}/horarios`,
      );

      setHorarios(response.data);
    } catch (error) {
      toast.error("Erro ao buscar horários");
    } finally {
      setHorariosLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen && medicoId) {
      getHorarios();
    }
  }, [isOpen, medicoId]);

  return (
    <div
      className="fixed z-50 flex items-center justify-center inset-0 backdrop-blur-sm bg-black/30"
      onClick={onClose}
    >
      <div
        className="overflow-y-auto p-8 bg-neutral-200 h-full relative max-h-140 w-fit rounded-2xl flex flex-col gap-8 shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-3xl right-1 top-1 cursor-pointer absolute hover:scale-110 transition-all duration-300 ease-out"
          onClick={onClose}
        >
          <IoCloseOutline />
        </button>

        <h1 className="font-mono text-4xl font-black text-center">
          Gerenciar Horários
        </h1>
        <form className="flex flex-col" onSubmit={criarHorario}>
          <div className="flex gap-8 self-center">
            <select
              className="rounded-md border-2 w-1/5 self-center"
              value={horarioForm.diaSemana}
              onChange={(e) =>
                setHorarioForm({ ...horarioForm, diaSemana: e.target.value })
              }
            >
              <option value="SEGUNDA">Segunda</option>
              <option value="TERCA">Terça</option>
              <option value="QUARTA">Quarta</option>
              <option value="QUINTA">Quinta</option>
              <option value="SEXTA">Sexta</option>
              <option value="SABADO">Sábado</option>
              <option value="DOMINGO">Domingo</option>
            </select>

            <input
              type="time"
              name="horaInicio"
              id="horaInicio"
              className="border-2 rounded-lg p-0.5"
              placeholder="Horario Início"
              value={horarioForm.horarioInicio}
              onChange={(e) =>
                setHorarioForm({
                  ...horarioForm,
                  horarioInicio: e.target.value,
                })
              }
            />

            <input
              type="time"
              name="horaFinal"
              id="horaFinal"
              className="border-2 rounded-lg p-0.5"
              placeholder="Horario Final"
              value={horarioForm.horarioFinal}
              onChange={(e) =>
                setHorarioForm({ ...horarioForm, horarioFinal: e.target.value })
              }
            />

            <select
              className="rounded-md border-2 w-1/5 self-center"
              name="duracao"
              id="duracao"
              value={horarioForm.duracao}
              onChange={(e) =>
                setHorarioForm({ ...horarioForm, duracao: e.target.value })
              }
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="45">45</option>
              <option value="60">60</option>
            </select>
          </div>
          <input
            type="submit"
            value={loading ? "Salvando..." : "Salvar"}
            disabled={loading}
            className="ease-out bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 w-47 mt-8 shadow-lg shadow-neutral-500"
          />
        </form>

        <hr />
        <h1 className="font-mono text-3xl font-bold text-center">
          Meus Horários
        </h1>
        <div className="self-center w-full flex flex-col items-center  gap-6">
          {horariosLoading ? (
            <Spinner />
          ) : (
            horarios && (
              <HorariosMedico
                horarios={horarios}
                setHorarioForm={setHorarioForm}
                getHorarios={getHorarios}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default GerenciarHorarios;
