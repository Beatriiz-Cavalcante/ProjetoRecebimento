import "./Registros.css";

function Registros({
  lista,
  calcularStatusRegistro,
  getStatusStyle,
  formatarDataBR,
  handleChangeObservacao,
  editandoId,
  iniciarEdicao,
  cancelarEdicao,
  handleChangeCampoRegistro,
  salvarEdicaoRegistro,
  handleChangeObservacaoManual,
}) {
  return (
    <>
      <h2 className="mb-3">Registros</h2>

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
                      <div className="lex-grow-1">
                        <h5 className="card-title mb-1 d-flex align-items-center gap-2 flex-wrap">
                          #{item.id} -{" "}
                          {emEdicao ? (
                            <input
                              type="text"
                              className="form-control"
                              value={item.fornecedor || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(item.id, "fornecedor", e.target.value)
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

                    {!emEdicao && (
                      <>
                        <div className="mb-3">
                          <label className="form-label fw-semibold">Observação Status: </label> {" "}
                          <span>{item.observacao_status || "-"}</span>
                        </div>

                        <div className="mb-3 observacao-linha">
                          <span className="fw-semibold">Observação:</span>
                          {emEdicao ? (
                            <input
                              type="text"
                              className="input-linha"
                              value={item.observacao_manual || ""}
                              onChange={(e) =>
                                handleChangeObservacaoManual(item.id, e.target.value)
                              }
                              placeholder="Digite uma observação"
                            />
                          ) : (
                            <span className="texto-linha">
                              {item.observacao_manual || "\u00A0"}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    {emEdicao && (
                      <>
                        <div className="row g-2 mb-3">
                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Chegada na Rua:</strong>
                              <input
                                type="time"
                                className="form-control mt-1"
                                value={item.chegada_na_rua || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "chegada_na_rua", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Entrada no CD:</strong>
                              <input
                                type="time"
                                className="form-control mt-1"
                                value={item.entrada_no_cd || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "entrada_no_cd", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Horário Início:</strong>
                              <input
                                type="time"
                                className="form-control mt-1"
                                value={item.horario_inicio || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "horario_inicio", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Horário Final:</strong>
                              <input
                                type="time"
                                className="form-control mt-1"
                                value={item.horario_final || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "horario_final", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Desconto Hora:</strong>
                              <input
                                type="time"
                                className="form-control mt-1"
                                value={item.desconto_hora || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "desconto_hora", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Número Palet:</strong>
                              <input
                                type="number"
                                className="form-control mt-1"
                                value={item.numero_palet ?? ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "numero_palet", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Tipo Carga:</strong>
                              <select
                                className="form-select mt-1"
                                value={item.tipo_carga || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "tipo_carga", e.target.value)
                                }
                              >
                                <option value="">Selecione</option>
                                <option value="PAL">PAL</option>
                                <option value="BAT">BAT</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Nº Homens:</strong>
                              <input
                                type="number"
                                className="form-control mt-1"
                                value={item.num_homens ?? ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "num_homens", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Avaria:</strong>
                              <input
                                type="number"
                                className="form-control mt-1"
                                value={item.avaria ?? ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "avaria", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-4">
                            <div className="border rounded p-2 h-100">
                              <strong>Volumes:</strong>
                              <input
                                type="number"
                                className="form-control mt-1"
                                value={item.volumes ?? ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "volumes", e.target.value)
                                }
                              />
                            </div>
                          </div>

                          <div className="col-md-8">
                            <div className="border rounded p-2 h-100">
                              <strong>Descrição:</strong>
                              <textarea
                                className="form-control mt-1"
                                rows="3"
                                value={item.descricao || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(item.id, "descricao", e.target.value)
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Observação Status: </label> {" "}
                          <span>{item.observacao_status || "-"}</span>
                        </div>

                        <div className="mb-3">
                          <label className="form-label fw-semibold">Observação</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={item.observacao_manual || ""}
                            onChange={(e) =>
                              handleChangeObservacaoManual(item.id, e.target.value)
                            }
                            placeholder="Digite uma observação manual para este registro"
                          />
                        </div>
                      </>
                    )}

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

export default Registros;