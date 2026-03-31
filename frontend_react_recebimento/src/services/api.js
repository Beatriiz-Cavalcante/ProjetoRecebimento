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
