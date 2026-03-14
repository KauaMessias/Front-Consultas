import { useEffect, useState } from "react";
import BuscarEnderecos from "../components/BuscarEnderecos";
import { apiPrivate } from "../services/api";
import { Link } from "react-router";
import { IoIosArrowRoundBack } from "react-icons/io";

function EnderecoScreen() {
  const [enderecos, setEnderecos] = useState([]);
  const [enderecoId, setEnderecoId] = useState(null);
  const [enderecoForm, setEnderecoForm] = useState({
    uf: "",
    cidade: "",
    cep: "",
    bairro: "",
    rua: "",
    numero: "",
  });
  const [camposInvalidos, setCamposInvalidos] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (enderecoId) {
        await apiPrivate.put(`api/v1/enderecos/${enderecoId}`, enderecoForm, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      } else {
        await apiPrivate.post("/api/v1/enderecos", enderecoForm, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }

      limparCampos();
      getEnderecos();
    } catch (error) {
      setCamposInvalidos(error.response?.data);
      window.alert("Preencha todos os campos!");
    }
  }

  function limparCampos() {
    setEnderecoForm({
      uf: "",
      cidade: "",
      cep: "",
      bairro: "",
      rua: "",
      numero: "",
    });

    setEnderecoId(null);
    setCamposInvalidos({});
  }

  async function getEnderecos() {
    const enderecosApi = await apiPrivate.get("/api/v1/enderecos");
    setEnderecos(enderecosApi.data.content ?? []);
  }

  function preencherForm(endereco) {
    setEnderecoForm({
      uf: endereco.uf,
      cidade: endereco.cidade,
      cep: endereco.cep,
      bairro: endereco.bairro,
      rua: endereco.rua,
      numero: endereco.numero,
    });

    setEnderecoId(endereco.id);
  }

  useEffect(() => {
    getEnderecos();
  }, []);

  return (
    <div className="w-screen h-screen bg-neutral-950 flex justify-center items-center">
      <div className="pb-8 overflow-y-auto w-1/2 h-4/5 rounded-2xl bg-neutral-300 flex flex-col gap-14">
        <header className="flex items-center relative pt-14">
          <h1 className="text-5xl font-bold text-center w-full">
            Gerenciar Endereços
          </h1>
          <Link
            className="absolute right-0 top-0 text-6xl hover:scale-110 transition-all duration-300 ease-out"
            to={"/"}
          >
            <IoIosArrowRoundBack />
          </Link>
        </header>

        <div className="flex flex-col gap-14">
          <div className="w-full flex flex-col">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-6  self-center"
            >
              <div className="flex gap-58 justify-between">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    UF
                  </span>
                  <select
                    id="UF"
                    name="UF"
                    className={`border  rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.uf ? "border-red-700" : "border-neutral-400"}`}
                    value={enderecoForm.uf}
                    onChange={(e) =>
                      setEnderecoForm({ ...enderecoForm, uf: e.target.value })
                    }
                  >
                    <option value="">UF</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MS">MS</option>
                    <option value="MT">MT</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    CEP
                  </span>
                  <input
                    type="text"
                    name="cep"
                    id="cep"
                    placeholder="cep"
                    value={enderecoForm.cep}
                    onChange={(e) =>
                      setEnderecoForm({ ...enderecoForm, cep: e.target.value })
                    }
                    className={`border  rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.cep ? "border-red-700" : "border-neutral-400"}`}
                  />
                </div>
              </div>

              <div className="flex gap-24">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    CIDADE
                  </span>
                  <input
                    type="text"
                    name="cidade"
                    id="cidade"
                    placeholder="cidade"
                    value={enderecoForm.cidade}
                    onChange={(e) =>
                      setEnderecoForm({
                        ...enderecoForm,
                        cidade: e.target.value,
                      })
                    }
                    className={`border  rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.cidade ? "border-red-700" : "border-neutral-400"}`}
                  />
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    BAIRRO
                  </span>
                  <input
                    type="text"
                    name="bairro"
                    id="bairro"
                    placeholder="bairro"
                    value={enderecoForm.bairro}
                    onChange={(e) =>
                      setEnderecoForm({
                        ...enderecoForm,
                        bairro: e.target.value,
                      })
                    }
                    className={`border  rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.bairro ? "border-red-700" : "border-neutral-400"}`}
                  />
                </div>
              </div>

              <div className="flex gap-24">
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    RUA
                  </span>
                  <input
                    type="text"
                    name="rua"
                    id="rua"
                    placeholder="rua"
                    value={enderecoForm.rua}
                    onChange={(e) =>
                      setEnderecoForm({ ...enderecoForm, rua: e.target.value })
                    }
                    className={`border  rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.rua ? "border-red-700" : "border-neutral-400"}`}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-sm text-neutral-500/80">
                    NÚMERO
                  </span>
                  <input
                    type="text"
                    name="numero"
                    id="numero"
                    placeholder="numero"
                    value={enderecoForm.numero}
                    onChange={(e) =>
                      setEnderecoForm({
                        ...enderecoForm,
                        numero: e.target.value,
                      })
                    }
                    className={`border  rounded-lg bg-neutral-100 focus:bg-white transition px-2 py-1 ${camposInvalidos.numero ? "border-red-700" : "border-neutral-400"}`}
                  />
                </div>
              </div>

              <div className="flex justify-evenly">
                <input
                  type="submit"
                  value="Salvar"
                  className="ease-out bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:scale-105 transition-all duration-200 text-neutral-300 rounded-md p-1 w-47 mt-8 shadow-lg shadow-neutral-500"
                />
                <input
                  type="button"
                  value="Limpar"
                  onClick={limparCampos}
                  className="ease-out bg-neutral-950 cursor-pointer self-center hover:bg-neutral-900 hover:scale-105 transition-all duration-200 text-neutral-300 rounded-md p-1 w-47 mt-8 shadow-lg shadow-neutral-500"
                />
              </div>
            </form>
          </div>
          <hr className="w-full" />
          <h1 className="font-mono text-3xl font-bold text-center">
            Meus Endereços
          </h1>
          <div className="flex flex-col justify-center items-center gap-6 w-5/6 self-center">
            <BuscarEnderecos
              enderecos={enderecos}
              getEnderecos={getEnderecos}
              preencherForm={preencherForm}
              limparCampos={limparCampos}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EnderecoScreen;
