import { useState } from "react";

function CadastroRecebimentoPortaria({ onSubmit }) {
  const [fornecedor, setFornecedor] = useState("");
  const [data, setData] = useState("");
  const [chegadaNaRua, setChegadaNaRua] = useState("");
  const [entradaNoCd, setEntradaNoCd] = useState("");

  const [nomeMotorista, setNomeMotorista] = useState("");
  const [cpfMotorista, setCpfMotorista] = useState("");
  const [placaCarro, setPlacaCarro] = useState("");
  const [quantidadeNotas, setQuantidadeNotas] = useState("");

  const [erros, setErros] = useState({});

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
      qt_notas: quantidadeNotas,
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
            <div className="col-md-6">
              <label className="form-label fw-semibold">Fornecedor</label>
              <input
                type="text"
                className={`form-control ${erros.fornecedor ? "is-invalid" : ""}`}
                value={fornecedor}
                onChange={(e) => setFornecedor(e.target.value)}
                placeholder="Digite o fornecedor"
              />
              {erros.fornecedor && (
                <div className="invalid-feedback">Campo obrigatório.</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Data</label>
              <input
                type="date"
                className={`form-control ${erros.data ? "is-invalid" : ""}`}
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
              {erros.data && (
                <div className="invalid-feedback">Campo obrigatório.</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Chegada na Rua</label>
              <input
                type="time"
                className={`form-control ${erros.chegadaNaRua ? "is-invalid" : ""}`}
                value={chegadaNaRua}
                onChange={(e) => setChegadaNaRua(e.target.value)}
              />
              {erros.chegadaNaRua && (
                <div className="invalid-feedback">Campo obrigatório.</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Entrada no CD</label>
              <input
                type="time"
                className={`form-control ${erros.entradaNoCd ? "is-invalid" : ""}`}
                value={entradaNoCd}
                onChange={(e) => setEntradaNoCd(e.target.value)}
              />
              {erros.entradaNoCd && (
                <div className="invalid-feedback">Campo obrigatório.</div>
              )}
            </div>

            <div className="col-md-5">
              <label className="form-label fw-semibold">Nome do Motorista</label>
              <input
                type="text"
                className={`form-control ${erros.nomeMotorista ? "is-invalid" : ""}`}
                value={nomeMotorista}
                onChange={(e) => setNomeMotorista(e.target.value)}
                placeholder="Digite o nome do motorista"
              />
              {erros.nomeMotorista && (
                <div className="invalid-feedback">Campo obrigatório.</div>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">CPF do Motorista</label>
              <input
                type="text"
                className={`form-control ${erros.cpfMotorista ? "is-invalid" : ""}`}
                value={cpfMotorista}
                onChange={(e) => setCpfMotorista(e.target.value)}
                placeholder="Digite o CPF"
              />
              {erros.cpfMotorista && (
                <div className="invalid-feedback">Campo obrigatório.</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Placa do Carro</label>
              <input
                type="text"
                className={`form-control ${erros.placaCarro ? "is-invalid" : ""}`}
                value={placaCarro}
                onChange={(e) => setPlacaCarro(e.target.value.toUpperCase())}
                placeholder="ABC1D23"
              />
              {erros.placaCarro && (
                <div className="invalid-feedback">Campo obrigatório.</div>
              )}
            </div>

            <div className="col-md-3">
              <label className="form-label fw-semibold">Quantidade de Notas</label>
              <input
                type="number"
                min="0"
                className={`form-control ${erros.quantidadeNotas ? "is-invalid" : ""}`}
                value={quantidadeNotas}
                onChange={(e) => setQuantidadeNotas(e.target.value)}
                placeholder="0"
              />
              {erros.quantidadeNotas && (
                <div className="invalid-feedback">Campo obrigatório.</div>
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
        </form>
      </div>
    </div>
  );
}

export default CadastroRecebimentoPortaria;