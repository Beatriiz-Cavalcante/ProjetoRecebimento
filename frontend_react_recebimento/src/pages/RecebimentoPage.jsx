import { useEffect, useRef, useState } from "react";
import {
  getRecebimentos,
  criarRecebimento,
  atualizarRecebimento,
} from "../services/api";

import CadastroRecebimento from "../components/CadastroRecebimento/CadastroRecebimento";
import Registros from "../components/Registros/Registros";

function RecebimentoPage() {
  const [lista, setLista] = useState([]);

  const [mensagemCadastro, setMensagemCadastro] = useState("");
  const [mensagemEdicaoId, setMensagemEdicaoId] = useState(null);

  const [fornecedor, setFornecedor] = useState("");
  const [chegadaNaRua, setChegadaNaRua] = useState("");
  const [entradaNoCd, setEntradaNoCd] = useState("");
  const [data, setData] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFinal, setHorarioFinal] = useState("");
  const [descontoHora, setDescontoHora] = useState("");
  const [numeroPalet, setNumeroPalet] = useState("");
  const [tipoCarga, setTipoCarga] = useState("PAL");
  const [numHomens, setNumHomens] = useState("");
  const [avaria, setAvaria] = useState("");
  const [volumes, setVolumes] = useState("");
  const [descricao, setDescricao] = useState("");

  const [abrirLista, setAbrirLista] = useState(false);
  const [selecionado, setSelecionado] = useState("");
  const [indiceAtivo, setIndiceAtivo] = useState(-1);
  const [erros, setErros] = useState({});
  const [editandoId, setEditandoId] = useState(null);

  const containerRef = useRef(null);
  const inputFornecedorRef = useRef(null);
  const inputChegadaRef = useRef(null);
  const listaRef = useRef(null);

  function mostrarMensagemCadastro(texto) {
    setMensagemCadastro(texto);
    setTimeout(() => setMensagemCadastro(""), 3000);
  }

  function mostrarMensagemEdicao(id) {
    setMensagemEdicaoId(id);
    setTimeout(() => setMensagemEdicaoId(null), 3000);
  }

  const fornecedores = [
    "ALVOAR",
    "BALY",
    "BAUDUCO",
    "BENEVIA",
    "CIA",
    "COMARY",
    "CORY",
    "DANILLA",
    "DOCE VIEIRA",
    "DORI",
    "ECOVILE",
    "ELMA",
    "FINI",
    "FLORESTAL",
    "GDC",
    "GRAZY",
    "HENKEL",
    "HERSHEYS",
    "HERO",
    "JASMIM",
    "JAZAN",
    "JAZAM",
    "KUKI",
    "LEÃO",
    "LINDT",
    "M DIAS",
    "MASTER FOODS",
    "NUTRATA",
    "NOVO ATACAREJO",
    "PECIN",
    "PEPSICO",
    "PERFETTI",
    "PIETROBON",
    "REGINA",
    "RICLAN",
    "SAM´S",
    "SIMONETTO",
    "STA HELENA",
    "TOFFANO",
    "ZENTOY´S",
  ];

  const fornecedoresFiltrados = fornecedores.filter((item) =>
    item.toLowerCase().includes(fornecedor.toLowerCase())
  );

  function valorPreenchido(valor) {
    return valor !== null && valor !== undefined && String(valor).trim() !== "";
  }

  function calcularStatusRegistro(item) {
    const camposObrigatorios = [
      item.fornecedor,
      item.chegada_na_rua,
      item.entrada_no_cd,
      item.data,
      item.nome_motorista,
      item.cpf_motorista,
      item.placa_carro,
      item.qt_notas,
      item.horario_inicio,
      item.horario_final,
      item.desconto_hora,
      item.numero_palet,
      item.tipo_carga,
      item.num_homens,
    ];

    const faltando = camposObrigatorios.some((valor) => !valorPreenchido(valor));
    return faltando ? "PENDENTE" : "RESOLVIDO";
  }

  function gerarObservacaoAutomatica(item) {
    const faltando = [];

    if (!valorPreenchido(item.fornecedor)) faltando.push("Fornecedor");
    if (!valorPreenchido(item.chegada_na_rua)) faltando.push("Chegada na Rua");
    if (!valorPreenchido(item.entrada_no_cd)) faltando.push("Entrada no CD");
    if (!valorPreenchido(item.data)) faltando.push("Data");
    if (!valorPreenchido(item.nome_motorista)) faltando.push("Nome Motorista");
    if (!valorPreenchido(item.cpf_motorista)) faltando.push("CPF Motorista");
    if (!valorPreenchido(item.placa_carro)) faltando.push("Placa Carro");

    if (!valorPreenchido(item.qt_notas) && item.qt_notas !== 0) {
      faltando.push("Quantidade de Notas");
    }

    if (!valorPreenchido(item.horario_inicio)) faltando.push("Horário Início");
    if (!valorPreenchido(item.horario_final)) faltando.push("Horário Final");
    if (!valorPreenchido(item.desconto_hora)) faltando.push("Desconto Hora");

    if (!valorPreenchido(item.numero_palet) && item.numero_palet !== 0) {
      faltando.push("Número Palet");
    }

    if (!valorPreenchido(item.tipo_carga)) faltando.push("Tipo Carga");

    if (!valorPreenchido(item.num_homens) && item.num_homens !== 0) {
      faltando.push("Nº Homens");
    }

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
      setLista(enriquecerLista(dados));
    } catch (error) {
      console.error("Erro ao carregar recebimentos:", error);
      setLista([]);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setAbrirLista(false);
        setIndiceAtivo(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (listaRef.current && indiceAtivo >= 0) {
      const itemAtivo = listaRef.current.children[indiceAtivo];

      if (itemAtivo) {
        itemAtivo.scrollIntoView({ block: "nearest" });
      }
    }
  }, [indiceAtivo]);

  function limparFormulario() {
    setFornecedor("");
    setChegadaNaRua("");
    setEntradaNoCd("");
    setData("");
    setHorarioInicio("");
    setHorarioFinal("");
    setDescontoHora("");
    setNumeroPalet("");
    setTipoCarga("PAL");
    setNumHomens("");
    setAvaria("");
    setVolumes("");
    setDescricao("");
    setSelecionado("");
    setAbrirLista(false);
    setIndiceAtivo(-1);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const novosErros = {};

    if (!fornecedor) novosErros.fornecedor = true;
    if (!data) novosErros.data = true;

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    try {
      await criarRecebimento({
        fornecedor,
        chegada_na_rua: chegadaNaRua || null,
        entrada_no_cd: entradaNoCd || null,
        data,
        nome_motorista: null,
        cpf_motorista: null,
        placa_carro: null,
        qt_notas: null,
        horario_inicio: horarioInicio || null,
        horario_final: horarioFinal || null,
        desconto_hora: descontoHora || null,
        numero_palet: numeroPalet === "" ? null : Number(numeroPalet),
        tipo_carga: tipoCarga || null,
        num_homens: numHomens === "" ? null : Number(numHomens),
        avaria: avaria === "" ? 0 : Number(avaria),
        volumes: volumes === "" ? 0 : Number(volumes),
        descricao,
      });

      limparFormulario();
      setErros({});
      await carregar();
      mostrarMensagemCadastro("registro adicionado com sucesso");
      inputFornecedorRef.current?.focus();
    } catch (error) {
      console.error("Erro ao salvar recebimento:", error);
    }
  }

  function selecionarFornecedor(nome) {
    setFornecedor(nome);
    setSelecionado(nome);
    setAbrirLista(false);
    setIndiceAtivo(-1);

    setErros((prev) => ({
      ...prev,
      fornecedor: false,
    }));
  }

  function handleKeyDownFornecedor(e) {
    const total = fornecedoresFiltrados.length;

    if (e.key === "Backspace" || e.key === "Delete") {
      if (fornecedor) {
        setFornecedor("");
        setSelecionado("");
        setAbrirLista(true);
        setIndiceAtivo(-1);
        e.preventDefault();
      }
      return;
    }

    if (!abrirLista && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setAbrirLista(true);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (total === 0) return;

      setAbrirLista(true);
      setIndiceAtivo((prev) => (prev < total - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (total === 0) return;

      setAbrirLista(true);
      setIndiceAtivo((prev) => (prev > 0 ? prev - 1 : total - 1));
      return;
    }

    if (e.key === "Enter") {
      if (abrirLista && indiceAtivo >= 0 && fornecedoresFiltrados[indiceAtivo]) {
        e.preventDefault();
        selecionarFornecedor(fornecedoresFiltrados[indiceAtivo]);
        inputChegadaRef.current?.focus();
      }
      return;
    }

    if (e.key === "Escape") {
      setAbrirLista(false);
      setIndiceAtivo(-1);
      return;
    }

    if (e.key === "Tab") {
      if (abrirLista && indiceAtivo >= 0 && fornecedoresFiltrados[indiceAtivo]) {
        selecionarFornecedor(fornecedoresFiltrados[indiceAtivo]);
      }
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
    setMensagemCadastro("");
    setMensagemEdicaoId(null);
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
        chegada_na_rua: item.chegada_na_rua || null,
        entrada_no_cd: item.entrada_no_cd || null,
        data: item.data || null,
        nome_motorista: item.nome_motorista || null,
        cpf_motorista: item.cpf_motorista || null,
        placa_carro: item.placa_carro || null,
        qt_notas:
          item.qt_notas === "" ||
          item.qt_notas === null ||
          item.qt_notas === undefined
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
      mostrarMensagemEdicao(item.id);
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
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
      <CadastroRecebimento
        handleSubmit={handleSubmit}
        erros={erros}
        fornecedor={fornecedor}
        setFornecedor={setFornecedor}
        abrirLista={abrirLista}
        setAbrirLista={setAbrirLista}
        selecionado={selecionado}
        indiceAtivo={indiceAtivo}
        setIndiceAtivo={setIndiceAtivo}
        fornecedoresFiltrados={fornecedoresFiltrados}
        selecionarFornecedor={selecionarFornecedor}
        handleKeyDownFornecedor={handleKeyDownFornecedor}
        containerRef={containerRef}
        inputFornecedorRef={inputFornecedorRef}
        inputChegadaRef={inputChegadaRef}
        chegadaNaRua={chegadaNaRua}
        setChegadaNaRua={setChegadaNaRua}
        entradaNoCd={entradaNoCd}
        setEntradaNoCd={setEntradaNoCd}
        data={data}
        setData={setData}
        horarioInicio={horarioInicio}
        setHorarioInicio={setHorarioInicio}
        horarioFinal={horarioFinal}
        setHorarioFinal={setHorarioFinal}
        descontoHora={descontoHora}
        setDescontoHora={setDescontoHora}
        numeroPalet={numeroPalet}
        setNumeroPalet={setNumeroPalet}
        tipoCarga={tipoCarga}
        setTipoCarga={setTipoCarga}
        numHomens={numHomens}
        setNumHomens={setNumHomens}
        avaria={avaria}
        setAvaria={setAvaria}
        volumes={volumes}
        setVolumes={setVolumes}
        descricao={descricao}
        setDescricao={setDescricao}
        setErros={setErros}
        listaRef={listaRef}
        mensagem={mensagemCadastro}
      />

      <Registros
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
        mensagemEdicaoId={mensagemEdicaoId}
      />
    </>
  );
}

export default RecebimentoPage;