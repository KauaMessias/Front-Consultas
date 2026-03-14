import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import HomeScreen from "./pages/HomeScreen";
import PerfilScreen from "./pages/PerfilScreen.jsx";
import ConsultaScreen from "./pages/ConsultaScreen.jsx";
import EnderecoScreen from "./pages/EnderecoScreen.jsx";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.jsx";
import "./index.css";
import AgendarConsulta from "./pages/AgendarConsulta.jsx";

const router = createBrowserRouter([
  { path: "/", element: <HomeScreen /> },
  { path: "/login", element: <LoginScreen /> },
  { path: "/registrar", element: <RegisterScreen /> },
  { path: "/perfil", element: <PerfilScreen /> },
  { path: "/consultas", element: <ConsultaScreen /> },
  { path: "/agendar", element: <AgendarConsulta /> },
  { path: "/enderecos", element: <EnderecoScreen /> },
  { path: "*", element: <div>NADA</div> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
