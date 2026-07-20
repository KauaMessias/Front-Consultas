import { useEffect, useState } from "react";
import { apiPrivate } from "../services/api";
import { useNavigate, Link } from "react-router";
import { IoIosArrowRoundBack } from "react-icons/io";
import { formatarTelefone } from "../utils/formatters";
import { Spinner } from "../components/Spinner";
import { toast } from "sonner";

function PerfilScreen() {
  const [usuario, setUsuario] = useState({
    id: "",
    email: "",
    nome: "",
    telefone: "",
    senha: null,
  });
  const isMedico = sessionStorage.getItem("role") === "[ROLE_MEDICO]";
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editarSenha, setEditarSenha] = useState(false);
  const [senha, setSenha] = useState({
    senha: "",
    senhaAtual: "",
    confirmarSenha: "",
  });
  const senhasIguais =
    senha.senha !== "" && senha.senha === senha.confirmarSenha;
  const navigate = useNavigate();
  const [camposInvalidos, setCamposInvalidos] = useState({});

  async function getUsuario() {
    let usuarioApi;

    if (isMedico) {
      usuarioApi = await apiPrivate.get(
        `/api/v1/medicos/${sessionStorage.getItem("id")}`,
      );
    } else {
      usuarioApi = await apiPrivate.get(
        `/api/v1/clientes/${sessionStorage.getItem("id")}`,
      );
    }

    setUsuario(usuarioApi.data);
  }

  useEffect(() => {
    getUsuario();
    console.log(senha.senha);
  }, []);

  async function editarUsuario(e) {
    let senhaAlterada;
    e.preventDefault();
    if (!window.confirm("Você realmente quer alterar seus dados?")) return;
    setUpdateLoading(true);

    try {
      if (isMedico) {
        await apiPrivate.put(`/api/v1/medicos/${usuario.id}`, usuario, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      } else {
        await apiPrivate.put(`/api/v1/clientes/${usuario.id}`, usuario, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }
      if (editarSenha) {
        senhaAlterada = await alterarSenha();

        if (!senhaAlterada) {
          setUpdateLoading(false);
          return;
        }
      }

      toast.success("Usuário editado com sucesso!");
      if (senhaAlterada) {
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      toast.error("Erro ao editar o usuário.");
    } finally {
      setUpdateLoading(false);
    }
  }

  async function excluirUsuario(e) {
    e.preventDefault();
    if (!window.confirm("Você realmente quer excluir sua conta?")) return;

    setDeleteLoading(true);
    try {
      if (isMedico) {
        await apiPrivate.delete(`/api/v1/medicos/${usuario.id}`);
      } else {
        await apiPrivate.delete(`/api/v1/clientes/${usuario.id}`);
      }
      toast.success("Usuário excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir o usuário.");
    } finally {
      setDeleteLoading(false);
      navigate("/login");
    }
  }

  async function alterarSenha() {
    if (!senhasIguais) {
      toast.error("Confirme a senha corretamente.");
      return false;
    }
    try {
      await apiPrivate.put("/api/v1/auth/alterarSenha", senha, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      toast.success("Dados alterados. Faça login novamente.");
      return true;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      if (status === 400) {
        setCamposInvalidos(error.response.data);
        toast.error("Formato de senha inválido.");
      } else {
        toast.error(message);
      }

      return false;
    }
  }

  return (
    <div className="bg-neutral-950 w-screen h-screen flex justify-center items-center">
      <div className="bg-slate-100 w-fit h-fit rounded-2xl relative flex flex-col p-16 gap-6">
        <header className="flex flex-col static gap-8">
          <Link
            className="absolute left-0 top-0 text-6xl hover:scale-105 transition-all duration-300 ease-out"
            to={"/home"}
          >
            <IoIosArrowRoundBack />
          </Link>

          <h1 className="text-4xl font-bold text-center w-full">
            Alterar Perfil
          </h1>
        </header>
        <form className="flex flex-col gap-6 " onSubmit={editarUsuario}>
          <div className="flex gap-10">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-500/80">
                  EMAIL
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Digite o email"
                  value={usuario.email}
                  disabled={true}
                  className="border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-500/80">
                  NOME
                </span>
                <input
                  type="text"
                  placeholder="Digite o nome"
                  value={usuario.nome}
                  onChange={(e) =>
                    setUsuario({ ...usuario, nome: e.target.value })
                  }
                  className="border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-semibold text-sm text-neutral-500/80">
                  TELEFONE
                </span>
                <input
                  type="text"
                  placeholder="Digite o telefone"
                  onChange={(e) => {
                    const digitos = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 11);
                    setUsuario({ ...usuario, telefone: digitos });
                  }}
                  value={formatarTelefone(usuario.telefone)}
                  className="border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
                />
              </div>
            </div>

            {editarSenha && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    SENHA ATUAL
                  </span>
                  <input
                    type="password"
                    name="senhaAtual"
                    id="senhaAtual"
                    placeholder="Confirme sua senha atual"
                    required
                    onChange={(e) =>
                      setSenha({ ...senha, senhaAtual: e.target.value })
                    }
                    className="border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    NOVA SENHA
                  </span>
                  <input
                    type="password"
                    name="novaSenha"
                    id="novaSenha"
                    placeholder="Digite sua nova senha"
                    required
                    onChange={(e) =>
                      setSenha({ ...senha, senha: e.target.value })
                    }
                    className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${senhasIguais === false || camposInvalidos.senha ? "border-red-700" : ""}`}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    CONFIRMAR SENHA
                  </span>
                  <input
                    type="password"
                    name="confirmarSenha"
                    id="confirmarSenha"
                    placeholder="Confirme a nova senha"
                    required
                    onChange={(e) =>
                      setSenha({ ...senha, confirmarSenha: e.target.value })
                    }
                    className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${senhasIguais === false || camposInvalidos.senha ? "border-red-700" : ""}`}
                  />
                </div>
                <p className="text-[11px] leading-tight text-neutral-500 self-center">
                  Use 8+ caracteres incluindo maiúscula, <br />
                  minúscula, número e símbolo.
                </p>
              </div>
            )}
          </div>

          <button
            className="text-sm text-neutral-700 hover:text-black cursor-pointer hover:underline transition"
            onClick={(e) => {
              e.preventDefault();
              setEditarSenha(!editarSenha);
              setSenha({
                senha: "",
                senhaAtual: "",
                confirmarSenha: "",
              });
            }}
          >
            {editarSenha ? "Cancelar alteração de senha" : "Alterar senha"}
          </button>
          <div className="flex flex-col gap-6 max-w-125 justify-between self-center">
            <input
              type="submit"
              value={updateLoading ? "Salvando..." : "Salvar"}
              disabled={updateLoading}
              className="bg-neutral-800 cursor-pointer hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 shadow-md shadow-neutral-500 flex items-center justify-center text-md"
            />
            <input
              type="button"
              value={deleteLoading ? "Excluindo..." : "Excluir Conta"}
              disabled={deleteLoading}
              onClick={excluirUsuario}
              className="cursor-pointer border border-bg-red-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-red-500 rounded-md p-1 shadow-md shadow-neutral-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PerfilScreen;
