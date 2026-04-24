const API_URL = "http://127.0.0.1:5000/operacoes";

export async function getRecebimentos() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Erro ao buscar recebimentos");
  }

  return res.json();
}

export async function criarRecebimento(dados) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar recebimento");
  }

  return res.json();
}

export async function atualizarRecebimento(id, payload) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Erro ao atualizar operação");
  }

  const data = await response.json();
  return data.dados;
}