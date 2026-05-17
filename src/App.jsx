import { useState } from "react";
import LoginScreen from "./pages/LoginScreen";
import RegisterScreen from "./pages/RegisterScreen";
import { Navigate, Route, Routes } from "react-router";
import HomeScreen from "./pages/HomeScreen";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
