import { useEffect, useState } from "react";
import { apiPrivate } from "../services/api";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import GerenciarHorarios from "../components/GerenciarHorarios";
import ConsultasMarcadas from "../components/ConsultasMarcadas";
import ConsultaModal from "../components/ConsultaModal";
import { IoIosArrowRoundBack } from "react-icons/io";
import { HiOutlineClock } from "react-icons/hi";
import { Spinner } from "../components/Spinner";
import { toast } from "sonner";

function ConsultaScreen() {
  const [consultas, setConsultas] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const isMedico = sessionStorage.getItem("role") === "[ROLE_MEDICO]";
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();

  async function getConsultas() {
    let consultasApi;

    setLoading(true);
    try {
      if (sessionStorage.getItem("role") === "[ROLE_MEDICO]") {
        consultasApi = await apiPrivate.get(
          "/api/v1/consultas/medico/minhasConsultas",
        );
      } else {
        consultasApi = await apiPrivate.get(
          "/api/v1/consultas/cliente/minhasConsultas",
        );
      }

      setConsultas(consultasApi?.data?.content ?? []);
    } catch (error) {
      toast.error("Erro ao buscar consultas.");
    } finally {
      setLoading(false);
    }
  }

  async function getConsulta() {
    try {
      const response = await apiPrivate.get(`/api/v1/consultas/${id}`);
      setConsultaSelecionada(response?.data);
    } catch (error) {
      toast.error("Erro ao buscar consulta.");
      navigate("/consultas");
    }
  }

  function open() {
    setOpen(!isOpen);
  }

  useEffect(() => {
    if (id) {
      getConsulta();
    } else {
      setConsultaSelecionada(null);
    }
  }, [id]);

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

        <div className="h-fit w-2/3 justify-center text-center self-center flex flex-col gap-6">
          {loading ? (
            <Spinner />
          ) : consultas.length == 0 ? (
            "Nenhuma consulta encontrada."
          ) : (
            <ConsultasMarcadas
              consultas={consultas}
              getConsultas={getConsultas}
              setConsultaSelecionada={setConsultaSelecionada}
            />
          )}
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
          setConsultaSelecionada={setConsultaSelecionada}
          onClose={() => {
            (setConsultaSelecionada(null), navigate("/consultas"));
          }}
          getConsultas={getConsultas}
        />
      )}
    </div>
  );
}

export default ConsultaScreen;
