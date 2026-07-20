import { useParams, Link } from "react-router";
import { apiPublic } from "../services/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import { Spinner } from "../components/Spinner";

function ValidarCadastro() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [validado, setValidado] = useState(false);
  const [reenviando, setReenviando] = useState(false);

  async function validarEmail() {
    setLoading(true);
    try {
      await apiPublic.post(`/api/v1/auth/validarCadastro/${id}`);
      toast.success("Email confirmado com sucesso!");
      setValidado(true);
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        message === "USADO"
          ? (toast.info("Email já está confirmado."), setValidado(true))
          : (toast.info("Link de confirmação inválido."), setValidado(false));
      } else if (status === 404) {
        toast.error("Link de confirmação inválido.");
        setValidado(false);
      } else {
        toast.error("Erro ao confirmar email.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function reenviarValidacao() {
    setReenviando(true);
    try {
      await apiPublic.post(`/api/v1/auth/reenviarValidacao/${id}`);
      toast.success("Confirmação reenviada com sucesso!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Erro ao reenviar confirmação. Link inválido");
      } else {
        toast.error("Erro ao reenviar confirmação.");
      }
    } finally {
      setReenviando(false);
    }
  }

  useEffect(() => {
    if (id) {
      validarEmail();
    }
  }, [id]);

  return (
    <div className="bg-neutral-950 overflow-hidden w-screen h-screen flex flex-col items-center justify-center text-center gap-4">
      {loading ? (
        <Spinner className="text-white" />
      ) : (
        <>
          {validado ? (
            <IoCheckmarkCircleOutline className="text-green-800 text-6xl" />
          ) : (
            <IoWarningOutline className="text-red-800 text-6xl" />
          )}
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-neutral-50">
              {validado ? "Sucesso!" : "Erro"}
            </h1>
            <p className="text-neutral-400 text-xl">
              {validado
                ? "Seu email foi confirmado com sucesso."
                : "Falha ao confirmar seu email."}
            </p>
          </div>
          {validado ? (
            <Link
              to="/login"
              className="text-neutral-100 cursor-pointer bg-neutral-800 w-fit self-center rounded-lg py-2 px-4 font-semibold shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <IoIosArrowRoundBack className="text-xl" />
              Realizar login
            </Link>
          ) : (
            <button
              className="text-neutral-100 cursor-pointer bg-neutral-800 w-fit self-center rounded-lg py-2 px-4 font-semibold shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              onClick={reenviarValidacao}
              disabled={reenviando}
            >
              {reenviando ? "Reenviando..." : "Reenviar solicitação"}
            </button>
          )}
        </>
      )}
    </div>
  );
}
export default ValidarCadastro;
