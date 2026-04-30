import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
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

    try {
      setCarregando(true);

      const resposta = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao fazer login.");
      }

      localStorage.setItem("token", dados.token);
      localStorage.setItem("usuarioLogado", JSON.stringify(dados.usuario));

      setMensagem(dados.mensagem || "Login realizado com sucesso.");

      setTimeout(() => {
        if (dados.usuario.perfil === "ADM") {
          navigate("/recebimento");
        } else if (dados.usuario.perfil === "RECEBIMENTO") {
          navigate("/recebimento");
        } else if (dados.usuario.perfil === "PORTARIA") {
          navigate("/portaria");
        } else {
          navigate("/");
        }
      }, 800);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
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
              disabled={carregando}
            />
          </div>

          <div className="login-field">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              placeholder="Digite sua senha"
              onChange={(e) => setSenha(e.target.value)}
              disabled={carregando}
            />
          </div>

          {erro && <div className="login-error">{erro}</div>}

          {mensagem && <div className="login-success">{mensagem}</div>}

          <button type="submit" className="login-button" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
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