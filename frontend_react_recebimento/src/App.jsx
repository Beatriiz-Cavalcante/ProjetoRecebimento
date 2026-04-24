import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./Appcss.css";

import RecebimentoPage from "./pages/RecebimentoPage";
import PortariaPage from "./pages/PortariaPage";

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-4">
        <div className="mb-4 d-flex gap-2">
          <Link to="/recebimento" className="btn btn-primary">
            Recebimento
          </Link>

          <Link to="/portaria" className="btn btn-secondary">
            Portaria
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<Navigate to="/recebimento" />} />
          <Route path="/recebimento" element={<RecebimentoPage />} />
          <Route path="/portaria" element={<PortariaPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;