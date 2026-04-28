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

  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  function handleSubmit(e) {
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

    // Temporário até criarmos a API de cadastro
    console.log({
      nome,
      email,
      perfil,
      senha,
    });

    setMensagem("Usuário cadastrado com sucesso.");

    setTimeout(() => {
      navigate("/");
    }, 1000);
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
            />
          </div>

          <div className="cadastro-usuario-field">
            <label>E-mail</label>
            <input
              type="email"
              value={email}
              placeholder="email@empresa.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="cadastro-usuario-field">
            <label>Perfil</label>
            <select value={perfil} onChange={(e) => setPerfil(e.target.value)}>
              <option value="">Selecione</option>
              <option value="ADM">Administrador</option>
              <option value="RECEBIMENTO">Recebimento</option>
              <option value="PORTARIA">Portaria</option>
            </select>
          </div>

          <div className="cadastro-usuario-field">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              placeholder="Digite a senha"
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="cadastro-usuario-field">
            <label>Confirmar senha</label>
            <input
              type="password"
              value={confirmarSenha}
              placeholder="Confirme a senha"
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {erro && <div className="cadastro-usuario-error">{erro}</div>}
          {mensagem && (
            <div className="cadastro-usuario-success">{mensagem}</div>
          )}

          <button type="submit" className="cadastro-usuario-button">
            Cadastrar
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