import { useRef } from "react";
import { useNavigate } from "react-router";
import { apiPublic } from "../services/api";
import { useState } from "react";
import { formatarCpf, formatarTelefone } from "../utils/formatters";
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  const [camposInvalidos, setCamposInvalidos] = useState({});
  const [telefoneMask, setTelefoneMask] = useState("");
  let campos;

  async function registrar(e) {
    e.preventDefault();
    setLoading(true);
    console.log(usuarioForm.cpf);
    try {
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
      toast.success("Usuário criado com sucesso!");
      setCamposInvalidos({});
      navigate("/login");
    } catch (error) {
      if (error.response?.status === 400) {
        setCamposInvalidos(error.response.data);
        toast.error("Preencha os campos corretamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (tipo === "Cliente") {
    campos = (
      <input
        type="text"
        placeholder="Cpf"
        onChange={(e) => {
          const digitos = e.target.value.replace(/\D/g, "").slice(0, 11);
          setUsuarioForm({ ...usuarioForm, cpf: digitos });
          setCamposInvalidos({});
        }}
        maxLength={14}
        value={formatarCpf(usuarioForm.cpf)}
        className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.cpf ? "border-red-700" : ""}`}
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
            setCamposInvalidos({});
          }}
          className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.crm ? "border-red-700" : ""}`}
        />
        <input
          type="text"
          placeholder="Especialidade"
          onChange={(e) => {
            setUsuarioForm({ ...usuarioForm, especialidade: e.target.value });
            setCamposInvalidos({});
          }}
          className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.especialidade ? "border-red-700" : ""}`}
        />
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 w-screen h-screen flex justify-center items-center">
      <div className="bg-slate-100 rounded-2xl h-fit  w-fit p-8 flex flex-col gap-8">
        <h1 className="font-mono text-3xl font-semibold text-center">
          Criar Usuário
        </h1>

        <select
          name="tipo"
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-1/3 border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 self-center"
        >
          <option value="Médico">Médico</option>
          <option value="Cliente">Cliente</option>
        </select>

        <form
          onSubmit={registrar}
          className="flex flex-col gap-5 w-1/2 self-center"
        >
          <input
            type="email"
            name="email"
            id="email"
            required
            placeholder="Email"
            onChange={(e) => {
              setUsuarioForm({ ...usuarioForm, email: e.target.value });
              setCamposInvalidos({});
            }}
            className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.email ? "border-red-700" : ""}`}
          />

          <div className="flex flex-col gap-2">
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Senha@123"
              title="Mínimo de 8 caracteres, com letra maiúscula, minúscula, número e símbolo."
              onChange={(e) => {
                setUsuarioForm({ ...usuarioForm, senha: e.target.value });
                setCamposInvalidos({});
              }}
              className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.senha ? "border-red-700" : ""}`}
            />{" "}
            <p className="text-[11px] leading-tight text-neutral-500">
              Use 8+ caracteres com maiúscula, minúscula, número e símbolo.
            </p>
          </div>

          <input
            type="text"
            placeholder="Nome"
            onChange={(e) => {
              setUsuarioForm({ ...usuarioForm, nome: e.target.value });
              setCamposInvalidos({});
            }}
            className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.nome ? "border-red-700" : ""}`}
          />

          <input
            type="text"
            placeholder="Telefone"
            onChange={(e) => {
              const digitos = e.target.value.replace(/\D/g, "").slice(0, 11);
              setUsuarioForm({ ...usuarioForm, telefone: digitos });
              setCamposInvalidos({});
            }}
            value={formatarTelefone(usuarioForm.telefone)}
            className={`border border-neutral-400 rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.telefone ? "border-red-700" : ""}`}
          />

          {campos}

          <input
            type="submit"
            value={loading ? "Criando..." : "Criar"}
            disabled={loading}
            className="bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 text-neutral-300 rounded-md p-1 w-40 mt-2 shadow-lg shadow-neutral-500"
          />
        </form>
      </div>
    </div>
  );
}

export default RegisterScreen;
