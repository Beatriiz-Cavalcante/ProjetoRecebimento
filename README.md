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
├── .gitignore
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:

* Python 3
* Node.js
* Git
* PostgreSQL

---

## 🚀 Como rodar o projeto

### 🔹 1. Clonar o repositório

```bash
git clone https://github.com/Beatriiz-Cavalcante/ProjetoRecebimento.git
cd ProjetoRecebimento
```

---
### 2. Backend

### 🔹 2.1 Criar o ambiente virtual

```bash
python -m venv venv
```

---

### 🔹 2.2 Ativar o ambiente virtual

**Windows (Git Bash):**

```bash
source venv/Scripts/activate
```

**Windows (CMD):**

```bash
venv\Scripts\activate
```

---

### 🔹 2.3 Instalar as dependências

```bash
pip install -r requirements.txt
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

### 🔹 5. Configurar o banco de dados

1. Abra o PostgreSQL
2. Crie um banco de dados
3. Atualize as credenciais no `app.py`:

```
-- Table: public.operacoes_logistica

-- DROP TABLE IF EXISTS public.operacoes_logistica;

CREATE TABLE IF NOT EXISTS public.operacoes_logistica
(
    id integer NOT NULL DEFAULT nextval('operacoes_logistica_id_seq'::regclass),
    fornecedor character varying(100) COLLATE pg_catalog."default" NOT NULL,
    chegada_na_rua time without time zone NOT NULL,
    entrada_no_cd time without time zone NOT NULL,
    data date NOT NULL,
    horario_inicio time without time zone NOT NULL,
    horario_final time without time zone NOT NULL,
    desconto_hora time without time zone NOT NULL,
    numero_palet integer NOT NULL,
    tipo_carga character varying(20) COLLATE pg_catalog."default" NOT NULL,
    num_homens integer NOT NULL,
    avaria integer DEFAULT 0,
    volumes integer DEFAULT 0,
    descricao text COLLATE pg_catalog."default",
    ativo boolean DEFAULT true,
    criado_em timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT operacoes_logistica_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.operacoes_logistica
    OWNER to postgres;
```


```python
host="localhost",
database="seu_banco",
user="seu_usuario",
password="sua_senha"
```

---

### 🔹 6. Rodar a aplicação

```bash
python app.py
```

---

## 📌 Rotas da API (exemplo)

| Método | Rota      | Descrição         |
| ------ | --------- | ----------------- |
| GET    | /         | Teste da API      |
| GET    | /usuarios | Listar usuários   |
| POST   | /usuarios | Criar usuário     |
| PUT    | /usuarios | Atualizar usuário |
| DELETE | /usuarios | Deletar usuário   |


---

## 💡 Melhorias futuras

* Separar rotas em arquivos (`routes/`)
* Criar camada de conexão com banco (`database/`)
* Usar variáveis de ambiente (`.env`)
* Implementar autenticação

---

