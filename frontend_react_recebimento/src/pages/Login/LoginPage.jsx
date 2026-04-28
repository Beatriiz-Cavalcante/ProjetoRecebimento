import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!email.trim()) {
      setErro("Informe o e-mail.");
      return;
    }

    if (!senha.trim()) {
      setErro("Informe a senha.");
      return;
    }

    // Temporário até criarmos a API de login
    localStorage.setItem(
      "usuarioLogado",
      JSON.stringify({
        email,
        perfil: "ADM",
      })
    );

    setMensagem("Login realizado com sucesso.");

    setTimeout(() => {
      navigate("/recebimento");
    }, 800);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Entrar</h1>
        <p className="login-subtitle">Acesse o sistema de recebimento</p>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              placeholder="Digite seu e-mail"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-field">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              placeholder="Digite sua senha"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && <div className="login-error">{erro}</div>}
          {mensagem && <div className="login-success">{mensagem}</div>}

          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>

        <div className="login-links">
          <Link to="/recuperar-senha">Esqueci minha senha</Link>
          <Link to="/cadastro-usuario">Cadastrar usuário</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;