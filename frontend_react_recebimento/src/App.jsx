import { useEffect, useRef, useState } from "react";
import { getRecebimentos, criarRecebimento } from "./services/api";
import "./Appcss.css";
import CadastroRecebimento from "./components/CadastroRecebimento/CadastroRecebimento";
import Registros from "./components/Registros/Registros";

function App() {
  const [lista, setLista] = useState([]);

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

  const containerRef = useRef(null);
  const inputFornecedorRef = useRef(null);
  const inputChegadaRef = useRef(null);
  const listaRef = useRef(null);

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
    return (Array.isArray(dados) ? dados : []).map((item) => {
      const statusCalculado = calcularStatusRegistro(item);

      return {
        ...item,
        status_manual: item.status_manual || statusCalculado,
        observacao_status:
          item.observacao_status && String(item.observacao_status).trim() !== ""
            ? item.observacao_status
            : gerarObservacaoAutomatica(item),
      };
    });
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    if (!chegadaNaRua) novosErros.chegadaNaRua = true;
    if (!entradaNoCd) novosErros.entradaNoCd = true;
    if (!data) novosErros.data = true;
    if (!horarioInicio) novosErros.horarioInicio = true;
    if (!horarioFinal) novosErros.horarioFinal = true;
    if (!descontoHora) novosErros.descontoHora = true;
    if (numeroPalet === "") novosErros.numeroPalet = true;
    if (!tipoCarga) novosErros.tipoCarga = true;
    if (numHomens === "") novosErros.numHomens = true;

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    try {
      await criarRecebimento({
        fornecedor,
        chegada_na_rua: chegadaNaRua,
        entrada_no_cd: entradaNoCd,
        data,
        horario_inicio: horarioInicio,
        horario_final: horarioFinal,
        desconto_hora: descontoHora,
        numero_palet: Number(numeroPalet),
        tipo_carga: tipoCarga,
        num_homens: Number(numHomens),
        avaria: avaria === "" ? 0 : Number(avaria),
        volumes: volumes === "" ? 0 : Number(volumes),
        descricao,
      });

      limparFormulario();
      setErros({});
      await carregar();
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
      setIndiceAtivo((prev) => {
        if (prev < total - 1) return prev + 1;
        return 0;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (total === 0) return;

      setAbrirLista(true);
      setIndiceAtivo((prev) => {
        if (prev > 0) return prev - 1;
        return total - 1;
      });
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

  function handleChangeStatus(id, novoStatus) {
    setLista((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status_manual: novoStatus } : item
      )
    );
  }

  return (
    <div className="container mt-4">
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
      />

      <Registros
        lista={lista}
        calcularStatusRegistro={calcularStatusRegistro}
        formatarDataBR={formatarDataBR}
        getStatusStyle={getStatusStyle}
        handleChangeStatus={handleChangeStatus}
        handleChangeObservacao={handleChangeObservacao}
      />
    </div>
  );
}

export default App;
