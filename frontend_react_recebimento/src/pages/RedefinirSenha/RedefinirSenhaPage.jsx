import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./RedefinirSenhaPage.css";

function RedefinirSenhaPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [novaSenha, setNovaSenha] = useState("");
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

    if (!token) {
      setErro("Token de recuperação não encontrado.");
      return;
    }

    if (!novaSenha.trim()) {
      setErro("Informe a nova senha.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não conferem.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch("http://127.0.0.1:5000/redefinir-senha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          nova_senha: novaSenha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.erro || "Erro ao redefinir senha.");
      }

      setMensagem(dados.mensagem || "Senha redefinida com sucesso.");

      setNovaSenha("");
      setConfirmarSenha("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setErro(error.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="redefinir-senha-page">
      <div className="redefinir-senha-card">
        <h1>Redefinir Senha</h1>

        <p className="redefinir-senha-subtitle">
          Crie uma nova senha para acessar o sistema
        </p>

        <form onSubmit={handleSubmit}>
          <div className="redefinir-senha-field">
            <label>Nova senha</label>

            <div className="redefinir-senha-input-password">
              <input
                type={mostrarSenha ? "text" : "password"}
                value={novaSenha}
                placeholder="Digite a nova senha"
                onChange={(e) => setNovaSenha(e.target.value)}
                disabled={carregando}
              />
              <i
                className={`bi ${
                    mostrarSenha ? "bi-eye-slash" : "bi-eye"
                } eye-icon`}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              ></i>
            </div>
          </div>

          <div className="redefinir-senha-field">
            <label>Confirmar nova senha</label>

            <div className="redefinir-senha-input-password">
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                value={confirmarSenha}
                placeholder="Confirme a nova senha"
                onChange={(e) => setConfirmarSenha(e.target.value)}
                disabled={carregando}
              />

              <i
                className={`bi ${
                    mostrarSenha ? "bi-eye-slash" : "bi-eye"
                } eye-icon`}
                onClick={() => setMostrarSenha(!mostrarSenha)}
              ></i>
            </div>
          </div>

          {erro && <div className="redefinir-senha-error">{erro}</div>}

          {mensagem && (
            <div className="redefinir-senha-success">{mensagem}</div>
          )}

          <button
            type="submit"
            className="redefinir-senha-button"
            disabled={carregando}
          >
            {carregando ? "Salvando..." : "Redefinir senha"}
          </button>
        </form>

        <div className="redefinir-senha-links">
          <Link to="/">Voltar para login</Link>
        </div>
      </div>
    </div>
  );
}

export default RedefinirSenhaPage;