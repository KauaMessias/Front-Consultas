export function formatarTelefone(digitos) {
  const telefone = digitos.replace(/\D/g, "");

  if (telefone.length <= 2) {
    return telefone;
  } else if (telefone.length <= 6) {
    return telefone.replace(/(\d{2})(\d+)/, "($1) $2");
  } else if (telefone.length <= 10) {
    return telefone.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
  }
  return telefone.replace(/(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
}

export function formatarCpf(digitos) {
  const cpf = digitos.replace(/\D/g, "");

  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return cpf.replace(/(\d{3})(\d+)/, "$1.$2");
  } else if (cpf.length <= 9) {
    return cpf.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
  }
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "$1.$2.$3-$4");
}

export function formatarCep(digitos) {
  const cep = digitos.replace(/\D/g, "");

  if (cep.length <= 5) {
    return cep;
  }

  return cep.replace(/(\d{5})(\d{1,3})/, "$1-$2");
}
