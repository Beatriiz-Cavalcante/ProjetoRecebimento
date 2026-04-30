import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CadastroUsuarioPage.css";

function CadastroUsuarioPage() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [perfil, setPerfil] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    setErro("");
    setMensagem("");

    if (!nome.trim()) {
      setErro("Informe o nome do usuário.");
      return;
    }

    if (!email.trim()) {
      setErro("Informe o e-mail.");
      return;
    }

    if (!perfil) {
      setErro("Selecione o perfil do usuário.");
      return;
    }

    if (!senha.trim()) {
      setErro("Informe a senha.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch("http://127.0.0.1:5000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          perfil,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao cadastrar usuário.");
      }

      setMensagem(dados.mensagem || "Usuário cadastrado com sucesso.");

      setNome("");
      setEmail("");
      setPerfil("");
      setSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="cadastro-usuario-page">
      <div className="cadastro-usuario-card">
        <h1>Cadastro de Usuário</h1>

        <p className="cadastro-usuario-subtitle">
          Crie um novo acesso para o sistema
        </p>

        <form onSubmit={handleSubmit}>
          <div className="cadastro-usuario-field">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              placeholder="Nome completo"
              onChange={(e) => setNome(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="cadastro-usuario-field">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              placeholder="email@empresa.com"
              onChange={(e) => setEmail(e.target.value)}
              disabled={carregando}
            />
          </div>

          <div className="cadastro-usuario-field">
            <label>Perfil</label>
            <select
              value={perfil}
              onChange={(e) => setPerfil(e.target.value)}
              disabled={carregando}
            >
              <option value="">Selecione</option>
              <option value="ADM">Administrador</option>
              <option value="RECEBIMENTO">Recebimento</option>
              <option value="PORTARIA">Portaria</option>
            </select>
          </div>

          {/* SENHA */}
          <div className="cadastro-usuario-field">
            <label>Senha</label>
            <div className="input-password">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                placeholder="Digite a senha"
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
              />
               <i
                className={`bi ${
                  mostrarSenha ? "bi-eye-slash" : "bi-eye"
                } toggle-password`}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              ></i>
            </div>
          </div>

          {/* CONFIRMAR SENHA */}
          <div className="cadastro-usuario-field">
            <label>Confirmar senha</label>
            <div className="input-password">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                placeholder="Confirme a senha"
                onChange={(e) => setConfirmarSenha(e.target.value)}
                disabled={carregando}
              />
               <i
                className={`bi ${
                  mostrarSenha ? "bi-eye-slash" : "bi-eye"
                } toggle-password`}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              ></i>
            </div>
          </div>

          {erro && <div className="cadastro-usuario-error">{erro}</div>}

          {mensagem && (
            <div className="cadastro-usuario-success">{mensagem}</div>
          )}

          <button
            type="submit"
            className="cadastro-usuario-button"
            disabled={carregando}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="cadastro-usuario-links">
          <Link to="/">Voltar para login</Link>
        </div>
      </div>
    </div>
  );
}

export default CadastroUsuarioPage;