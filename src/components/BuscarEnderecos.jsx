import { apiPrivate } from "../services/api";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import { HiOutlineTrash } from "react-icons/hi2";

function BuscarEnderecos({
  enderecos,
  getEnderecos,
  preencherForm,
  limparCampos,
}) {
  async function removerEndereco(id) {
    if (!window.confirm("Tem certeza de que deseja remover este endereço?"))
      return;
    try {
      await apiPrivate.delete(`/api/v1/enderecos/${id}`);
      limparCampos();
      getEnderecos();
    } catch (error) {
      window.alert("falha ao remover o endereço!");
    }
  }

  async function alterarPrincial(id) {
    try {
      await apiPrivate.patch(`/api/v1/enderecos/${id}`);
      getEnderecos();
    } catch (error) {
      window.alert("Falha ao tentar mudar o endereço principal");
    }
  }

  return enderecos.map((endereco) => (
    <div
      onClick={() => preencherForm(endereco)}
      className="transform-view focus:scale-200 justify-between flex gap-6 ease-out w-4/5 bg-neutral-200 p-4 rounded-2xl shadow-md shadow-neutral-500  hover:shadow-neutral-700 hover:scale-105 transition-all duration-300 cursor-pointer"
      key={endereco.id}
    >
      <span className="font-semibold">{endereco.cidade}</span>
      <span className="text-sm text-gray-600">
        {endereco.bairro}, {endereco.rua}, {endereco.numero}
      </span>
      <div className="flex items-center gap-4">
        <button
          className="cursor-pointer text-2xl"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removerEndereco(endereco.id);
          }}
        >
          <HiOutlineTrash />
        </button>
        <button
          className="cursor-pointer text-2xl"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            alterarPrincial(endereco.id);
          }}
        >
          {" "}
          {endereco.principal ? <IoIosStar /> : <IoIosStarOutline />}
        </button>
      </div>
    </div>
  ));
}

export default BuscarEnderecos;
