import { apiPrivate } from "../services/api";
import { IoIosArrowRoundBack } from "react-icons/io";

function ConsultasMarcadas({
  consultas,
  getConsultas,
  setConsultaSelecionada,
}) {
  const role = sessionStorage.getItem("role");
  const isMedico = sessionStorage.getItem("role") === "[ROLE_MEDICO]";

  function statusConsulta(status) {
    switch (status) {
      case "PENDENTE":
        return "border-l-6 border-yellow-600";
      case "CONCLUIDA":
        return "border-l-6 border-green-900";
      case "CANCELADA":
        return "border-l-6 border-red-900";
      default:
        return "";
    }
  }

  function formatarData(dataConsulta) {
    return new Date(dataConsulta).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  }
  async function cancelarConsulta(consultaId) {
    if (!window.confirm("Tem certeza de que deseja cancelar esta consulta?"))
      return;

    await apiPrivate.patch(`/api/v1/consultas/${consultaId}`, null, {
      params: {
        status: "CANCELADA",
      },
    });
    getConsultas();
  }
  async function concluirConsulta(consultaId) {
    if (!window.confirm("Tem certeza de que deseja concluir esta consulta?"))
      return;
    await apiPrivate.patch(`/api/v1/consultas/${consultaId}`, null, {
      params: {
        status: "CONCLUIDA",
      },
    });
    getConsultas();
  }
  return consultas.map((consulta) => (
    <div
      key={consulta.id}
      className={`flex flex-col gap-2 w-3/5 self-center bg-neutral-100/80 shadow-sm hover:scale-105 p-4 transition-all ease-out rounded-md duration-300 cursor-pointer hover:shadow-lg
      ${statusConsulta(consulta.status)}`}
      onClick={() => setConsultaSelecionada(consulta)}
    >
      <div className="flex gap-4 h-full">
        <div className="flex flex-col border-r pr-4 border-neutral-300">
          <span className="text-neutral-500/80 text-xs font-black">
            DATA E HORA
          </span>
          <h2 className="font-medium">{formatarData(consulta.data)}</h2>
        </div>
        <div className="flex flex-col items-center gap-2 border-r w-2/5 pr-4 border-neutral-300">
          <span className="text-neutral-500/80 text-xs font-black">
            {role === "[ROLE_CLIENTE]" ? "MÉDICO RESPONSÁVEL" : "CLIENTE"}
          </span>
          <h2 className="font-semibold">
            {role === "[ROLE_CLIENTE]"
              ? consulta.nomeMedico
              : consulta.nomeCliente}
          </h2>
          {role === "[ROLE_CLIENTE]" && (
            <span className="text-xs font-medium text-neutral-900 bg-neutral-300/50 px-2 py-0.5 rounded-full w-fit mt-1">
              {consulta.especialidade}
            </span>
          )}
        </div>
        <div className="flex flex-col px-6 gap-2 ">
          <span
            className={`text-xs font-bold 
    ${
      consulta.status === "PENDENTE"
        ? " text-yellow-700"
        : consulta.status === "CONCLUIDA"
          ? " text-green-800"
          : " text-red-800"
    }`}
          >
            {consulta.status}
          </span>
          {isMedico && consulta.status === "PENDENTE" ? (
            <div className="flex flex-col gap-2 ">
              {role !== "[ROLE_CLIENTE]" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    concluirConsulta(consulta.id);
                  }}
                  className="w-full text-[10px] rounded-lg text-white font-bold bg-green-900 py-2 shadow-md hover:bg-green-950 transition-all duration-300"
                >
                  Concluir
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelarConsulta(consulta.id);
                }}
                className="w-full text-[10px] rounded-lg text-white font-bold bg-red-900 py-2 shadow-md hover:bg-red-950 transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  ));
}

export default ConsultasMarcadas;
