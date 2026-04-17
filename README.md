# 📦 Projeto Recebimento

API REST desenvolvida em Python utilizando Flask e PostgreSQL para gerenciamento de dados, com interface web em React.

---

## 🚀 Tecnologias utilizadas

### Backend
* Python 3.x
* Flask
* Flask-CORS
* PostgreSQL
* psycopg2-binary

### Frontend
* React (Vite)
* JavaScript
* Bootstrap

## Banco de Dados
- PostgreSQL (rodando via Docker) 🐳  
---

## 📁 Estrutura do projeto

```
ProjetoRecebimento/
│
├── backend/
│ ├── app.py
│ ├── requirements.txt
│
├── frontend_react_recebimento/
│ ├── package.json
│ ├── src/
│
├── database/
│ └── init.sql
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

* Python 3
* Node.js
* Git
* Docker Desktop 

---

## 🚀 Como rodar o projeto

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/Beatriiz-Cavalcante/ProjetoRecebimento.git
cd ProjetoRecebimento
```
---
### 2. Banco de dados (Docker)

Subir o PostgreSQL na raiz do projeto:

```bash
docker compose up -d
```

Acessar o banco (opcional)
```bash
docker exec -it logistica_postgres psql -U postgres -d logistica_teste
```

---
### 3. Backend

### 🔹 3.1 Criar o ambiente virtual

```bash
python -m venv venv
```

#### 🔹 3.2 Ativar o ambiente virtual

```bash
.\venv\Scripts\activate.ps1
```
#### 🔹 3.3 Acessar a pasta do backend

```bash
cd backend
```

#### 🔹 3.4 Instalar as dependências na pasta do backend

```bash
pip install -r requirements.txt
```

#### 🔹 3.5 Rodar a API

```bash
python app.py
```

#### 🔹🔹 OBS 📦 Gerenciamento de dependências

Para atualizar as dependências do projeto:

```bash
pip freeze > requirements.txt
```

---
### 3. FRONTEND

###🔹 3.1 Acessar pasta do frontend

```bash
cd frontend_react_recebimento
```

###🔹 3.2. Instalar dependências

```bash
npm install
```

###🔹 3.3 Rodar aplicação React

```bash
npm run dev
```

👉 Frontend ficará disponível em: http://localhost:5173

---

## 📌 Rotas da API (exemplo)

| Método | Rota                   | Descrição          |
| ------ | ---------              | -------------------|
| GET    | /                      | Teste da API       |
| GET    | /operacoes             | Listar operações   |
| POST   | /operacoes             | Criar operação     |
| PUT    | /operacoes/{id}        | Atualizar operação |
| PUT    | /operacoes/{id}/status | Atualizar status   |
| DELETE | /operacoes/{id}        | Remover (inativar) |


---
