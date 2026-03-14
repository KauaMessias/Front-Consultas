import { useRef } from "react";
import { useNavigate } from "react-router";
import { apiPublic } from "../services/api";
import { useState } from "react";

function RegisterScreen() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("Cliente");
  const [usuarioForm, setUsuarioForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    especialidade: "",
    crm: "",
    cpf: "",
  });
  let campos;

  async function registrar(e) {
    e.preventDefault();
    if (tipo === "Cliente") {
      await apiPublic.post("/api/v1/clientes", usuarioForm, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    } else {
      await apiPublic.post("/api/v1/medicos", usuarioForm, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
    }
    navigate("/login");
  }

  if (tipo === "Cliente") {
    campos = (
      <input
        type="text"
        placeholder="Cpf"
        onChange={(e) => {
          setUsuarioForm({ ...usuarioForm, cpf: e.target.value });
        }}
        className="border rounded-xl pl-1 w-full flex items-center focus:border-2 focus:outline-none shadow-md shadow-neutral-400 bg-neutral-100"
      />
    );
  } else {
    campos = (
      <div className="w-full flex flex-col gap-6">
        <input
          type="text"
          placeholder="Crm"
          onChange={(e) => {
            setUsuarioForm({ ...usuarioForm, crm: e.target.value });
          }}
          className="border rounded-xl pl-1 w-full flex items-center focus:border-2 focus:outline-none shadow-md shadow-neutral-400 bg-neutral-100"
        />
        <input
          type="text"
          placeholder="Especialidade"
          onChange={(e) => {
            setUsuarioForm({ ...usuarioForm, especialidade: e.target.value });
          }}
          className="border rounded-xl pl-1 w-full flex items-center focus:border-2 focus:outline-none shadow-md shadow-neutral-400 bg-neutral-100"
        />
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 w-screen h-screen flex justify-center items-center">
      <div className="bg-neutral-300 rounded-2xl h-2/3 w-1/3 flex flex-col gap-8">
        <h1 className="font-mono text-5xl font-black pt-14 text-center">
          Criar Usuário
        </h1>

        <select
          name="tipo"
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border-2 w-1/5 self-center"
        >
          <option value="Médico">Médico</option>
          <option value="Cliente">Cliente</option>
        </select>

        <form
          onSubmit={registrar}
          className="flex flex-col gap-6 w-2/5 self-center"
        >
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email"
            onChange={(e) => {
              setUsuarioForm({ ...usuarioForm, email: e.target.value });
            }}
            className="border rounded-xl pl-1 w-full flex items-center focus:border-2 focus:outline-none shadow-md shadow-neutral-400 bg-neutral-100"
          />

          <input
            type="password"
            name="password"
            id="password"
            placeholder="Senha"
            onChange={(e) => {
              setUsuarioForm({ ...usuarioForm, senha: e.target.value });
            }}
            className="border rounded-xl pl-1 w-full flex items-center focus:border-2 focus:outline-none shadow-md shadow-neutral-400 bg-neutral-100"
          />

          <input
            type="text"
            placeholder="Nome"
            onChange={(e) =>
              setUsuarioForm({ ...usuarioForm, nome: e.target.value })
            }
            className="border rounded-xl pl-1 w-full flex items-center focus:border-2 focus:outline-none shadow-md shadow-neutral-400 bg-neutral-100"
          />

          <input
            type="text"
            placeholder="Telefone"
            onChange={(e) =>
              setUsuarioForm({ ...usuarioForm, telefone: e.target.value })
            }
            className="border rounded-xl pl-1 w-full flex items-center focus:border-2 focus:outline-none shadow-md shadow-neutral-400 bg-neutral-100"
          />

          {campos}

          <input
            type="submit"
            value="Criar"
            className="bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:scale-105 transition-all duration-200 text-neutral-300 rounded-md p-1 w-47 mt-8 shadow-lg shadow-neutral-500"
          />
        </form>
      </div>
    </div>
  );
}

export default RegisterScreen;
