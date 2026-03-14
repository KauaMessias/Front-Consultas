import { useRef, useState } from "react";
import HomeScreen from "./HomeScreen";
import RegisterScreen from "./RegisterScreen";
import { apiPublic } from "../services/api";
import { useNavigate, Link } from "react-router";
import { IoEnterOutline } from "react-icons/io5";

function LoginScreen() {
  const navigate = useNavigate();
  const [loginForm, setLoginForm] = useState({ email: "", senha: "" });
  const [errorLogin, setErrorLogin] = useState("");

  async function login(e) {
    e.preventDefault();

    try {
      const response = await apiPublic.post("/api/v1/auth/login", loginForm);

      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("role", response.data.role);
      setErrorLogin("");
      console.log(sessionStorage.getItem("token"));
      navigate("/");
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorLogin(error.response.data);
      }
    }
  }

  return (
    <div className="w-screen h-screen bg-neutral-950 flex justify-center items-center p-6">
      <div
        className="w-3/10 h-4/6 p-2
       rounded-2xl flex flex-col gap-18 items-center bg-slate-100 text-center"
      >
        <h1 className="text-4xl font-semibold pt-14 w-2/3">
          Entre com sua conta
        </h1>

        <form
          onSubmit={login}
          className="flex flex-col items-center mt-4 w-80 gap-16"
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
          </div>

          <div className="flex flex-col gap-2 w-1/2">
            <button
              type="submit"
              className="bg-neutral-800 cursor-pointer hover:bg-neutral-900 hover:scale-105 transition-all duration-200 text-neutral-300 rounded-md p-1 shadow-lg shadow-neutral-500 flex items-center justify-center text-lg gap-2"
            >
              <IoEnterOutline />
              Entrar
            </button>

            <Link to="/registrar"> Cadastrar uma conta </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginScreen;
