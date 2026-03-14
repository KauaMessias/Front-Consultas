import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { apiPrivate } from "../services/api";
import HorariosMedico from "./HorariosMedico";

function GerenciarHorarios({ isOpen, medicoId, onClose }) {
  const [horarios, setHorarios] = useState([]);
  const [horarioForm, setHorarioForm] = useState({
    diaSemana: "",
    horarioInicio: "",
    horarioFinal: "",
    duracao: "",
    ativo: true,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await apiPrivate.post("/api/v1/medicos/horarios", horarioForm, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    limparHorario();
    getHorarios();
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
    const response = await apiPrivate.get(
      `/api/v1/medicos/${medicoId}/horarios`,
    );

    setHorarios(response.data);
  }

  useEffect(() => {
    if (isOpen && medicoId) {
      getHorarios();
    }
  }, [isOpen, medicoId]);

  return (
    <div className="fixed overflow-y-auto  bg-neutral-200 h-2/3 w-3/5 p-2 pb-8 rounded-2xl flex flex-col gap-8 shadow-2xl">
      <header className="flex justify-end w-full">
        <button
          className="h-5 w-5 hover:scale-110 transition-all duration-300 ease-out"
          onClick={onClose}
        >
          <IoCloseOutline />
        </button>
      </header>

      <h1 className="font-mono text-5xl font-black mt-14 text-center">
        Gerenciar Horários
      </h1>
      <form className="flex flex-col" onSubmit={handleSubmit}>
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
              setHorarioForm({ ...horarioForm, horarioInicio: e.target.value })
            }
          />

          <input
            type="time"
            name="horarFinal"
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
          value="Salvar"
          className="ease-out bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:scale-105 transition-all duration-200 text-neutral-300 rounded-md p-1 w-47 mt-8 shadow-lg shadow-neutral-500"
        />
      </form>

      <hr />
      <h1 className="font-mono text-3xl font-bold text-center">
        Meus Horários
      </h1>
      <div className="self-center w-full flex flex-col items-center  gap-6">
        {horarios && (
          <HorariosMedico
            horarios={horarios}
            setHorarioForm={setHorarioForm}
            getHorarios={getHorarios}
          />
        )}
      </div>
    </div>
  );
}

export default GerenciarHorarios;
