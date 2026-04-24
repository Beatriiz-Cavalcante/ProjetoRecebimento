import "./CadastroRecebimento.css";

function CadastroRecebimento({
  handleSubmit,
  erros,
  fornecedor,
  setFornecedor,
  abrirLista,
  setAbrirLista,
  selecionado,
  indiceAtivo,
  setIndiceAtivo,
  fornecedoresFiltrados,
  selecionarFornecedor,
  handleKeyDownFornecedor,
  containerRef,
  inputFornecedorRef,
  inputChegadaRef,
  chegadaNaRua,
  setChegadaNaRua,
  entradaNoCd,
  setEntradaNoCd,
  data,
  setData,
  horarioInicio,
  setHorarioInicio,
  horarioFinal,
  setHorarioFinal,
  descontoHora,
  setDescontoHora,
  numeroPalet,
  setNumeroPalet,
  tipoCarga,
  setTipoCarga,
  numHomens,
  setNumHomens,
  avaria,
  setAvaria,
  volumes,
  setVolumes,
  descricao,
  setDescricao,
  setErros,
  listaRef,
  mensagem,
}) {
  return (
    <>
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
            <label className="form-label">Chegada na Rua</label>
            <input
              ref={inputChegadaRef}
              className="form-control"
              type="time"
              value={chegadaNaRua}
              onChange={(e) => setChegadaNaRua(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Entrada no CD</label>
            <input
              className="form-control"
              type="time"
              value={entradaNoCd}
              onChange={(e) => setEntradaNoCd(e.target.value)}
            />
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
            <label className="form-label">Horário Início</label>
            <input
              className="form-control"
              type="time"
              value={horarioInicio}
              onChange={(e) => setHorarioInicio(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Horário Final</label>
            <input
              className="form-control"
              type="time"
              value={horarioFinal}
              onChange={(e) => setHorarioFinal(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Desconto Hora</label>
            <input
              className="form-control"
              type="time"
              value={descontoHora}
              onChange={(e) => setDescontoHora(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Número Palet</label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={numeroPalet}
              onChange={(e) => setNumeroPalet(e.target.value)}
            />
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Tipo Carga</label>
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
          </div>

          <div className="col-md-3 mb-3">
            <label className="form-label">Nº Homens</label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={numHomens}
              onChange={(e) => setNumHomens(e.target.value)}
            />
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

          <div className="col-md-6 mb-3">
            <label className="form-label">Volumes</label>
            <input
              className="form-control"
              type="number"
              min="0"
              value={volumes}
              onChange={(e) => setVolumes(e.target.value)}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Descrição da Avaria</label>
            <textarea
              className="form-control textarea-auto"
              rows="1"
              value={descricao}
              onChange={(e) => {
                setDescricao(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          </div>
        </div>

        <button className="btn btn-primary" type="submit">
          Enviar
        </button>

        {mensagem && (
          <div className="mt-2 text-success fw-semibold">
            {mensagem}
          </div>
        )}
      </form>
    </>
  );
}

export default CadastroRecebimento;