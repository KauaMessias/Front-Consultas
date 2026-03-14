function BuscarMedicos({ medicos, setSelecionado }) {
  return medicos.map((medico) => (
    <div
      onClick={() => setSelecionado(medico)}
      className="transform-view focus:scale-200 flex gap-6 ease-out w-1/2 bg-neutral-200 p-4 rounded-2xl shadow-md shadow-neutral-500  hover:shadow-neutral-700 hover:scale-105 transition-all duration-300 cursor-pointer"
      key={medico.id}
    >
      <div className="flex flex-col border-r border-neutral-400/60 px-4">
        <span className="text-neutral-500/80 text-sm">MÉDICO</span>
        <p className="font-semibold">{medico.nome}</p>{" "}
        <p className="text-sm bg-neutral-400/60 text-center rounded-2xl px-2">
          {medico.especialidade}
        </p>{" "}
      </div>
      <div className="flex flex-col  border-r border-neutral-400/60 pr-6">
        <span className="text-neutral-500/80 text-sm">CRM</span>
        <p className="font-semibold">{medico.crm}</p>
      </div>
      <div className="flex flex-col">
        <span className="text-neutral-500/80 text-sm">ENDEREÇO</span>
        {medico.enderecoPrincipal ? (
          <>
            <p className="font-semibold">{medico.enderecoPrincipal?.cidade}</p>
            <p>
              {medico.enderecoPrincipal?.bairro},{" "}
              {medico.enderecoPrincipal?.rua},{" "}
              {medico.enderecoPrincipal?.numero}
            </p>
          </>
        ) : (
          <p className="font-semibold">SEM ENDEREÇO</p>
        )}
      </div>
    </div>
  ));
}

export default BuscarMedicos;
