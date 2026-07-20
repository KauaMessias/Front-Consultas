import { useRef, useState } from "react";
import HomeScreen from "./HomeScreen";
import RegisterScreen from "./RegisterScreen";
import { apiPublic } from "../services/api";
import { useNavigate, Link } from "react-router";
import { IoEnterOutline } from "react-icons/io5";
import { toast } from "sonner";
import { Spinner } from "../components/Spinner";

function LoginScreen() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
  const [errorLogin, setErrorLogin] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await apiPublic.post("/api/v1/auth/login", loginForm);

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("role", response.data.role);
      setErrorLogin("");
      navigate("/home");
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorLogin(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-screen h-screen bg-neutral-950 flex justify-center items-center p-4">
      <div
        className="w-fit h-fit
       rounded-2xl flex flex-col gap-8 items-center p-8 bg-slate-100 text-center"
      >
        <h1 className="text-3xl font-semibold w-2/3">Entre com sua conta</h1>

        <form
          onSubmit={login}
          className="flex flex-col items-center mt-4 w-80 gap-10"
        >
          <div className="flex flex-col gap-1 w-2/3">
            <p className="self-start">Email</p>
            <input
              type="email"
              name="email"
              id="email"
              required
              placeholder="Digite seu email"
              onChange={(e) => {
                e.preventDefault();
                setLoginForm({ ...loginForm, email: e.target.value });
                setErrorLogin("");
              }}
              className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${errorLogin ? "border-red-700" : ""}`}
            />

            <p className="self-start mt-4">Senha</p>

            <input
              type="password"
              name="password"
              required
              id="password"
              placeholder="Digite sua senha"
              onChange={(e) => {
                e.preventDefault();
                setLoginForm({ ...loginForm, senha: e.target.value });
                setErrorLogin("");
              }}
              className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${errorLogin ? "border-red-700" : ""}`}
            />

            {errorLogin && (
              <p className="text-red-700">Login e/ou Senha inválidos</p>
            )}
          </div>{" "}
          <div className="flex flex-col w-2/3">
            <button
              type="submit"
              disabled={loading}
              className="bg-neutral-800 cursor-pointer hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 shadow-md shadow-neutral-500 flex items-center justify-center text-md gap-2"
            >
              <IoEnterOutline />
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>
        <div className="flex flex-col gap-4 w-2/3">
          <hr className="w-5/6 self-center text-neutral-400 " />
          <Link
            className="text-sm text-neutral-700 hover:text-black hover:underline transition"
            to="/registrar"
          >
            {" "}
            Cadastrar uma conta{" "}
          </Link>
          <Link
            className="text-sm text-neutral-700 hover:text-black cursor-pointer hover:underline transition"
            to="/enviarRecuperacao"
          >
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
