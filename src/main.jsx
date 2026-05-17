import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import HomeScreen from "./pages/HomeScreen";
import PerfilScreen from "./pages/PerfilScreen.jsx";
import ConsultaScreen from "./pages/ConsultaScreen.jsx";
import EnderecoScreen from "./pages/EnderecoScreen.jsx";
import { createBrowserRouter, Navigate } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "./App.jsx";
import "./index.css";
import AgendarConsulta from "./pages/AgendarConsulta.jsx";
import { Toaster } from "sonner";
import ConsultaModal from "./components/ConsultaModal.jsx";
import BuscarEnderecos from "./components/BuscarEnderecos.jsx";
import NotFoundScreen from "./pages/NotFoundScreen.jsx";

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/home", element: <HomeScreen /> },
  { path: "/login", element: <LoginScreen /> },
  { path: "/registrar", element: <RegisterScreen /> },
  { path: "/perfil", element: <PerfilScreen /> },
  { path: "/consultas", element: <ConsultaScreen /> },
  { path: "/consultas/:id", element: <ConsultaScreen /> },
  { path: "/agendar", element: <AgendarConsulta /> },
  { path: "/enderecos", element: <EnderecoScreen /> },
  { path: "/enderecos", element: <BuscarEnderecos /> },
  { path: "*", element: <NotFoundScreen /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      richColors
      position="top-center"
      duration={4000}
      visibleToasts={2}
      toastOptions={{
        classNames: {
          toast:
            "rounded-md border shadow-xl px-4 py-3 text-sm flex items-center gap-3",
          title: "font-semibold",
          description: "text-xs opacity-80",
          success: "!bg-emerald-50 !text-emerald-800 !border-emerald-500",
          error: "!bg-red-50/90 !text-red-800 !border-red-500",
          warning: "!bg-yellow-50 !text-yellow-800 !border-yellow-500",
          info: "!bg-blue-50 !text-blue-800 !border-blue-500",
        },
      }}
    />
    <RouterProvider router={router} />
  </StrictMode>,
);
