const API_URL = "http://localhost:5000/operacoes";

export async function getRecebimentos() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function criarRecebimento(dados) {
  await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
}

export async function atualizarRecebimento(id, payload) {
  const response = await fetch(`http://127.0.0.1:5000/operacoes/${id}`, {
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