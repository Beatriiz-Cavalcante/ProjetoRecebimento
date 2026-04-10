import { useEffect, useRef, useState } from "react";
import {
  getRecebimentos,
  criarRecebimento,
  atualizarRecebimento,
} from "./services/api";
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

  const [editandoId, setEditandoId] = useState(null);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [salvandoEdicao, setSalvandoEdicao] = useState(false);

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

  function iniciarEdicao(item) {
    setEditandoId(item.id);
    setRegistroEditando({
      id: item.id,
      fornecedor: item.fornecedor || "",
      chegada_na_rua: item.chegada_na_rua || "",
      entrada_no_cd: item.entrada_no_cd || "",
      data: item.data || "",
      horario_inicio: item.horario_inicio || "",
      horario_final: item.horario_final || "",
      desconto_hora: item.desconto_hora || "",
      numero_palet:
        item.numero_palet !== null && item.numero_palet !== undefined
          ? String(item.numero_palet)
          : "",
      tipo_carga: item.tipo_carga || "PAL",
      num_homens:
        item.num_homens !== null && item.num_homens !== undefined
          ? String(item.num_homens)
          : "",
      avaria:
        item.avaria !== null && item.avaria !== undefined
          ? String(item.avaria)
          : "",
      volumes:
        item.volumes !== null && item.volumes !== undefined
          ? String(item.volumes)
          : "",
      descricao: item.descricao || "",
      status_manual: item.status_manual || calcularStatusRegistro(item),
      observacao_status: item.observacao_status || "",
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setRegistroEditando(null);
  }

  function handleChangeEdicao(campo, valor) {
    setRegistroEditando((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function salvarEdicao(id) {
    if (!registroEditando) return;

    setSalvandoEdicao(true);

    try {
      const payload = {
        fornecedor: registroEditando.fornecedor,
        chegada_na_rua: registroEditando.chegada_na_rua,
        entrada_no_cd: registroEditando.entrada_no_cd,
        data: registroEditando.data,
        horario_inicio: registroEditando.horario_inicio,
        horario_final: registroEditando.horario_final,
        desconto_hora: registroEditando.desconto_hora,
        numero_palet:
          registroEditando.numero_palet === ""
            ? null
            : Number(registroEditando.numero_palet),
        tipo_carga: registroEditando.tipo_carga,
        num_homens:
          registroEditando.num_homens === ""
            ? null
            : Number(registroEditando.num_homens),
        avaria:
          registroEditando.avaria === ""
            ? 0
            : Number(registroEditando.avaria),
        volumes:
          registroEditando.volumes === ""
            ? 0
            : Number(registroEditando.volumes),
        descricao: registroEditando.descricao,
        status_manual: registroEditando.status_manual,
        observacao_status: registroEditando.observacao_status,
      };

      await atualizarRecebimento(id, payload);
      await carregar();
      cancelarEdicao();
    } catch (error) {
      console.error("Erro ao atualizar recebimento:", error);
      alert("Erro ao salvar edição.");
    } finally {
      setSalvandoEdicao(false);
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

      <h2 className="mb-3">Registros</h2>

      {lista.length === 0 ? (
        <div className="alert alert-light border">Nenhum registro encontrado.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {lista.map((item) => {
            const statusExibido = item.status_manual || calcularStatusRegistro(item);
            const emEdicao = editandoId === item.id;

            return (
              <div
                key={item.id}
                className="card shadow-sm"
                style={{ borderRadius: "12px" }}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                      <h5 className="card-title mb-1">
                        #{item.id} - {item.fornecedor || "Sem fornecedor"}
                      </h5>
                      <div className="text-muted" style={{ fontSize: "14px" }}>
                        Data: {formatarDataBR(item.data)}
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span
                        style={{
                          ...getStatusStyle(statusExibido),
                          padding: "6px 12px",
                          borderRadius: "20px",
                          fontWeight: "700",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {statusExibido}
                      </span>

                      {!emEdicao ? (
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => iniciarEdicao(item)}
                        >
                          Editar
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => salvarEdicao(item.id)}
                            disabled={salvandoEdicao}
                          >
                            {salvandoEdicao ? "Salvando..." : "Salvar"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={cancelarEdicao}
                            disabled={salvandoEdicao}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Fornecedor:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            value={registroEditando.fornecedor}
                            onChange={(e) =>
                              handleChangeEdicao("fornecedor", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.fornecedor || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Chegada na Rua:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="time"
                            value={registroEditando.chegada_na_rua}
                            onChange={(e) =>
                              handleChangeEdicao("chegada_na_rua", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.chegada_na_rua || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Entrada no CD:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="time"
                            value={registroEditando.entrada_no_cd}
                            onChange={(e) =>
                              handleChangeEdicao("entrada_no_cd", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.entrada_no_cd || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Data:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="date"
                            value={registroEditando.data}
                            onChange={(e) =>
                              handleChangeEdicao("data", e.target.value)
                            }
                          />
                        ) : (
                          <div>{formatarDataBR(item.data)}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Horário Início:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="time"
                            value={registroEditando.horario_inicio}
                            onChange={(e) =>
                              handleChangeEdicao("horario_inicio", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.horario_inicio || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Horário Final:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="time"
                            value={registroEditando.horario_final}
                            onChange={(e) =>
                              handleChangeEdicao("horario_final", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.horario_final || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Desconto Hora:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="time"
                            value={registroEditando.desconto_hora}
                            onChange={(e) =>
                              handleChangeEdicao("desconto_hora", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.desconto_hora || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Número Palet:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="number"
                            min="0"
                            value={registroEditando.numero_palet}
                            onChange={(e) =>
                              handleChangeEdicao("numero_palet", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.numero_palet ?? "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Tipo Carga:</strong>
                        {emEdicao ? (
                          <select
                            className="form-select mt-1"
                            value={registroEditando.tipo_carga}
                            onChange={(e) =>
                              handleChangeEdicao("tipo_carga", e.target.value)
                            }
                          >
                            <option value="PAL">PAL</option>
                            <option value="BAT">BAT</option>
                          </select>
                        ) : (
                          <div>{item.tipo_carga || "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Nº Homens:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="number"
                            min="0"
                            value={registroEditando.num_homens}
                            onChange={(e) =>
                              handleChangeEdicao("num_homens", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.num_homens ?? "-"}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Avaria:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="number"
                            min="0"
                            value={registroEditando.avaria}
                            onChange={(e) =>
                              handleChangeEdicao("avaria", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.avaria ?? 0}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Volumes:</strong>
                        {emEdicao ? (
                          <input
                            className="form-control mt-1"
                            type="number"
                            min="0"
                            value={registroEditando.volumes}
                            onChange={(e) =>
                              handleChangeEdicao("volumes", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.volumes ?? 0}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="border rounded p-2 h-100">
                        <strong>Descrição:</strong>
                        {emEdicao ? (
                          <textarea
                            className="form-control mt-1"
                            rows="2"
                            value={registroEditando.descricao}
                            onChange={(e) =>
                              handleChangeEdicao("descricao", e.target.value)
                            }
                          />
                        ) : (
                          <div>{item.descricao || "-"}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Editar status</label>
                    {emEdicao ? (
                      <select
                        className="form-select"
                        style={{ maxWidth: "220px" }}
                        value={registroEditando.status_manual}
                        onChange={(e) =>
                          handleChangeEdicao("status_manual", e.target.value)
                        }
                      >
                        <option value="PENDENTE">PENDENTE</option>
                        <option value="RESOLVIDO">RESOLVIDO</option>
                      </select>
                    ) : (
                      <select
                        className="form-select"
                        style={{ maxWidth: "220px" }}
                        value={statusExibido}
                        onChange={(e) => handleChangeStatus(item.id, e.target.value)}
                      >
                        <option value="PENDENTE">PENDENTE</option>
                        <option value="RESOLVIDO">RESOLVIDO</option>
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="form-label fw-semibold">
                      Campo editável / observação
                    </label>

                    {emEdicao ? (
                      <textarea
                        className="form-control"
                        rows="3"
                        value={registroEditando.observacao_status || ""}
                        onChange={(e) =>
                          handleChangeEdicao("observacao_status", e.target.value)
                        }
                        placeholder="Digite uma observação para este registro"
                      />
                    ) : (
                      <textarea
                        className="form-control"
                        rows="3"
                        value={item.observacao_status || ""}
                        onChange={(e) =>
                          handleChangeObservacao(item.id, e.target.value)
                        }
                        placeholder="Digite uma observação para este registro"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;