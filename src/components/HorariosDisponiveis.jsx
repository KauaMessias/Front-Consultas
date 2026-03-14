import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";

import { apiPrivate } from "../services/api";

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

  const [horarioSelecionado, setHorarioSelecionado] = useState("");

  async function buscarHorarios(dataSelecionada) {
    setHorarios([]);
    const response = await apiPrivate.get(
      `/api/v1/medicos/${medico.id}/horarios/disponiveis`,
      {
        params: {
          data: dataSelecionada,
        },
      },
    );
    setHorarios(response.data);
  }

  async function agendarConsulta() {
    await apiPrivate.post("/api/v1/consultas", consultaForm);
    limparConsulta();
    onClose();
  }

  function mostrarHorario(horario) {
    return (
      <input
        key={horario.horario}
        className={`border border-neutral-500/80 shadow-md hover:scale-110 transition-all ease-out rounded-md p-0.5 bg-neutral-100 duration-300 cursor-pointer hover:shadow-lg
        ${horarioSelecionado?.horario === horario.horario ? "bg-neutral-950 border-neutral-500/80 shadow-lg scale-105 text-neutral-200" : ""}`}
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
    <div className="fixed w-5/12 h-1/2 rounded-2xl bg-neutral-200 flex flex-col p-2 gap-8 items-center shadow-lg ">
      <header className="flex justify-end w-full">
        <button
          className="hover:scale-110 transition-all duration-300 ease-out"
          onClick={onClose}
        >
          <IoCloseOutline />
        </button>
      </header>
      <form
        className="overflow-y-auto w-full h-full rounded-2xl p-4 bg-neutral-300 flex flex-col items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(consultaForm);
          agendarConsulta();
        }}
      >
        <h1 className="font-semibold text-2xl">{medico.nome}</h1>{" "}
        <h1 className="font-medium mb-4">{medico.especialidade}</h1>
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
              console.log(e.target.value);
            }
          }}
        />
        <div className="flex flex-wrap p-4 gap-3 justify-center">
          {!data ? null : horarios.length > 0 ? (
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
          className="border border-neutral-300 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
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
          className="border border-neutral-300 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
          onChange={(e) => {
            setConsultaForm({
              ...consultaForm,
              descricaoConsulta: e.target.value,
            });
          }}
        />
        <input
          type="submit"
          value="Agendar"
          disabled={!horarioSelecionado}
          className="ease-out bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:scale-105 transition-all duration-200 text-neutral-300 rounded-lg p-1 w-fit shadow-lg shadow-neutral-500"
        />
      </form>
    </div>
  );
}

export default HorariosMedico;
