import { useEffect, useState } from "react";
import CadastroRecebimentoPortaria from "../../components/CadastroRecebimentoportaria/CadastroRecebimentoPortaria";
import RegistrosPortaria from "../../components/Registrosportaria/RegistrosPortaria";

function PortariaPage() {
  const [registros, setRegistros] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [mensagemCadastro, setMensagemCadastro] = useState("");
  const [mensagemEdicaoId, setMensagemEdicaoId] = useState(null);

  function mostrarMensagemCadastro(texto) {
    setMensagemCadastro(texto);
    setTimeout(() => setMensagemCadastro(""), 3000);
  }

  function mostrarMensagemEdicao(id) {
    setMensagemEdicaoId(id);
    setTimeout(() => setMensagemEdicaoId(null), 3000);
  }

  async function carregarRegistros() {
    try {
      const resposta = await fetch("http://127.0.0.1:5000/operacoes");

      if (!resposta.ok) {
        throw new Error("Erro ao carregar registros");
      }

      const dados = await resposta.json();
      setRegistros(Array.isArray(dados) ? dados : []);
    } catch (erro) {
      console.error("Erro ao carregar registros:", erro);
      setRegistros([]);
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, []);

  async function salvarCadastroPortaria(dados) {
    try {
      const payload = {
        fornecedor: dados.fornecedor || null,
        data: dados.data || null,
        chegada_na_rua: dados.chegada_na_rua || null,
        entrada_no_cd: dados.entrada_no_cd || null,
        horario_saida: dados.horario_saida || null,
        nome_motorista: dados.nome_motorista || null,
        cpf_motorista: dados.cpf_motorista || null,
        placa_carro: dados.placa_carro || null,
        qt_notas:
          dados.qt_notas === "" ||
          dados.qt_notas === null ||
          dados.qt_notas === undefined
            ? null
            : Number(dados.qt_notas),
        observacao_portaria: dados.observacao_portaria || "",
      };

      const resposta = await fetch("http://127.0.0.1:5000/operacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resposta.ok) {
        throw new Error("Erro ao salvar cadastro");
      }

      await carregarRegistros();
      mostrarMensagemCadastro("registro adicionado com sucesso");
    } catch (erro) {
      console.error("Erro ao salvar cadastro da portaria:", erro);
    }
  }

  function iniciarEdicao(id) {
    setEditandoId(id);
    setMensagemCadastro("");
    setMensagemEdicaoId(null);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    carregarRegistros();
  }

  function handleChangeCampoRegistro(id, campo, valor) {
    setRegistros((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [campo]: valor,
            }
          : item
      )
    );
  }

  async function salvarEdicaoRegistro(item) {
    try {
      const payload = {
        fornecedor: item.fornecedor || null,
        data: item.data || null,
        chegada_na_rua: item.chegada_na_rua || null,
        entrada_no_cd: item.entrada_no_cd || null,
        horario_saida: item.horario_saida || null,
        nome_motorista: item.nome_motorista || null,
        cpf_motorista: item.cpf_motorista || null,
        placa_carro: item.placa_carro || null,
        qt_notas:
          item.qt_notas === "" ||
          item.qt_notas === null ||
          item.qt_notas === undefined
            ? null
            : Number(item.qt_notas),
        observacao_portaria: item.observacao_portaria || "",
      };

      const resposta = await fetch(
        `http://127.0.0.1:5000/operacoes/portaria/${item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!resposta.ok) {
        throw new Error("Erro ao atualizar cadastro");
      }

      setEditandoId(null);
      await carregarRegistros();
      mostrarMensagemEdicao(item.id);
    } catch (erro) {
      console.error("Erro ao salvar edição da portaria:", erro);
    }
  }

  return (
    <div className="container mt-4">
      <CadastroRecebimentoPortaria
        onSubmit={salvarCadastroPortaria}
        mensagem={mensagemCadastro}
      />

      <RegistrosPortaria
        registros={registros}
        editandoId={editandoId}
        iniciarEdicao={iniciarEdicao}
        cancelarEdicao={cancelarEdicao}
        handleChangeCampoRegistro={handleChangeCampoRegistro}
        salvarEdicaoRegistro={salvarEdicaoRegistro}
        mensagemEdicaoId={mensagemEdicaoId}
      />
    </div>
  );
}

export default PortariaPage;