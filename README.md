# Front-end de Aplicação Web para Gerenciamento de Consultas Médicas  
  
Front-end de uma aplicação web para gerenciamento de consultas médicas, desenvolvido em React e integrado a uma API REST.  
  
A aplicação permite que clientes e médicos acessem funcionalidades diferentes de acordo com seu perfil, como agendamento de consultas a partir de horários disponíveis, gerenciamento de endereços do médico, perfil e acompanhamento de consultas.  
  
---  
## Funcionalidades do front-end  
  
### Autenticação e sessão  
  
- Tela de login.  
- Tela de cadastro para cliente e médico.  
- Armazenamento do access token no sessionStorage.  
- Uso de refresh token via cookie HttpOnly enviado pelo backend.  
- Renovação automática do access token ao receber resposta com status `401`.  
- Logout com limpeza de dados de sessão local. 
- Renderização condicional baseada na role do usuário.  
  
### Área do cliente  
  
- Visualização do histórico de consultas.  
- Busca de médicos por especialidade e cidade.  
- Agendamento de consulta baseado nos horários de atendimento disponíveis.  
- Cancelamento de consulta pendente.
- Visualização de detalhes da consulta.  
- Edição de dados do perfil.  
- Exclusão de conta.  
  
### Área do médico  
  
- Visualização do histórico de consultas.  
- Visualização dos dados do cliente relacionado à consulta.  
- Conclusão e cancelamento de consulta pendente.  
- Gerenciamento de horários disponíveis. 
- Gerenciamento de endereços.  
- Definição de endereço principal.  
- Edição de dados do perfil.  
- Exclusão de conta.  
  
---  
## Tecnologias utilizadas  
  
- React  
- Vite  
- React Router  
- Axios  
- Tailwind CSS  
- Sonner  
  
---
## Estrutura do front-end  
  
```txt  
src/  
├── components/  
│ ├── BuscarEnderecos.jsx  
│ ├── BuscarMedicos.jsx  
│ ├── CardHome.jsx  
│ ├── ConsultaModal.jsx  
│ ├── ConsultasMarcadas.jsx  
│ ├── GerenciarHorarios.jsx  
│ ├── HorariosDisponiveis.jsx  
│ ├── HorariosMedico.jsx  
│ └── Spinner.jsx  
├── pages/  
│ ├── AgendarConsulta.jsx  
│ ├── ConsultaScreen.jsx  
│ ├── EnderecoScreen.jsx  
│ ├── HomeScreen.jsx  
│ ├── LoginScreen.jsx  
│ ├── PerfilScreen.jsx  
│ └── RegisterScreen.jsx  
├── services/  
│ └── api.js  
└── utils/  
└── formatters.js

```
## Integração com a API

A comunicação com o backend é feita por meio do Axios.

O projeto possui duas instâncias principais:

- `apiPublic`
- `apiPrivate`

A instância pública é usada para rotas que não exigem autenticação, como login, cadastro e refresh token.

A instância privada é usada para rotas autenticadas. Ela adiciona automaticamente o access token no header `Authorization`:

```
Authorization: Bearer <token>
```

Quando uma requisição autenticada retorna `401`, o front-end tenta renovar o access token utilizando o endpoint de refresh.

---
## Rotas do front-end

```
/login          -> Login
/register       -> Cadastro
/home           -> Página inicial
/agendar        -> Agendamento de consulta
/consultas      -> Listagem de consultas
/consultas/:id  -> Detalhes da consulta
/enderecos      -> Gerenciamento de endereços
/perfil         -> Perfil do usuário
```

---
## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com a URL da API:

```
VITE_API_URL=http://localhost:8080
```

---
## Como executar o front-end

Clone o repositório:

```
git clone <url-do-repositorio>
```

Acesse a pasta do projeto:

```
cd <nome-do-projeto>
```

Instale as dependências:

```
npm install
```

Execute em ambiente de desenvolvimento:

```
npm run dev
```

A aplicação ficará disponível em:

```
http://localhost:5173
```

---
## Principais telas

### Login

Tela responsável pela autenticação do usuário e armazenamento dos dados de sessão necessários para acessar as rotas privadas.

### Cadastro

Tela para criação de usuários do tipo cliente ou médico, alterando os campos exibidos de acordo com o tipo selecionado.

### Home

Tela inicial após o login, navegação principal e resumo das consultas recentes.

### Agendamento

Tela onde o cliente pode pesquisar médicos, selecionar um profissional, visualizar horários disponíveis e agendar uma consulta.

### Consultas

Tela de listagem das consultas do usuário logado. Permite visualizar detalhes, cancelar consultas e, no caso do médico, concluir atendimentos.

### Endereços

Tela usada pelo médico para cadastrar, editar, remover e definir endereço principal.

### Perfil

Tela para edição de dados do usuário e exclusão da conta.

---
## Destaques técnicos

- Separação entre páginas e componentes reutilizáveis.
- Uso de Axios com interceptors.
- Renovação automática de access token.
- Controle de loading em ações assíncronas.
- Feedback visual com toast.
- Máscaras para CPF e telefone.
- Renderização condicional por perfil de usuário.
- Integração com rotas dinâmicas, como /consultas/:id.

---
## Deploy

Front-end funcional, integrado a uma API REST, com fluxo completo de login, cadastro, agendamento, gerenciamento de consultas, horários, endereços e perfil.

Aplicação disponível em: https://front-consultas.vercel.app/login

Repositório do backend: [API-Consultas](https://github.com/KauaMessias/API-Consultas)

---
## Autor

**Kauã Santos**

- GitHub: [@KauaMessias](https://github.com/KauaMessias)
- LinkedIn: [Kauã Messias](https://www.linkedin.com/in/kauã-messias-413229341)
- Email: kauamessias1@gmail.com
