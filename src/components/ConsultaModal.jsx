import { useEffect, useState } from "react";
import { apiPrivate } from "../services/api";
import { IoCloseOutline } from "react-icons/io5";
import {
  formatarCep,
  formatarCpf,
  formatarTelefone,
} from "../utils/formatters";
import { toast } from "sonner";
import { useParams } from "react-router";

function ConsultaModal({
  consulta,
  onClose,
  getConsultas,
  setConsultaSelecionada,
}) {
  const [usuarioRelacionado, setUsuarioRelacionado] = useState({});
  const [endereco, setEndereco] = useState({});
  const isMedico = sessionStorage.getItem("role") === "[ROLE_MEDICO]";

  async function buscarUsuarioRelacionado() {
    if (isMedico) {
      const clienteApi = await apiPrivate.get(
        `api/v1/clientes/${consulta.clienteId}`,
      );

      setUsuarioRelacionado(clienteApi.data);
    } else {
      const medicoApi = await apiPrivate.get(
        `api/v1/medicos/${consulta.medicoId}`,
      );
      setUsuarioRelacionado(medicoApi.data);
      setEndereco(medicoApi.data.enderecoPrincipal);
    }
  }

  function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  }

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

  async function cancelarConsulta(consultaId) {
    if (!window.confirm("Tem certeza de que deseja cancelar esta consulta?"))
      return;

    try {
      const consultaAtualizada = await apiPrivate.patch(
        `/api/v1/consultas/${consultaId}`,
        null,
        {
          params: {
            status: "CANCELADA",
          },
        },
      );

      setConsultaSelecionada(consultaAtualizada?.data);
      getConsultas();

      toast.success("Consulta cancelada com sucesso!");
    } catch (error) {
      toast.error("Erro ao cancelar a consulta.");
    }
  }

  async function concluirConsulta(consultaId) {
    if (!window.confirm("Tem certeza de que deseja concluir esta consulta?"))
      return;
    try {
      const consultaAtualizada = await apiPrivate.patch(
        `/api/v1/consultas/${consultaId}`,
        null,
        {
          params: {
            status: "CONCLUIDA",
          },
        },
      );

      setConsultaSelecionada(consultaAtualizada?.data);
      getConsultas();

      toast.success("Consulta concluida com sucesso!");
    } catch (error) {
      toast.error("Erro ao concluir a consulta.");
    }
  }

  useEffect(() => {
    buscarUsuarioRelacionado();
    getConsultas();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`w-fit h-fit p-8 gap-6 bg-neutral-200 relative flex flex-col rounded-2xl shadow-md ${statusConsulta(consulta.status)}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-0 top-0 text-4xl cursor-pointer hover:scale-110 transition-all duration-300 ease-out"
          onClick={onClose}
        >
          <IoCloseOutline />
        </button>

        <div className="flex flex-col gap-4">
          <h1 className="font-medium  text-neutral-500/80">
            Informações da Consulta
          </h1>
          <div className="flex gap-24">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400/80">
                DATA E HORA
              </span>
              <p className="font-semibold">{formatarData(consulta.data)}</p>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400/80">
                TIPO
              </span>
              <p>{consulta.tipo}</p>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400/80">
                DESCRIÇÃO
              </span>
              <p>{consulta?.descricao || "carregando..."}</p>
            </div>
          </div>
        </div>

        <hr className="w-full self-center text-neutral-400/80 " />

        <div className="flex flex-col gap-4">
          <h1 className="font-medium  text-neutral-500/80">
            {isMedico ? "Informações do Cliente" : "Informações do Médico"}
          </h1>
          <div className="flex gap-16">
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400/80">
                NOME
              </span>
              <p className="flex font-semibold">
                {usuarioRelacionado?.nome || "carregando..."}
              </p>
            </div>

            {isMedico ? (
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-400/80">
                  CPF
                </span>
                <p>
                  {" "}
                  {formatarCpf(usuarioRelacionado?.cpf || "") ||
                    "carregando..."}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-400/80">
                    ESPECIALIDADE
                  </span>
                  <p>{usuarioRelacionado?.especialidade || "carregando..."}</p>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-400/80">
                    CRM
                  </span>
                  <p> {usuarioRelacionado?.crm || "carregando..."}</p>
                </div>
              </>
            )}
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400/80">
                EMAIL
              </span>
              <p> {usuarioRelacionado?.email || "carregando..."}</p>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400/80">
                TELEFONE
              </span>
              <p>{formatarTelefone(usuarioRelacionado?.telefone || "")}</p>
            </div>
          </div>
        </div>

        {!isMedico && (
          <>
            <hr className="w-full text-neutral-400/80 " />
            <div className=" flex flex-col gap-4">
              <h1 className="font-medium  text-neutral-500/80">
                Endereço da Consulta
              </h1>

              <div className="flex gap-24">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-400/80">
                    BAIRRO
                  </span>
                  <p> {endereco?.bairro || "carregando..."}</p>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-400/80">
                    RUA
                  </span>
                  <p>
                    {endereco?.rua || "carregando..."},{" "}
                    {endereco?.numero || "carregando..."}
                  </p>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-400/80">
                    CEP
                  </span>
                  <p> {formatarCep(endereco?.cep || "") || "carregando..."}</p>
                </div>
              </div>
            </div>
          </>
        )}

        <hr className="w-full self-center text-neutral-400/80" />
        <div className="flex justify-between gap-8 ">
          <div className="flex flex-col gap-2">
            <h1 className="font-medium text-neutral-500/70">
              Status da Consulta
            </h1>
            <p
              className={`font-semibold text-lg rounded-xl p-1 w-fit ${
                consulta.status === "PENDENTE"
                  ? "text-yellow-600 bg-yellow-200/40"
                  : consulta.status === "CONCLUIDA"
                    ? "text-green-800 bg-green-200"
                    : "text-red-800 bg-red-200"
              }`}
            >
              {consulta.status}
            </p>
          </div>
          {consulta.status === "PENDENTE" && (
            <div className="flex gap-16 text-neutral-100 p-4">
              {isMedico && (
                <button
                  onClick={() => {
                    concluirConsulta(consulta.id);
                  }}
                  className="w-full text-md rounded-lg text-white font-bold bg-green-800 p-2 shadow-md hover:bg-green-900 hover:-translate-y-0.5 active:scale-95 ease-out transition-all duration-300"
                >
                  Concluir
                </button>
              )}

              <button
                onClick={() => {
                  cancelarConsulta(consulta.id);
                }}
                className="w-full text-md rounded-lg text-white font-bold bg-red-900 p-2 shadow-md hover:bg-red-950 hover:-translate-y-0.5 active:scale-95 ease-out transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConsultaModal;
