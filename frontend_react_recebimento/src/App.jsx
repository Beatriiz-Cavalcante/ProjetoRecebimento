import { useEffect, useState } from "react";
import { getRecebimentos, criarRecebimento } from "./services/api";

function App() {
  const [lista, setLista] = useState([]);
  const [fornecedor, setFornecedor] = useState("");
  const [chegada, setChegada] = useState("");

  async function carregar() {
    const dados = await getRecebimentos();
    setLista(dados);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    await criarRecebimento({
      fornecedor,
      chegada_na_rua: chegada,
    });

    setFornecedor("");
    setChegada("");
    carregar();
  }

  return (
    <div className="container mt-4">
      <h1>Cadastro de Recebimento</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <input
            className="form-control"
            placeholder="Fornecedor"
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <input
            className="form-control"
            type="time"
            value={chegada}
            onChange={(e) => setChegada(e.target.value)}
          />
        </div>

        <button className="btn btn-primary">Enviar</button>
      </form>

      <h2>Registros</h2>

      <ul className="list-group">
        {lista.map((item, index) => (
          <li key={index} className="list-group-item">
            {item.fornecedor} - {item.chegada_na_rua}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
