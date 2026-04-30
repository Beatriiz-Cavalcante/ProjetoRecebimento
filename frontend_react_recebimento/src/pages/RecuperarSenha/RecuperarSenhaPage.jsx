import { useState } from "react";
import { Link } from "react-router-dom";
import "./RecuperarSenhaPage.css";

function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Informe o e-mail cadastrado.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch(
        "http://127.0.0.1:5000/recuperar-senha",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao recuperar senha.");
      }

      setMensagem(
        dados.mensagem ||
          "Se este e-mail estiver cadastrado, enviaremos as instruções."
      );

      setEmail("");
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
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
              disabled={carregando}
            />
          </div>

          {erro && <div className="recuperar-senha-error">{erro}</div>}

          {mensagem && (
            <div className="recuperar-senha-success">{mensagem}</div>
          )}

          <button
            type="submit"
            className="recuperar-senha-button"
            disabled={carregando}
          >
            {carregando ? "Enviando..." : "Enviar recuperação"}
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