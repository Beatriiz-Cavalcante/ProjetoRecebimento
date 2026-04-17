import "./Registros.css";

function Registros({
  lista,
  calcularStatusRegistro,
  formatarDataBR,
  getStatusStyle,
  handleChangeStatus,
  handleChangeObservacao,
}) {
  return (
    <>
      <h2 className="mb-3">Registros</h2>

      {lista.length === 0 ? (
        <div className="alert alert-light border">Nenhum registro encontrado.</div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {lista.map((item) => {
            const statusExibido = item.status_manual || calcularStatusRegistro(item);

            return (
              <div key={item.id} className="card shadow-sm registro-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                    <div>
                      <h5 className="card-title mb-1">
                        #{item.id} - {item.fornecedor || "Sem fornecedor"}
                      </h5>
                      <div className="text-muted registro-data">
                        Data: {formatarDataBR(item.data)}
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
                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Chegada na Rua:</strong>
                        <div>{item.chegada_na_rua || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Entrada no CD:</strong>
                        <div>{item.entrada_no_cd || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Horário Início:</strong>
                        <div>{item.horario_inicio || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Horário Final:</strong>
                        <div>{item.horario_final || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Desconto Hora:</strong>
                        <div>{item.desconto_hora || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Número Palet:</strong>
                        <div>{item.numero_palet ?? "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Tipo Carga:</strong>
                        <div>{item.tipo_carga || "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Nº Homens:</strong>
                        <div>{item.num_homens ?? "-"}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Avaria:</strong>
                        <div>{item.avaria ?? 0}</div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="border rounded p-2 h-100">
                        <strong>Volumes:</strong>
                        <div>{item.volumes ?? 0}</div>
                      </div>
                    </div>

                    <div className="col-md-8">
                      <div className="border rounded p-2 h-100">
                        <strong>Descrição:</strong>
                        <div>{item.descricao || "-"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Editar status</label>
                    <select
                      className="form-select registro-status-select"
                      value={statusExibido}
                      onChange={(e) => handleChangeStatus(item.id, e.target.value)}
                    >
                      <option value="PENDENTE">PENDENTE</option>
                      <option value="RESOLVIDO">RESOLVIDO</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label fw-semibold">
                      Campo editável / observação
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={item.observacao_status || ""}
                      onChange={(e) =>
                        handleChangeObservacao(item.id, e.target.value)
                      }
                      placeholder="Digite uma observação para este registro"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Registros;
