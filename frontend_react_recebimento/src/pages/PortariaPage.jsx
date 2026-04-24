import { useEffect, useState } from "react";
import {
  getRecebimentos,
  criarRecebimento,
  atualizarRecebimento,
} from "../services/api";

import CadastroRecebimentoPortaria from "../components/CadastroRecebimentoPortaria/CadastroRecebimentoPortaria";
import Registrosportaria from "../components/Registrosportaria/Registrosportaria";

function PortariaPage() {
  const [lista, setLista] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  function valorPreenchido(valor) {
    return valor !== null && valor !== undefined && String(valor).trim() !== "";
  }

  function calcularStatusRegistro(item) {
    const camposObrigatorios = [
      item.fornecedor,
      item.data,
      item.nome_motorista,
      item.cpf_motorista,
      item.placa_carro,
      item.qt_notas,
      item.chegada_na_rua,
      item.entrada_no_cd,
    ];

    const faltando = camposObrigatorios.some((valor) => !valorPreenchido(valor));
    return faltando ? "PENDENTE" : "RESOLVIDO";
  }

  function gerarObservacaoAutomatica(item) {
    const faltando = [];

    if (!valorPreenchido(item.fornecedor)) faltando.push("Fornecedor");
    if (!valorPreenchido(item.data)) faltando.push("Data");
    if (!valorPreenchido(item.nome_motorista)) faltando.push("Nome Motorista");
    if (!valorPreenchido(item.cpf_motorista)) faltando.push("CPF Motorista");
    if (!valorPreenchido(item.placa_carro)) faltando.push("Placa Carro");
    if (!valorPreenchido(item.qt_notas) && item.qt_notas !== 0) {
      faltando.push("Quantidade de Notas");
    }
    if (!valorPreenchido(item.chegada_na_rua)) faltando.push("Chegada na Rua");
    if (!valorPreenchido(item.entrada_no_cd)) faltando.push("Entrada no CD");

    if (faltando.length > 0) {
      return `Faltando preencher: ${faltando.join(", ")}`;
    }

    return "Registro preenchido corretamente.";
  }

  function enriquecerLista(dados) {
    return (Array.isArray(dados) ? dados : []).map((item) => ({
      ...item,
      observacao_status:
        item.observacao_status && String(item.observacao_status).trim() !== ""
          ? item.observacao_status
          : gerarObservacaoAutomatica(item),
      observacao_manual: item.observacao_manual || "",
      nome_motorista: item.nome_motorista || "",
      cpf_motorista: item.cpf_motorista || "",
      placa_carro: item.placa_carro || "",
      qt_notas:
        item.qt_notas === null || item.qt_notas === undefined ? "" : item.qt_notas,
    }));
  }

  function filtrarRegistrosPortaria(dados) {
    return dados.filter(
      (item) =>
        valorPreenchido(item.nome_motorista) ||
        valorPreenchido(item.cpf_motorista) ||
        valorPreenchido(item.placa_carro) ||
        valorPreenchido(item.qt_notas)
    );
  }

  function getStatusStyle(status) {
    if (status === "RESOLVIDO") {
      return {
        backgroundColor: "#d4edda",
        color: "#155724",
        border: "1px solid #c3e6cb",
      };
    }

    return {
      backgroundColor: "#fff3cd",
      color: "#856404",
      border: "1px solid #ffeeba",
    };
  }

  function formatarDataBR(valor) {
    if (!valor) return "-";

    if (typeof valor === "string" && valor.includes("-")) {
      const partes = valor.split("-");
      if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
    }

    return valor;
  }

  async function carregar() {
    try {
      const dados = await getRecebimentos();
      const dadosTratados = enriquecerLista(dados);
      setLista(filtrarRegistrosPortaria(dadosTratados));
    } catch (error) {
      console.error("Erro ao carregar registros da portaria:", error);
      setLista([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSubmitPortaria(dados) {
    try {
      await criarRecebimento({
        fornecedor: dados.fornecedor || null,
        data: dados.data || null,
        chegada_na_rua: dados.chegada_na_rua || null,
        entrada_no_cd: dados.entrada_no_cd || null,
        nome_motorista: dados.nome_motorista || null,
        cpf_motorista: dados.cpf_motorista || null,
        placa_carro: dados.placa_carro || null,
        qt_notas:
          dados.qt_notas === "" || dados.qt_notas === null || dados.qt_notas === undefined
            ? null
            : Number(dados.qt_notas),

        horario_inicio: null,
        horario_final: null,
        desconto_hora: null,
        numero_palet: null,
        tipo_carga: null,
        num_homens: null,
        avaria: 0,
        volumes: 0,
        descricao: "",
        observacao_manual: "",
      });

      await carregar();
      alert("Cadastro da portaria realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar cadastro da portaria:", error);
      alert("Erro ao cadastrar na portaria.");
    }
  }

  function handleChangeObservacao(id, valor) {
    setLista((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, observacao_status: valor } : item
      )
    );
  }

  function iniciarEdicao(id) {
    setEditandoId(id);
  }

  function cancelarEdicao() {
    setEditandoId(null);
    carregar();
  }

  function handleChangeCampoRegistro(id, campo, valor) {
    setLista((prev) =>
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
        nome_motorista: item.nome_motorista || null,
        cpf_motorista: item.cpf_motorista || null,
        placa_carro: item.placa_carro || null,
        qt_notas:
          item.qt_notas === "" || item.qt_notas === null || item.qt_notas === undefined
            ? null
            : Number(item.qt_notas),

        horario_inicio: item.horario_inicio || null,
        horario_final: item.horario_final || null,
        desconto_hora: item.desconto_hora || null,
        numero_palet:
          item.numero_palet === "" || item.numero_palet === null
            ? null
            : Number(item.numero_palet),
        tipo_carga: item.tipo_carga || null,
        num_homens:
          item.num_homens === "" || item.num_homens === null
            ? null
            : Number(item.num_homens),
        avaria:
          item.avaria === "" || item.avaria === null ? 0 : Number(item.avaria),
        volumes:
          item.volumes === "" || item.volumes === null ? 0 : Number(item.volumes),
        descricao: item.descricao || "",
        observacao_manual: item.observacao_manual || "",
      };

      const atualizado = await atualizarRecebimento(item.id, payload);

      setLista((prev) =>
        prev.map((registro) =>
          registro.id === item.id ? { ...registro, ...atualizado } : registro
        )
      );

      setEditandoId(null);
      await carregar();
    } catch (error) {
      console.error("Erro ao salvar edição da portaria:", error);
      alert("Erro ao salvar edição da portaria.");
    }
  }

  function handleChangeObservacaoManual(id, valor) {
    setLista((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, observacao_manual: valor } : item
      )
    );
  }

  return (
    <>
      <CadastroRecebimentoPortaria onSubmit={handleSubmitPortaria} />

      <Registrosportaria
        lista={lista}
        calcularStatusRegistro={calcularStatusRegistro}
        getStatusStyle={getStatusStyle}
        formatarDataBR={formatarDataBR}
        handleChangeObservacao={handleChangeObservacao}
        editandoId={editandoId}
        iniciarEdicao={iniciarEdicao}
        cancelarEdicao={cancelarEdicao}
        handleChangeCampoRegistro={handleChangeCampoRegistro}
        salvarEdicaoRegistro={salvarEdicaoRegistro}
        handleChangeObservacaoManual={handleChangeObservacaoManual}
      />
    </>
  );
}

export default PortariaPage;