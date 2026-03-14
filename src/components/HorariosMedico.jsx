import { FaRegTrashAlt } from "react-icons/fa";
import { IoPlay } from "react-icons/io5";
import { IoIosPause } from "react-icons/io";
import { apiPrivate } from "../services/api";

function HorarioMedico({ horarios, setHorarioForm, getHorarios }) {
  if (!horarios || horarios.length === 0) {
    return <p className="text-center">Nenhum horário cadastrado</p>;
  }

  async function alternarHorario(horarioId) {
    await apiPrivate.patch(`/api/v1/medicos/horarios/${horarioId}`);
    getHorarios();
  }

  async function deletarHorario(horarioId) {
    await apiPrivate.delete(`/api/v1/medicos/horarios/${horarioId}`);
    getHorarios();
  }

  return horarios.map((horario) => (
    <div
      key={horario.id}
      className={` invalid:border bg-neutral-100 flex justify-between items-center w-1/3 h-fit p-4 rounded-2xl shadow-md shadow-neutral-400 ease-out hover:shadow-neutral-700 hover:scale-105 transition-all duration-300 cursor-pointer
      ${!horario.ativo ? `border border-red-800 opacity-60` : ``}`}
      onClick={() => setHorarioForm(horario)}
    >
      <div className="flex flex-col gap-1.5">
        <span className="font-semibold">{horario.diaSemana}</span>
        <p className="text-sm text-gray-600">
          {horario.horarioInicio.slice(0, 5)} -{" "}
          {horario.horarioFinal.slice(0, 5)}
        </p>
        <span>Duracão: {horario.duracao} min</span>
      </div>
      <div className="flex flex-col gap-4">
        <button
          className="w-6 h-6"
          onClick={(e) => {
            e.stopPropagation();
            deletarHorario(horario.id);
          }}
        >
          <FaRegTrashAlt />
        </button>
        <button
          className="w-6 h-6"
          onClick={(e) => {
            e.stopPropagation();
            alternarHorario(horario.id);
          }}
        >
          {horario.ativo ? <IoIosPause /> : <IoPlay />}
        </button>
      </div>
    </div>
  ));
}

export default HorarioMedico;
