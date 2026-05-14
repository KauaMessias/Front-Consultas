import { useEffect, useState } from "react";
import { apiPrivate } from "../services/api";
import { Link, NavLink, useNavigate } from "react-router";
import CardHome from "../components/CardHome";
import { LuCalendarPlus } from "react-icons/lu";
import { HiOutlineClipboardList } from "react-icons/hi";
import { AiOutlineUser } from "react-icons/ai";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoExitOutline } from "react-icons/io5";
import { Spinner } from "../components/Spinner";

function HomeScreen() {
  const [user, setUser] = useState(null);
  const [consultas, setConsultas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingNome, setLoadingNome] = useState(false);
  const navigate = useNavigate();
  const isMedico = sessionStorage.getItem("role") === "[ROLE_MEDICO]";
  async function getUser() {
    let userApi;
    setLoadingNome(true);

    try {
      if (!isMedico) {
        userApi = await apiPrivate.get("/api/v1/clientes/perfil");
      } else {
        userApi = await apiPrivate.get("/api/v1/medicos/perfil");
      }
      sessionStorage.setItem("id", userApi.data.id);
      setUser(userApi.data);
    } catch (error) {
    } finally {
      setLoadingNome(false);
    }
  }

  async function getConsultas() {
    let consultasApi;
    setLoading(true);
    try {
      if (!isMedico) {
        consultasApi = await apiPrivate.get(
          "/api/v1/consultas/cliente/minhasConsultas",
        );
      } else {
        consultasApi = await apiPrivate.get(
          "/api/v1/consultas/medico/minhasConsultas",
        );
      }

      setConsultas(consultasApi?.data?.content?.slice(0, 3));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await apiPrivate.post("/api/v1/auth/logout");
    } catch (error) {
    } finally {
      sessionStorage.clear();
      navigate("/login");
    }
  }

  useEffect(() => {
    getUser();
    getConsultas();
  }, []);

  return (
    <div className="bg-neutral-950 overflow-hidden w-screen h-screen flex flex-col items-center">
      <div className="bg-white/90 w-screen justify-between px-4 h-1/10 md:h-1/12 flex items-center relative ">
        <h1 className="text-2xl font-semibold z-10 flex gap-2">
          Olá, {loadingNome ? "Carregando..." : user?.nome}
        </h1>

        <nav className="flex gap-10 text-lg w-full font-semibold absolute justify-center">
          {isMedico ? (
            <NavLink
              to="/enderecos"
              className="ease-out hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <HiOutlineOfficeBuilding className="text-md" />
              Endereços
            </NavLink>
          ) : (
            <NavLink
              to="/agendar"
              className="ease-out hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <LuCalendarPlus className=" text-lg" /> Agendar Consulta
            </NavLink>
          )}

          <NavLink
            to="/consultas"
            className="ease-out hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <HiOutlineClipboardList className="text-xl" />
            Consultas
          </NavLink>
          <NavLink
            to="/perfil"
            className="ease-out hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <AiOutlineUser className="text-xl" />
            Perfil
          </NavLink>
        </nav>
        <button
          className="text-2xl font-semibold z-10 ease-out hover:scale-105 cursor-pointer transition-all duration-300 flex gap-2 items-center text-center"
          onClick={logout}
        >
          <IoExitOutline />
          Sair
        </button>
      </div>

      <div className="bg-white/90 md:w-2/3 w-fit h-fit md:h-2/3 m-auto flex flex-col p-6 text-center rounded-2xl">
        <h1 className="text-3xl font-semibold">Histórico de Consultas</h1>
        <div className="flex flex-col md:flex-row h-full justify-center gap-8 items-center">
          {loading ? (
            <Spinner />
          ) : consultas?.length > 0 ? (
            <CardHome consultas={consultas} />
          ) : (
            <h1 className="text-2xl">Nenhuma consulta encontrada</h1>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
