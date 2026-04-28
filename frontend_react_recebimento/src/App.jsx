import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./Appcss.css";

import LoginPage from "./pages/Login/LoginPage";
import CadastroUsuarioPage from "./pages/CadastroUsuario/CadastroUsuarioPage";
import RecuperarSenhaPage from "./pages/RecuperarSenha/RecuperarSenhaPage";

import RecebimentoPage from "./pages/Recebimento/RecebimentoPage";
import PortariaPage from "./pages/Portaria/PortariaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/cadastro-usuario" element={<CadastroUsuarioPage />} />

        <Route path="/recuperar-senha" element={<RecuperarSenhaPage />} />

        <Route path="/recebimento" element={<RecebimentoPage />} />

        <Route path="/portaria" element={<PortariaPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;