import { useEffect, useState } from "react";
import { apiPrivate } from "../services/api";
import { Link, useLocation } from "react-router";
import GerenciarHorarios from "../components/GerenciarHorarios";
import ConsultasMarcadas from "../components/ConsultasMarcadas";
import ConsultaModal from "../components/ConsultaModal";
import { IoIosArrowRoundBack } from "react-icons/io";
import { HiOutlineClock } from "react-icons/hi";

function ConsultaScreen() {
  const [consultas, setConsultas] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const isMedico = sessionStorage.getItem("role") === "[ROLE_MEDICO]";
  const location = useLocation();

  async function getConsultas() {
    let consultasApi;

    if (sessionStorage.getItem("role") === "[ROLE_MEDICO]") {
      consultasApi = await apiPrivate.get(
        "/api/v1/consultas/medico/minhasConsultas",
      );
    } else {
      consultasApi = await apiPrivate.get(
        "/api/v1/consultas/cliente/minhasConsultas",
      );
    }

    setConsultas(consultasApi.data.content);
  }

  function open() {
    setOpen(!isOpen);
  }

  useEffect(() => {
    if (location.state?.consultaSelecionada) {
      setConsultaSelecionada(location.state.consultaSelecionada);
    }
  }, [location.state]);

  useEffect(() => {
    getConsultas();
  }, []);
  return (
    <div className="bg-neutral-950 w-screen h-screen flex justify-center items-center">
      <div className="bg-neutral-300 overflow-y-auto pb-4 w-2/3 h-4/5 rounded-2xl flex flex-col gap-20">
        <header className="flex flex-col items-center relative pt-14 gap-8">
          <h1 className="text-5xl font-bold text-center w-full">
            Minhas Consultas
          </h1>
          {isMedico && (
            <div
              className="flex items-center gap-2 text-2xl hover:scale-110 transition-all duration-300 ease-out font-medium bg-stone-400 hover:bg-stone-500 shadow-md p-2 rounded-2xl cursor-pointer"
              onClick={open}
            >
              <HiOutlineClock />
              Gerenciar Horários
            </div>
          )}
          <Link
            className="absolute right-0 top-0 text-6xl hover:scale-105 transition-all duration-300 ease-out"
            to={"/"}
          >
            <IoIosArrowRoundBack />
          </Link>
        </header>

        <div className="h-fit w-2/3 justify-center self-center flex flex-col gap-6">
          <ConsultasMarcadas
            consultas={consultas}
            getConsultas={getConsultas}
            setConsultaSelecionada={setConsultaSelecionada}
          />
        </div>
      </div>
      {isOpen && (
        <GerenciarHorarios
          isOpen={isOpen}
          medicoId={sessionStorage.getItem("id")}
          onClose={() => setOpen(!isOpen)}
        />
      )}

      {consultaSelecionada && (
        <ConsultaModal
          consulta={consultaSelecionada}
          onClose={() => setConsultaSelecionada(null)}
          getConsultas={getConsultas}
        />
      )}
    </div>
  );
}

export default ConsultaScreen;
