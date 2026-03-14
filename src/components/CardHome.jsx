import { IoMdCalendar } from "react-icons/io";
import { useNavigate } from "react-router";

function CardHome({ consultas }) {
  const role = sessionStorage.getItem("role");
  const navigate = useNavigate();

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
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  return consultas.map((consulta) => (
    <div
      key={consulta.id}
      className={`flex flex-col justify-center bg-neutral-100 w-1/4 py-8 rounded-2xl shadow-md shadow-neutral-500  hover:shadow-neutral-700 
        hover:scale-105 transition-all duration-300 gap-12 cursor-pointer ease-out f ${statusConsulta(consulta.status)}`}
      onClick={() =>
        navigate("/consultas", { state: { consultaSelecionada: consulta } })
      }
    >
      <div className="flex flex-col items-center gap-12">
        {role === "[ROLE_CLIENTE]" ? (
          <div className="flex flex-col justify-center gap-2">
            <h1 className="font-bold text-xl">{consulta.nomeMedico}</h1>{" "}
            <h1 className="font-semibold text-lg rounded-2xl bg-neutral-300/70">
              {consulta.especialidade}
            </h1>
          </div>
        ) : (
          <div className="flex justify-center gap-2">
            <h1 className="font-bold text-xl">{consulta.nomeCliente}</h1>{" "}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-neutral-800">
          <IoMdCalendar className="text-xl" />
          <span className="font-semibold text-lg">
            {formatarData(consulta.data)}
          </span>
        </div>

        <hr className="w-11/12 self-center" />
        <span
          className={`font-semibold text-lg rounded-xl p-1 ${
            consulta.status === "PENDENTE"
              ? "text-yellow-600/70"
              : consulta.status === "CONCLUIDA"
                ? "text-green-800/70 bg-green-200/40"
                : "text-red-800/70 bg-red-200/40"
          }`}
        >
          {consulta.status}
        </span>
      </div>
    </div>
  ));
}

export default CardHome;
