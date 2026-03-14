import { useEffect, useState } from "react";
import { apiPrivate } from "../services/api";

import { IoCloseOutline } from "react-icons/io5";

function ConsultaModal({ consulta, onClose }) {
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

  useEffect(() => {
    buscarUsuarioRelacionado();
  }, []);

  return (
    <div
      className={`w-fit h-fit py-8 px-16  gap-12 bg-neutral-200 absolute  flex flex-col rounded-2xl shadow-md ${statusConsulta(consulta.status)}`}
    >
      <header className="flex justify-end">
        <button
          className="text-5xl right-0 top-0 cursor-pointer absolute hover:scale-110 transition-all duration-300 ease-out"
          onClick={onClose}
        >
          <IoCloseOutline />
        </button>
      </header>

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
            <p>{consulta.descricao}</p>
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
            <p className="flex font-semibold">{usuarioRelacionado.nome}</p>
          </div>

          {isMedico ? (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-neutral-400/80">
                CPF
              </span>
              <p> {usuarioRelacionado.cpf}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-400/80">
                  ESPECIALIDADE
                </span>
                <p>{usuarioRelacionado.especialidade}</p>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-400/80">
                  CRM
                </span>
                <p> {usuarioRelacionado.crm}</p>
              </div>
            </>
          )}
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-neutral-400/80">
              EMAIL
            </span>
            <p> {usuarioRelacionado.email}</p>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-neutral-400/80">
              TELEFONE
            </span>
            <p> {usuarioRelacionado.telefone}</p>
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
                <p> {endereco.bairro}</p>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-400/80">
                  RUA
                </span>
                <p>
                  {endereco.rua}, {endereco.numero}
                </p>
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-400/80">
                  CEP
                </span>
                <p> {endereco.cep}</p>
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
        {consulta.status === "PENDENTE" && isMedico && (
          <div className="flex gap-16 text-neutral-100 p-4">
            <button className="w-full text-md rounded-lg text-white font-bold bg-green-800 p-2 shadow-md hover:bg-green-900 hover:scale-110 ease-out transition-all duration-300">
              Concluir
            </button>{" "}
            <button className="w-full text-md rounded-lg text-white font-bold bg-red-900 p-2 shadow-md hover:bg-red-950 hover:scale-110 ease-out transition-all duration-300">
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConsultaModal;
