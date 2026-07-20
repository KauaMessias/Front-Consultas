import { useState } from "react";
import { apiPublic } from "../services/api";
import { Navigate, useParams } from "react-router";
import { toast } from "sonner";
import { useNavigate } from "react-router";

function RecuperarSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [formatoInvalido, setFormatoInvalido] = useState(false);
  const [loading, setLoading] = useState(false);
  const senhasIguais = novaSenha !== "" && novaSenha === confirmarSenha;
  const navigate = useNavigate();
  const { id } = useParams();

  async function alterarSenha(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPublic.post(
        `/api/v1/auth/recuperarSenha/${id}`,
        { senha: novaSenha },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        },
      );
      toast.success("Senha redefinida com sucesso!");
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 400) {
        setFormatoInvalido(true);
        toast.error("Preencha os campos no formato indicado.");
      } else {
        toast.error("Erro ao redefinir senha.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-neutral-950 w-screen h-screen flex justify-center items-center">
      <div className="bg-slate-100 flex flex-col gap-6 py-8 px-16 rounded-lg">
        <h1 className="font-mono text-3xl font-semibold text-center">
          Recuperar Senha
        </h1>

        <form onSubmit={alterarSenha}>
          <div className="flex flex-col gap-1">
            <span>Nova Senha</span>
            <input
              className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${senhasIguais === false || formatoInvalido ? "border-red-700" : ""}`}
              type="password"
              name="senha"
              placeholder="Senha"
              id="senha"
              required
              onChange={(e) => {
                setNovaSenha(e.target.value);
                setFormatoInvalido(false);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <span>Confirmar Senha</span>
            <input
              className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${senhasIguais === false || formatoInvalido ? "border-red-700" : ""}`}
              type="password"
              name="confirmarSenha"
              placeholder="Confirmar Senha"
              id="confirmarSenha"
              required
              onChange={(e) => {
                setConfirmarSenha(e.target.value);
                setFormatoInvalido(false);
              }}
            />
            <p className="text-[11px] leading-tight text-neutral-500">
              Use 8+ caracteres com maiúscula, <br />
              minúscula, número e símbolo.
            </p>
          </div>
          <button
            className="bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 w-40 mt-2 shadow-lg shadow-neutral-500"
            disabled={!senhasIguais && loading}
            type="submit"
          >
            {loading ? "Salvando..." : "Salvar Senha"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecuperarSenha;
