import "./RegistrosPortaria.css";

function RegistrosPortaria({
  registros = [],
  editandoId,
  iniciarEdicao,
  cancelarEdicao,
  handleChangeCampoRegistro,
  salvarEdicaoRegistro,
  mensagemEdicaoId,
}) {
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

  function formatarHora(valor) {
    if (!valor) return "";
    return String(valor).slice(0, 5);
  }

  function validarCPF(cpf) {
    cpf = String(cpf || "").replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;

    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.substring(10, 11));
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

  return (
    <>
      <h2 className="mb-3">Registros Portaria</h2>

      {registros.length === 0 ? (
        <div className="alert alert-light border">Nenhum registro encontrado.</div>
      ) : (
        <div className="container-registros">
          <div className="d-flex flex-column gap-3">
            {registros.map((item) => {
              const statusExibido = item.status_portaria || "PENDENTE";
              const emEdicao = editandoId === item.id;
              const cpfInvalido =
                emEdicao &&
                item.cpf_motorista &&
                !validarCPF(item.cpf_motorista);

              return (
                <div key={item.id} className="card shadow-sm registro-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-1">
                          #{item.id} -{" "}
                          {emEdicao ? (
                            <input
                              type="text"
                              className="form-control mt-1"
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
                            <>
                              <strong>Data:</strong>
                              <input
                                type="date"
                                className="form-control mt-1"
                                value={item.data || ""}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(
                                    item.id,
                                    "data",
                                    e.target.value
                                  )
                                }
                              />
                            </>
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
                            <>
                              <input
                                type="text"
                                className={`form-control mt-1 ${
                                  cpfInvalido ? "is-invalid" : ""
                                }`}
                                value={item.cpf_motorista || ""}
                                maxLength={14}
                                onChange={(e) =>
                                  handleChangeCampoRegistro(
                                    item.id,
                                    "cpf_motorista",
                                    e.target.value
                                  )
                                }
                              />

                              {cpfInvalido && (
                                <div className="invalid-feedback d-block">
                                  CPF inválido
                                </div>
                              )}
                            </>
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
                              value={formatarHora(item.chegada_na_rua)}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "chegada_na_rua",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{formatarHora(item.chegada_na_rua) || "-"}</div>
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
                              value={formatarHora(item.entrada_no_cd)}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "entrada_no_cd",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{formatarHora(item.entrada_no_cd) || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Horário Saída:</strong>
                          {emEdicao ? (
                            <input
                              type="time"
                              className="form-control mt-1"
                              value={formatarHora(item.horario_saida)}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "horario_saida",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{formatarHora(item.horario_saida) || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Observação Portaria:</strong>
                          {emEdicao ? (
                            <textarea
                              className="form-control mt-1"
                              rows="2"
                              value={item.observacao_portaria || ""}
                              onChange={(e) =>
                                handleChangeCampoRegistro(
                                  item.id,
                                  "observacao_portaria",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            <div>{item.observacao_portaria || "-"}</div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="border rounded p-2 h-100 bg-light">
                          <strong>Observação Status Portaria:</strong>
                          <div>{item.observacao_status_portaria || "-"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
                      {emEdicao ? (
                        <>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => salvarComValidacao(item)}
                            disabled={cpfInvalido}
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
                        <>
                          <button
                            type="button"
                            className="btn btn-warning"
                            onClick={() => iniciarEdicao(item.id)}
                          >
                            Editar
                          </button>

                          {mensagemEdicaoId === item.id && (
                            <span className="text-success fw-semibold">
                              REGISTRO EDITADO COM SUCESSO
                            </span>
                          )}
                        </>
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

export default RegistrosPortaria;