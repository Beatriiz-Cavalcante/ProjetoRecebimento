import { useEffect, useRef, useState } from "react";
import { getRecebimentos, criarRecebimento } from "./services/api";
import "./Appcss.css";

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

  async function carregar() {
    try {
      const dados = await getRecebimentos();
      setLista(Array.isArray(dados) ? dados : []);
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
      carregar();
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

  return (
    <div className="container mt-4">
      <h1>Cadastro de Recebimento</h1>

      <form onSubmit={handleSubmit} className="mb-4" noValidate>
        <div className="row">
          <div className="col-md-6 mb-3 position-relative" ref={containerRef}>
            <label className="form-label">
              Fornecedor <span className="campo-obrigatorio">*</span>
            </label>
            <input
              ref={inputFornecedorRef}
              className={`form-control ${erros.fornecedor ? "is-invalid" : ""}`}
              placeholder="Fornecedor"
              value={fornecedor}
              onChange={(e) => {
                setFornecedor(e.target.value);
                setAbrirLista(true);
                setIndiceAtivo(-1);
                setErros((prev) => ({ ...prev, fornecedor: false }));
              }}
              onFocus={() => setAbrirLista(true)}
              onKeyDown={handleKeyDownFornecedor}
              autoComplete="off"
            />
            {erros.fornecedor && (
              <div className="mensagem-erro">campo obrigatório</div>
            )}

            {abrirLista && fornecedoresFiltrados.length > 0 && (
              <ul className="lista-fornecedores" ref={listaRef}>
                {fornecedoresFiltrados.map((item, index) => (
                  <li
                    key={index}
                    className={`item-fornecedor ${
                      selecionado === item ? "selecionado" : ""
                    } ${indiceAtivo === index ? "ativo" : ""}`}
                    onMouseEnter={() => setIndiceAtivo(index)}
                    onClick={() => selecionarFornecedor(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Chegada na Rua <span className="campo-obrigatorio">*</span>
            </label>
            <input
              ref={inputChegadaRef}
              className={`form-control ${erros.chegadaNaRua ? "is-invalid" : ""}`}
              type="time"
              value={chegadaNaRua}
              onChange={(e) => {
                setChegadaNaRua(e.target.value);
                setErros((prev) => ({ ...prev, chegadaNaRua: false }));
              }}
            />
            {erros.chegadaNaRua && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Entrada no CD <span className="campo-obrigatorio">*</span>
            </label>
            <input
              className={`form-control ${erros.entradaNoCd ? "is-invalid" : ""}`}
              type="time"
              value={entradaNoCd}
              onChange={(e) => {
                setEntradaNoCd(e.target.value);
                setErros((prev) => ({ ...prev, entradaNoCd: false }));
              }}
            />
            {erros.entradaNoCd && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Data <span className="campo-obrigatorio">*</span>
            </label>
            <input
              className={`form-control ${erros.data ? "is-invalid" : ""}`}
              type="date"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setErros((prev) => ({ ...prev, data: false }));
              }}
            />
            {erros.data && <div className="mensagem-erro">Campo Obrigatório</div>}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Horário Início <span className="campo-obrigatorio">*</span>
            </label>
            <input
              className={`form-control ${erros.horarioInicio ? "is-invalid" : ""}`}
              type="time"
              value={horarioInicio}
              onChange={(e) => {
                setHorarioInicio(e.target.value);
                setErros((prev) => ({ ...prev, horarioInicio: false }));
              }}
            />
            {erros.horarioInicio && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Horário Final <span className="campo-obrigatorio">*</span>
            </label>
            <input
              className={`form-control ${erros.horarioFinal ? "is-invalid" : ""}`}
              type="time"
              value={horarioFinal}
              onChange={(e) => {
                setHorarioFinal(e.target.value);
                setErros((prev) => ({ ...prev, horarioFinal: false }));
              }}
            />
            {erros.horarioFinal && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Desconto Hora <span className="campo-obrigatorio">*</span>
            </label>
            <input
              className={`form-control ${erros.descontoHora ? "is-invalid" : ""}`}
              type="time"
              value={descontoHora}
              onChange={(e) => {
                setDescontoHora(e.target.value);
                setErros((prev) => ({ ...prev, descontoHora: false }));
              }}
            />
            {erros.descontoHora && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Número Palet <span className="campo-obrigatorio">*</span>
            </label>
            <input
              className={`form-control ${erros.numeroPalet ? "is-invalid" : ""}`}
              type="number"
              min="0"
              value={numeroPalet}
              onChange={(e) => {
                setNumeroPalet(e.target.value);
                setErros((prev) => ({ ...prev, numeroPalet: false }));
              }}
            />
            {erros.numeroPalet && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Tipo Carga <span className="campo-obrigatorio">*</span>
            </label>
            <div
              className={`d-flex gap-2 tipo-carga-box ${
                erros.tipoCarga ? "tipo-carga-erro" : ""
              }`}
            >
              <button
                type="button"
                className={`btn ${
                  tipoCarga === "PAL" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setTipoCarga("PAL");
                  setErros((prev) => ({ ...prev, tipoCarga: false }));
                }}
              >
                PAL
              </button>

              <button
                type="button"
                className={`btn ${
                  tipoCarga === "BAT" ? "btn-primary" : "btn-outline-primary"
                }`}
                onClick={() => {
                  setTipoCarga("BAT");
                  setErros((prev) => ({ ...prev, tipoCarga: false }));
                }}
              >
                BAT
              </button>
            </div>
            {erros.tipoCarga && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">
              Nº Homens <span className="campo-obrigatorio">*</span>
            </label>
            <input
              className={`form-control ${erros.numHomens ? "is-invalid" : ""}`}
              type="number"
              min="0"
              value={numHomens}
              onChange={(e) => {
                setNumHomens(e.target.value);
                setErros((prev) => ({ ...prev, numHomens: false }));
              }}
            />
            {erros.numHomens && (
              <div className="mensagem-erro">Campo Obrigatório</div>
            )}
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Avaria</label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={avaria}
              onChange={(e) => setAvaria(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Volumes</label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={volumes}
              onChange={(e) => setVolumes(e.target.value)}
            />
          </div>

          <div className="col-12 mb-3">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-control"
              rows="3"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          Enviar
        </button>
      </form>

      <h2>Registros</h2>

      <ul className="list-group">
        {lista.map((item, index) => (
          <li key={index} className="list-group-item">
            <strong>{item.fornecedor}</strong> | Data: {item.data} | Chegada na rua:{" "}
            {item.chegada_na_rua}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;