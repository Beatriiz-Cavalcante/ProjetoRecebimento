import "./Registrosportaria.css";

function Registrosportaria({
  lista,
  calcularStatusRegistro,
  getStatusStyle,
  formatarDataBR,
  editandoId,
  iniciarEdicao,
  cancelarEdicao,
  handleChangeCampoRegistro,
  salvarEdicaoRegistro,
}) {
  return (
    <>
      <h2 className="mb-3">Registros Portaria</h2>

      {lista.length === 0 ? (
        <div className="alert alert-light border">Nenhum registro encontrado.</div>
      ) : (
        <div className="container-registros">
          <div className="d-flex flex-column gap-3">
            {lista.map((item) => {
              const statusExibido = calcularStatusRegistro(item);
              const emEdicao = editandoId === item.id;

              return (
                <div key={item.id} className="card shadow-sm registro-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-1 d-flex align-items-center gap-2 flex-wrap">
                          #{item.id} -{" "}
                          {emEdicao ? (
                            <input
                              type="text"
                              className="form-control"
                              value={item.fornecedor || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "fornecedor",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            item.fornecedor || "Sem fornecedor"
                          )}
                        </h5>

                        <div className="text-muted registro-data mt-2">
                          {emEdicao ? (
                            <div>
                              <strong>Data:</strong>
                              <input
                                type="date"
                                className="form-control mt-1"
                                value={item.data || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "data", e.target.value)
                                }
                              />
                            </div>
                          ) : (
                            <>Data: {formatarDataBR(item.data)}</>
                          )}
                        </div>
                      </div>

                      <span
                        className="registro-status-badge"
                        style={getStatusStyle(statusExibido)}
                      >
                        {statusExibido}
                      </span>
                    </div>

                    <div className="row g-2 mb-3">
                      <div className="col-md-3">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Nome Motorista:</strong>
                          {emEdicao ? (
                            <input
                              type="text"
                              className="form-control mt-1"
                              value={item.nome_motorista || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "nome_motorista",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{item.nome_motorista || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>CPF Motorista:</strong>
                          {emEdicao ? (
                            <input
                              type="text"
                              className="form-control mt-1"
                              value={item.cpf_motorista || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "cpf_motorista",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{item.cpf_motorista || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Placa Carro:</strong>
                          {emEdicao ? (
                            <input
                              type="text"
                              className="form-control mt-1"
                              value={item.placa_carro || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "placa_carro",
                                  e.target.value.toUpperCase()
                                )
                              }
                            />
                          ) : (
                            <div>{item.placa_carro || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Quantidade de Notas:</strong>
                          {emEdicao ? (
                            <input
                              type="number"
                              className="form-control mt-1"
                              value={item.qt_notas ?? ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "qt_notas",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{item.qt_notas ?? "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Chegada na Rua:</strong>
                          {emEdicao ? (
                            <input
                              type="time"
                              className="form-control mt-1"
                              value={item.chegada_na_rua || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "chegada_na_rua",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{item.chegada_na_rua || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Entrada no CD:</strong>
                          {emEdicao ? (
                            <input
                              type="time"
                              className="form-control mt-1"
                              value={item.entrada_no_cd || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "entrada_no_cd",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{item.entrada_no_cd || "-"}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 d-flex gap-2 flex-wrap">
                      {emEdicao ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => salvarEdicaoRegistro(item)}
                          >
                            Salvar
                          </button>

                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={cancelarEdicao}
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-warning"
                          onClick={() => iniciarEdicao(item.id)}
                        >
                          Editar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default Registrosportaria;