import { useState } from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { Link } from "react-router";
import { toast } from "sonner";
import { apiPublic } from "../services/api";

function EnviarRecuperacao() {
  const [enviado, setEnviado] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function enviarEmail() {
    setLoading(true);
    try {
      await apiPublic.post(`/api/v1/auth/enviarRecuperacao/${email}`);
      console.info(email);
      toast.success("Solicitação enviada.");
      setEnviado(true);
    } catch (error) {
      toast.error("Erro ao enviar solicitação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-neutral-950 w-screen h-screen flex justify-center items-center">
      {!enviado ? (
        <div className="bg-slate-100 p-10 rounded-lg flex flex-col text-center gap-8">
          <h1 className="font-mono text-3xl font-semibold text-center">
            Redefinir Senha
          </h1>

          <span className="text-sm leading-tight text-neutral-800">
            Para redefinir sua senha, <br /> informe o endereço de e-mail
            cadastrado.
          </span>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            required
            className="border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            className="bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 w-40 mt-2 shadow-lg shadow-neutral-500"
            disabled={loading}
            onClick={enviarEmail}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
          <Link
            className="text-sm text-neutral-700 hover:text-black cursor-pointer hover:underline transition"
            to="/login"
          >
            Cancelar
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center gap-4">
          <IoCheckmarkCircleOutline className="text-green-800 text-6xl" />
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-neutral-50">Sucesso!</h1>
            <p className="text-neutral-400 text-xl">
              Solicitação enviada. Verifique seu e-mail.
            </p>
          </div>
          <Link
            className="text-neutral-100 cursor-pointer bg-neutral-800 w-fit self-center rounded-lg py-2 px-4 font-semibold shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
            to="/login"
          >
            Voltar ao login
          </Link>
        </div>
      )}
    </div>
  );
}

export default EnviarRecuperacao;
