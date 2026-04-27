import { useEffect, useRef, useState } from "react";

function CadastroRecebimentoPortaria({ onSubmit, mensagem }) {
  const [fornecedor, setFornecedor] = useState("");
  const [data, setData] = useState("");
  const [chegadaNaRua, setChegadaNaRua] = useState("");
  const [entradaNoCd, setEntradaNoCd] = useState("");
  const [horarioSaida, setHorarioSaida] = useState("");

  const [nomeMotorista, setNomeMotorista] = useState("");
  const [cpfMotorista, setCpfMotorista] = useState("");
  const [placaCarro, setPlacaCarro] = useState("");
  const [quantidadeNotas, setQuantidadeNotas] = useState("");
  const [observacaoPortaria, setObservacaoPortaria] = useState("");

  const [erros, setErros] = useState({});
  const [abrirLista, setAbrirLista] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);

  const containerFornecedorRef = useRef(null);
  const inputFornecedorRef = useRef(null);
  const inputDataRef = useRef(null);
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

  function validarCPF(cpf) {
    cpf = String(cpf || "").replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    if (resto !== parseInt(cpf.substring(9, 10), 10)) {
      return false;
    }

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
    }

    resto = (soma * 10) % 11;

    if (resto === 10 || resto === 11) {
      resto = 0;
    }

    return resto === parseInt(cpf.substring(10, 11), 10);
  }

  function salvarComValidacao(item) {
    if (!validarCPF(item.cpf_motorista)) {
      alert("CPF inválido. Verifique o CPF antes de salvar.");
      return;
    }

    const itemAjustado = {
      ...item,
      cpf_motorista: String(item.cpf_motorista || "").replace(/\D/g, ""),
    };

    salvarEdicaoRegistro(itemAjustado);
  }

  useEffect(() => {
    function handleClickFora(event) {
      if (
        containerFornecedorRef.current &&
        !containerFornecedorRef.current.contains(event.target)
      ) {
        setAbrirLista(false);
        setIndiceAtivo(-1);
      }
    }

    document.addEventListener("mousedown", handleClickFora);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
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

  function selecionarFornecedor(nome) {
    setFornecedor(nome);
    setAbrirLista(false);
    setIndiceAtivo(-1);
    setErros((prev) => ({ ...prev, fornecedor: "" }));
    inputDataRef.current?.focus();
  }

  function handleKeyDownFornecedor(e) {
    const total = fornecedoresFiltrados.length;

    if (e.key === "Backspace" || e.key === "Delete") {
      if (fornecedor) {
        setFornecedor("");
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

      setIndiceAtivo((prev) => (prev < total - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (total === 0) return;

      setIndiceAtivo((prev) => (prev > 0 ? prev - 1 : total - 1));
      return;
    }

    if (e.key === "Enter") {
      if (abrirLista && indiceAtivo >= 0 && fornecedoresFiltrados[indiceAtivo]) {
        e.preventDefault();
        selecionarFornecedor(fornecedoresFiltrados[indiceAtivo]);
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

  function limparFormulario() {
    setFornecedor("");
    setData("");
    setChegadaNaRua("");
    setEntradaNoCd("");
    setHorarioSaida("");
    setNomeMotorista("");
    setCpfMotorista("");
    setPlacaCarro("");
    setQuantidadeNotas("");
    setObservacaoPortaria("");
    setErros({});
    setAbrirLista(false);
    setIndiceAtivo(-1);
    inputFornecedorRef.current?.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = {};

    if (!fornecedor.trim()) {
      novosErros.fornecedor = "Campo obrigatório";
    }

    if (!data) {
      novosErros.data = "Campo obrigatório";
    }

    if (!chegadaNaRua) {
      novosErros.chegadaNaRua = "Campo obrigatório";
    }

    if (!nomeMotorista.trim()) {
      novosErros.nomeMotorista = "Campo obrigatório";
    }

    if (!cpfMotorista.trim()) {
      novosErros.cpfMotorista = "Campo obrigatório";
    } else if (!validarCPF(cpfMotorista)) {
      novosErros.cpfMotorista = "CPF inválido";
    }

    if (!placaCarro.trim()) {
      novosErros.placaCarro = "Campo obrigatório";
    }

    if (quantidadeNotas === "" || quantidadeNotas === null) {
      novosErros.quantidadeNotas = "Campo obrigatório";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      return;
    }

    const dados = {
      fornecedor,
      data,
      chegada_na_rua: chegadaNaRua,
      entrada_no_cd: entradaNoCd,
      horario_saida: horarioSaida,
      nome_motorista: nomeMotorista,
      cpf_motorista: cpfMotorista.replace(/\D/g, ""),
      placa_carro: placaCarro,
      qt_notas: Number(quantidadeNotas),
      observacao_portaria: observacaoPortaria,
    };

    if (onSubmit) {
      onSubmit(dados);
    }

    limparFormulario();
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h2 className="mb-4">Cadastro Recebimento Portaria</h2>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div
              className="col-md-6 position-relative"
              ref={containerFornecedorRef}
            >
              <label className="form-label fw-semibold">Fornecedor</label>

              <input
                ref={inputFornecedorRef}
                type="text"
                className={`form-control ${
                  erros.fornecedor ? "is-invalid" : ""
                }`}
                value={fornecedor}
                onFocus={() => setAbrirLista(true)}
                onChange={(e) => {
                  setFornecedor(e.target.value);
                  setAbrirLista(true);
                  setIndiceAtivo(-1);
                  setErros((prev) => ({ ...prev, fornecedor: "" }));
                }}
                onKeyDown={handleKeyDownFornecedor}
                autoComplete="off"
                placeholder="Digite ou selecione o fornecedor"
              />

              {abrirLista && fornecedoresFiltrados.length > 0 && (
                <ul className="lista-fornecedores" ref={listaRef}>
                  {fornecedoresFiltrados.map((nome, index) => (
                    <li
                      key={nome}
                      className={`item-fornecedor ${
                        index === indiceAtivo ? "ativo" : ""
                      }`}
                      onMouseEnter={() => setIndiceAtivo(index)}
                      onMouseDown={() => selecionarFornecedor(nome)}
                    >
                      {nome}
                    </li>
                  ))}
                </ul>
              )}

              {erros.fornecedor && (
                <div className="invalid-feedback d-block">
                  {erros.fornecedor}
                </div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Data</label>
              <input
                ref={inputDataRef}
                type="date"
                className={`form-control ${erros.data ? "is-invalid" : ""}`}
                value={data}
                onChange={(e) => {
                  setData(e.target.value);
                  setErros((prev) => ({ ...prev, data: "" }));
                }}
              />

              {erros.data && (
                <div className="invalid-feedback">{erros.data}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Chegada na Rua</label>
              <input
                type="time"
                className={`form-control ${
                  erros.chegadaNaRua ? "is-invalid" : ""
                }`}
                value={chegadaNaRua}
                onChange={(e) => {
                  setChegadaNaRua(e.target.value);
                  setErros((prev) => ({ ...prev, chegadaNaRua: "" }));
                }}
              />

              {erros.chegadaNaRua && (
                <div className="invalid-feedback">{erros.chegadaNaRua}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Entrada no CD </label>
              <input
                type="time"
                className="form-control"
                value={entradaNoCd}
                onChange={(e) => {
                  setEntradaNoCd(e.target.value);
                }}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Horário Saída </label>
              <input
                type="time"
                className="form-control"
                value={horarioSaida}
                onChange={(e) => {
                  setHorarioSaida(e.target.value);
                }}
              />
            </div>

            <div className="col-md-5">
              <label className="form-label fw-semibold">Nome do Motorista</label>
              <input
                type="text"
                className={`form-control ${
                  erros.nomeMotorista ? "is-invalid" : ""
                }`}
                value={nomeMotorista}
                onChange={(e) => {
                  setNomeMotorista(e.target.value);
                  setErros((prev) => ({ ...prev, nomeMotorista: "" }));
                }}
              />

              {erros.nomeMotorista && (
                <div className="invalid-feedback">{erros.nomeMotorista}</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">CPF</label>

              <input
                type="text"
                className={`form-control ${
                  erros.cpfMotorista ? "is-invalid" : ""
                }`}
                value={cpfMotorista}
                maxLength={14}
                onChange={(e) => {
                  setCpfMotorista(e.target.value);
                  setErros((prev) => ({ ...prev, cpfMotorista: "" }));
                }}
                onBlur={() => {
                  if (!cpfMotorista.trim()) {
                    setErros((prev) => ({
                      ...prev,
                      cpfMotorista: "Campo obrigatório",
                    }));
                    return;
                  }

                  if (!validarCPF(cpfMotorista)) {
                    setErros((prev) => ({
                      ...prev,
                      cpfMotorista: "CPF inválido",
                    }));
                  }
                }}
              />

              {erros.cpfMotorista && (
                <div className="invalid-feedback d-block">
                  {erros.cpfMotorista}
                </div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Placa</label>
              <input
                type="text"
                className={`form-control ${
                  erros.placaCarro ? "is-invalid" : ""
                }`}
                value={placaCarro}
                maxLength={7}
                onChange={(e) => {
                  setPlacaCarro(e.target.value.toUpperCase());
                  setErros((prev) => ({ ...prev, placaCarro: "" }));
                }}
              />

              {erros.placaCarro && (
                <div className="invalid-feedback">{erros.placaCarro}</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Qtd Notas</label>
              <input
                type="number"
                min="0"
                className={`form-control ${
                  erros.quantidadeNotas ? "is-invalid" : ""
                }`}
                value={quantidadeNotas}
                onChange={(e) => {
                  setQuantidadeNotas(e.target.value);
                  setErros((prev) => ({ ...prev, quantidadeNotas: "" }));
                }}
              />

              {erros.quantidadeNotas && (
                <div className="invalid-feedback">
                  {erros.quantidadeNotas}
                </div>
              )}
            </div>

            <div className="col-md-12">
              <label className="form-label fw-semibold">
                Observação Portaria
              </label>
              <textarea
                className="form-control"
                rows="2"
                value={observacaoPortaria}
                onChange={(e) => setObservacaoPortaria(e.target.value)}
                placeholder="Digite uma observação da portaria"
              />
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-primary">
              Salvar
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={limparFormulario}
            >
              Limpar
            </button>
          </div>

          {mensagem && (
            <div className="mt-2 text-success fw-semibold">{mensagem}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CadastroRecebimentoPortaria;