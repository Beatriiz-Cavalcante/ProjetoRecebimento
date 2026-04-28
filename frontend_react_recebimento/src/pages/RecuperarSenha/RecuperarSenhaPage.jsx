import { useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarSenhaPage.css";

function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Informe o e-mail cadastrado.");
      return;
    }

    // Temporário até criarmos a API de recuperação
    console.log({
      email,
    });

    setMensagem(
      "Se este e-mail estiver cadastrado, enviaremos as instruções de recuperação."
    );

    setEmail("");
  }

  return (
    <div className="recuperar-senha-page">
      <div className="recuperar-senha-card">
        <h1>Recuperar Senha</h1>
        <p className="recuperar-senha-subtitle">
          Informe seu e-mail para recuperar o acesso
        </p>

        <form onSubmit={handleSubmit}>
          <div className="recuperar-senha-field">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              placeholder="Digite seu e-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {erro && <div className="recuperar-senha-error">{erro}</div>}
          {mensagem && (
            <div className="recuperar-senha-success">{mensagem}</div>
          )}

          <button type="submit" className="recuperar-senha-button">
            Enviar recuperação
          </button>
        </form>

        <div className="recuperar-senha-links">
          <Link to="/">Voltar para login</Link>
        </div>
      </div>
    </div>
  );
}

export default RecuperarSenhaPage;