import { useEffect, useRef, useState } from "react";

function CadastroRecebimentoPortaria({ onSubmit, mensagem }) {
  const [fornecedor, setFornecedor] = useState("");
  const [data, setData] = useState("");
  const [chegadaNaRua, setChegadaNaRua] = useState("");
  const [entradaNoCd, setEntradaNoCd] = useState("");

  const [nomeMotorista, setNomeMotorista] = useState("");
  const [cpfMotorista, setCpfMotorista] = useState("");
  const [placaCarro, setPlacaCarro] = useState("");
  const [quantidadeNotas, setQuantidadeNotas] = useState("");

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
    return () => document.removeEventListener("mousedown", handleClickFora);
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
    setErros((prev) => ({ ...prev, fornecedor: false }));
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
    setNomeMotorista("");
    setCpfMotorista("");
    setPlacaCarro("");
    setQuantidadeNotas("");
    setErros({});
    setAbrirLista(false);
    setIndiceAtivo(-1);
    inputFornecedorRef.current?.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();

    const novosErros = {};

    if (!fornecedor.trim()) novosErros.fornecedor = true;
    if (!data) novosErros.data = true;
    if (!chegadaNaRua) novosErros.chegadaNaRua = true;
    if (!entradaNoCd) novosErros.entradaNoCd = true;
    if (!nomeMotorista.trim()) novosErros.nomeMotorista = true;
    if (!cpfMotorista.trim()) novosErros.cpfMotorista = true;
    if (!placaCarro.trim()) novosErros.placaCarro = true;
    if (quantidadeNotas === "" || quantidadeNotas === null) {
      novosErros.quantidadeNotas = true;
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) return;

    const dados = {
      fornecedor,
      data,
      chegada_na_rua: chegadaNaRua,
      entrada_no_cd: entradaNoCd,
      nome_motorista: nomeMotorista,
      cpf_motorista: cpfMotorista,
      placa_carro: placaCarro,
      qt_notas: Number(quantidadeNotas),
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
                className={`form-control ${erros.fornecedor ? "is-invalid" : ""}`}
                value={fornecedor}
                onFocus={() => setAbrirLista(true)}
                onChange={(e) => {
                  setFornecedor(e.target.value);
                  setAbrirLista(true);
                  setIndiceAtivo(-1);
                  setErros((prev) => ({ ...prev, fornecedor: false }));
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
                  Campo obrigatório
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
                  setErros((prev) => ({ ...prev, data: false }));
                }}
              />
              {erros.data && (
                <div className="invalid-feedback">Campo obrigatório</div>
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
                  setErros((prev) => ({ ...prev, chegadaNaRua: false }));
                }}
              />
              {erros.chegadaNaRua && (
                <div className="invalid-feedback">Campo obrigatório</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Entrada no CD</label>
              <input
                type="time"
                className={`form-control ${
                  erros.entradaNoCd ? "is-invalid" : ""
                }`}
                value={entradaNoCd}
                onChange={(e) => {
                  setEntradaNoCd(e.target.value);
                  setErros((prev) => ({ ...prev, entradaNoCd: false }));
                }}
              />
              {erros.entradaNoCd && (
                <div className="invalid-feedback">Campo obrigatório</div>
              )}
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
                  setErros((prev) => ({ ...prev, nomeMotorista: false }));
                }}
              />
              {erros.nomeMotorista && (
                <div className="invalid-feedback">Campo obrigatório</div>
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
                onChange={(e) => {
                  setCpfMotorista(e.target.value);
                  setErros((prev) => ({ ...prev, cpfMotorista: false }));
                }}
              />
              {erros.cpfMotorista && (
                <div className="invalid-feedback">Campo obrigatório</div>
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
                onChange={(e) => {
                  setPlacaCarro(e.target.value.toUpperCase());
                  setErros((prev) => ({ ...prev, placaCarro: false }));
                }}
              />
              {erros.placaCarro && (
                <div className="invalid-feedback">Campo obrigatório</div>
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
                  setErros((prev) => ({ ...prev, quantidadeNotas: false }));
                }}
              />
              {erros.quantidadeNotas && (
                <div className="invalid-feedback">Campo obrigatório</div>
              )}
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
            <div className="mt-2 text-success fw-semibold">
              {mensagem}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CadastroRecebimentoPortaria;