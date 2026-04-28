from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

SECRET_KEY = "chave_secreta_recebimento_2026"

conn = psycopg2.connect(
    host="localhost",
    database="logistica_teste",
    user="postgres",
    password="recife@1020",
    port=5433
)

def valor_preenchido(valor):
    return valor is not None and str(valor).strip() != ""

def normalizar_saida(registro):
    for chave, valor in registro.items():
        if hasattr(valor, "isoformat"):
            registro[chave] = valor.isoformat()
    return registro

def gerar_token(usuario):
    payload = {
        "id": usuario["id"],
        "nome": usuario["nome"],
        "email": usuario["email"],
        "perfil": usuario["perfil"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=8)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def token_obrigatorio(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        auth_header = request.headers.get("Authorization")

        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"erro": "Token não informado"}), 401

        try:
            dados = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.usuario_logado = dados
        except jwt.ExpiredSignatureError:
            return jsonify({"erro": "Token expirado"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"erro": "Token inválido"}), 401

        return f(*args, **kwargs)

    return decorated

def perfil_obrigatorio(*perfis_permitidos):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            usuario = getattr(request, "usuario_logado", None)

            if not usuario:
                return jsonify({"erro": "Usuário não autenticado"}), 401

            if usuario.get("perfil") not in perfis_permitidos:
                return jsonify({"erro": "Acesso não autorizado"}), 403

            return f(*args, **kwargs)

        return decorated

    return decorator

def calcular_status_portaria(data):
    campos = [
        data.get("fornecedor"),
        data.get("data"),
        data.get("chegada_na_rua"),
        data.get("nome_motorista"),
        data.get("cpf_motorista"),
        data.get("placa_carro"),
        data.get("qt_notas"),
    ]

    return "PENDENTE" if any(not valor_preenchido(v) for v in campos) else "RESOLVIDO"

def gerar_observacao_portaria(data):
    faltando = []

    if not valor_preenchido(data.get("fornecedor")):
        faltando.append("Fornecedor")
    if not valor_preenchido(data.get("data")):
        faltando.append("Data")
    if not valor_preenchido(data.get("chegada_na_rua")):
        faltando.append("Chegada na Rua")
    if not valor_preenchido(data.get("nome_motorista")):
        faltando.append("Nome Motorista")
    if not valor_preenchido(data.get("cpf_motorista")):
        faltando.append("CPF Motorista")
    if not valor_preenchido(data.get("placa_carro")):
        faltando.append("Placa Carro")
    if not valor_preenchido(data.get("qt_notas")) and data.get("qt_notas") != 0:
        faltando.append("Quantidade de Notas")

    if faltando:
        return "Faltando preencher: " + ", ".join(faltando)

    return "Portaria preenchida corretamente."

def calcular_status_recebimento(data):
    campos = [
        data.get("fornecedor"),
        data.get("data"),
        data.get("horario_inicio"),
        data.get("horario_final"),
        data.get("desconto_hora"),
        data.get("numero_palet"),
        data.get("tipo_carga"),
        data.get("num_homens"),
    ]

    return "PENDENTE" if any(not valor_preenchido(v) for v in campos) else "RESOLVIDO"

def gerar_observacao_recebimento(data):
    faltando = []

    if not valor_preenchido(data.get("fornecedor")):
        faltando.append("Fornecedor")
    if not valor_preenchido(data.get("data")):
        faltando.append("Data")
    if not valor_preenchido(data.get("horario_inicio")):
        faltando.append("Horário Início")
    if not valor_preenchido(data.get("horario_final")):
        faltando.append("Horário Final")
    if not valor_preenchido(data.get("desconto_hora")):
        faltando.append("Desconto Hora")
    if not valor_preenchido(data.get("numero_palet")) and data.get("numero_palet") != 0:
        faltando.append("Número Palet")
    if not valor_preenchido(data.get("tipo_carga")):
        faltando.append("Tipo Carga")
    if not valor_preenchido(data.get("num_homens")) and data.get("num_homens") != 0:
        faltando.append("Nº Homens")

    if faltando:
        return "Faltando preencher: " + ", ".join(faltando)

    return "Recebimento preenchido corretamente."

@app.route("/")
def home():
    return "API rodando 🚀"

# =========================
# USUÁRIOS / LOGIN
# =========================

@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.json or {}

        email = data.get("email")
        senha = data.get("senha")

        if not valor_preenchido(email) or not valor_preenchido(senha):
            return jsonify({"erro": "E-mail e senha são obrigatórios"}), 400

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id, nome, email, senha_hash, perfil, ativo
            FROM usuarios
            WHERE email = %s
            LIMIT 1
        """, (email,))

        usuario = cursor.fetchone()
        cursor.close()

        if not usuario:
            return jsonify({"erro": "E-mail ou senha inválidos"}), 401

        if not usuario["ativo"]:
            return jsonify({"erro": "Usuário inativo"}), 403

        if not check_password_hash(usuario["senha_hash"], senha):
            return jsonify({"erro": "E-mail ou senha inválidos"}), 401

        token = gerar_token(usuario)

        return jsonify({
            "mensagem": "Login realizado com sucesso",
            "token": token,
            "usuario": {
                "id": usuario["id"],
                "nome": usuario["nome"],
                "email": usuario["email"],
                "perfil": usuario["perfil"]
            }
        })

    except Exception as e:
        return jsonify({"erro": f"Erro ao fazer login: {str(e)}"}), 500

@app.route("/usuarios", methods=["POST"])
def criar_usuario():
    try:
        data = request.json or {}

        nome = data.get("nome")
        email = data.get("email")
        senha = data.get("senha")
        perfil = data.get("perfil")

        if not valor_preenchido(nome):
            return jsonify({"erro": "Nome é obrigatório"}), 400

        if not valor_preenchido(email):
            return jsonify({"erro": "E-mail é obrigatório"}), 400

        if not valor_preenchido(senha):
            return jsonify({"erro": "Senha é obrigatória"}), 400

        if perfil not in ["ADM", "RECEBIMENTO", "PORTARIA"]:
            return jsonify({"erro": "Perfil inválido"}), 400

        senha_hash = generate_password_hash(senha)

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO usuarios (
                nome,
                email,
                senha_hash,
                perfil,
                ativo
            )
            VALUES (%s, %s, %s, %s, TRUE)
            RETURNING id, nome, email, perfil, ativo, criado_em
        """, (
            nome,
            email,
            senha_hash,
            perfil
        ))

        novo_usuario = cursor.fetchone()
        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Usuário criado com sucesso",
            "dados": normalizar_saida(dict(novo_usuario))
        }), 201

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"erro": "E-mail já cadastrado"}), 409

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao criar usuário: {str(e)}"}), 500

@app.route("/usuarios", methods=["GET"])
@token_obrigatorio
@perfil_obrigatorio("ADM")
def listar_usuarios():
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                id,
                nome,
                email,
                perfil,
                ativo,
                criado_em
            FROM usuarios
            ORDER BY id DESC
        """)

        dados = cursor.fetchall()
        cursor.close()

        return jsonify([normalizar_saida(dict(linha)) for linha in dados])

    except Exception as e:
        return jsonify({"erro": f"Erro ao listar usuários: {str(e)}"}), 500

@app.route("/usuarios/<int:id>", methods=["GET"])
@token_obrigatorio
@perfil_obrigatorio("ADM")
def buscar_usuario(id):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                id,
                nome,
                email,
                perfil,
                ativo,
                criado_em
            FROM usuarios
            WHERE id = %s
        """, (id,))

        usuario = cursor.fetchone()
        cursor.close()

        if not usuario:
            return jsonify({"erro": "Usuário não encontrado"}), 404

        return jsonify(normalizar_saida(dict(usuario)))

    except Exception as e:
        return jsonify({"erro": f"Erro ao buscar usuário: {str(e)}"}), 500

@app.route("/usuarios/<int:id>", methods=["PUT"])
@token_obrigatorio
@perfil_obrigatorio("ADM")
def atualizar_usuario(id):
    try:
        data = request.json or {}

        nome = data.get("nome")
        email = data.get("email")
        perfil = data.get("perfil")
        senha = data.get("senha")
        ativo = data.get("ativo")

        if not valor_preenchido(nome):
            return jsonify({"erro": "Nome é obrigatório"}), 400

        if not valor_preenchido(email):
            return jsonify({"erro": "E-mail é obrigatório"}), 400

        if perfil not in ["ADM", "RECEBIMENTO", "PORTARIA"]:
            return jsonify({"erro": "Perfil inválido"}), 400

        if ativo is None:
            ativo = True

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        if valor_preenchido(senha):
            senha_hash = generate_password_hash(senha)

            cursor.execute("""
                UPDATE usuarios
                SET
                    nome = %s,
                    email = %s,
                    perfil = %s,
                    senha_hash = %s,
                    ativo = %s
                WHERE id = %s
                RETURNING id, nome, email, perfil, ativo, criado_em
            """, (
                nome,
                email,
                perfil,
                senha_hash,
                ativo,
                id
            ))
        else:
            cursor.execute("""
                UPDATE usuarios
                SET
                    nome = %s,
                    email = %s,
                    perfil = %s,
                    ativo = %s
                WHERE id = %s
                RETURNING id, nome, email, perfil, ativo, criado_em
            """, (
                nome,
                email,
                perfil,
                ativo,
                id
            ))

        usuario_atualizado = cursor.fetchone()

        if not usuario_atualizado:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Usuário não encontrado"}), 404

        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Usuário atualizado com sucesso",
            "dados": normalizar_saida(dict(usuario_atualizado))
        })

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({"erro": "E-mail já cadastrado"}), 409

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao atualizar usuário: {str(e)}"}), 500

@app.route("/usuarios/<int:id>/inativar", methods=["PUT"])
@token_obrigatorio
@perfil_obrigatorio("ADM")
def inativar_usuario(id):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE usuarios
            SET ativo = FALSE
            WHERE id = %s
            RETURNING id, nome, email, perfil, ativo, criado_em
        """, (id,))

        usuario = cursor.fetchone()

        if not usuario:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Usuário não encontrado"}), 404

        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Usuário inativado com sucesso",
            "dados": normalizar_saida(dict(usuario))
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao inativar usuário: {str(e)}"}), 500

@app.route("/usuarios/<int:id>/reativar", methods=["PUT"])
@token_obrigatorio
@perfil_obrigatorio("ADM")
def reativar_usuario(id):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE usuarios
            SET ativo = TRUE
            WHERE id = %s
            RETURNING id, nome, email, perfil, ativo, criado_em
        """, (id,))

        usuario = cursor.fetchone()

        if not usuario:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Usuário não encontrado"}), 404

        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Usuário reativado com sucesso",
            "dados": normalizar_saida(dict(usuario))
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao reativar usuário: {str(e)}"}), 500

@app.route("/recuperar-senha", methods=["POST"])
def recuperar_senha():
    try:
        data = request.json or {}
        email = data.get("email")

        if not valor_preenchido(email):
            return jsonify({"erro": "E-mail é obrigatório"}), 400

        return jsonify({
            "mensagem": "Se este e-mail estiver cadastrado, as instruções de recuperação serão enviadas."
        })

    except Exception as e:
        return jsonify({"erro": f"Erro ao recuperar senha: {str(e)}"}), 500

# =========================
# OPERAÇÕES LOGÍSTICA
# =========================

@app.route("/operacoes", methods=["POST"])
def criar_operacao():
    try:
        data = request.json or {}

        status_portaria = calcular_status_portaria(data)
        obs_portaria = gerar_observacao_portaria(data)

        status_recebimento = calcular_status_recebimento(data)
        obs_recebimento = gerar_observacao_recebimento(data)

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO operacoes_logistica (
                fornecedor,
                chegada_na_rua,
                entrada_no_cd,
                horario_saida,
                data,
                nome_motorista,
                cpf_motorista,
                placa_carro,
                qt_notas,
                horario_inicio,
                horario_final,
                desconto_hora,
                numero_palet,
                tipo_carga,
                num_homens,
                avaria,
                volumes,
                descricao,
                observacao_manual,
                observacao_portaria,
                status,
                observacao_status,
                status_portaria,
                observacao_status_portaria,
                status_recebimento,
                observacao_status_recebimento
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            data.get("fornecedor"),
            data.get("chegada_na_rua"),
            data.get("entrada_no_cd"),
            data.get("horario_saida"),
            data.get("data"),
            data.get("nome_motorista"),
            data.get("cpf_motorista"),
            data.get("placa_carro"),
            data.get("qt_notas"),
            data.get("horario_inicio"),
            data.get("horario_final"),
            data.get("desconto_hora"),
            data.get("numero_palet"),
            data.get("tipo_carga"),
            data.get("num_homens"),
            data.get("avaria", 0),
            data.get("volumes", 0),
            data.get("descricao", ""),
            data.get("observacao_manual", ""),
            data.get("observacao_portaria", ""),
            status_recebimento,
            obs_recebimento,
            status_portaria,
            obs_portaria,
            status_recebimento,
            obs_recebimento
        ))

        nova_operacao = cursor.fetchone()
        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Operação criada com sucesso",
            "dados": normalizar_saida(dict(nova_operacao))
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao criar operação: {str(e)}"}), 500

@app.route("/operacoes", methods=["GET"])
def listar_operacoes():
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT
                id,
                fornecedor,
                chegada_na_rua,
                entrada_no_cd,
                horario_saida,
                data,
                nome_motorista,
                cpf_motorista,
                placa_carro,
                qt_notas,
                horario_inicio,
                horario_final,
                desconto_hora,
                numero_palet,
                tipo_carga,
                num_homens,
                avaria,
                volumes,
                descricao,
                observacao_manual,
                observacao_portaria,
                ativo,
                criado_em,
                status,
                observacao_status,
                status_portaria,
                observacao_status_portaria,
                status_recebimento,
                observacao_status_recebimento
            FROM operacoes_logistica
            WHERE ativo = TRUE
            ORDER BY id DESC
        """)

        dados = cursor.fetchall()
        cursor.close()

        return jsonify([normalizar_saida(dict(linha)) for linha in dados])

    except Exception as e:
        return jsonify({"erro": f"Erro ao listar operações: {str(e)}"}), 500

@app.route("/operacoes/portaria/<int:id>", methods=["PUT"])
def atualizar_portaria(id):
    try:
        data = request.json or {}

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE operacoes_logistica SET
                fornecedor = %s,
                data = %s,
                chegada_na_rua = %s,
                entrada_no_cd = %s,
                horario_saida = %s,
                nome_motorista = %s,
                cpf_motorista = %s,
                placa_carro = %s,
                qt_notas = %s,
                observacao_portaria = %s
            WHERE id = %s
            RETURNING *
        """, (
            data.get("fornecedor"),
            data.get("data"),
            data.get("chegada_na_rua"),
            data.get("entrada_no_cd"),
            data.get("horario_saida"),
            data.get("nome_motorista"),
            data.get("cpf_motorista"),
            data.get("placa_carro"),
            data.get("qt_notas"),
            data.get("observacao_portaria", ""),
            id
        ))

        operacao = cursor.fetchone()

        if not operacao:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Operação não encontrada"}), 404

        registro = dict(operacao)

        status_portaria = calcular_status_portaria(registro)
        obs_portaria = gerar_observacao_portaria(registro)

        cursor.execute("""
            UPDATE operacoes_logistica SET
                status_portaria = %s,
                observacao_status_portaria = %s
            WHERE id = %s
            RETURNING *
        """, (
            status_portaria,
            obs_portaria,
            id
        ))

        operacao_final = cursor.fetchone()

        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Portaria atualizada com sucesso",
            "dados": normalizar_saida(dict(operacao_final))
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao atualizar portaria: {str(e)}"}), 500

@app.route("/operacoes/recebimento/<int:id>", methods=["PUT"])
def atualizar_recebimento(id):
    try:
        data = request.json or {}

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE operacoes_logistica SET
                fornecedor = %s,
                data = %s,
                horario_inicio = %s,
                horario_final = %s,
                desconto_hora = %s,
                numero_palet = %s,
                tipo_carga = %s,
                num_homens = %s,
                avaria = %s,
                volumes = %s,
                descricao = %s,
                observacao_manual = %s
            WHERE id = %s
            RETURNING *
        """, (
            data.get("fornecedor"),
            data.get("data"),
            data.get("horario_inicio"),
            data.get("horario_final"),
            data.get("desconto_hora"),
            data.get("numero_palet"),
            data.get("tipo_carga"),
            data.get("num_homens"),
            data.get("avaria", 0),
            data.get("volumes", 0),
            data.get("descricao", ""),
            data.get("observacao_manual", ""),
            id
        ))

        operacao = cursor.fetchone()

        if not operacao:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Operação não encontrada"}), 404

        registro = dict(operacao)

        status_recebimento = calcular_status_recebimento(registro)
        obs_recebimento = gerar_observacao_recebimento(registro)

        cursor.execute("""
            UPDATE operacoes_logistica SET
                status = %s,
                observacao_status = %s,
                status_recebimento = %s,
                observacao_status_recebimento = %s
            WHERE id = %s
            RETURNING *
        """, (
            status_recebimento,
            obs_recebimento,
            status_recebimento,
            obs_recebimento,
            id
        ))

        operacao_final = cursor.fetchone()

        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Recebimento atualizado com sucesso",
            "dados": normalizar_saida(dict(operacao_final))
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao atualizar recebimento: {str(e)}"}), 500

@app.route("/operacoes/<int:id>", methods=["DELETE"])
def deletar_operacao(id):
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE operacoes_logistica
            SET ativo = FALSE
            WHERE id = %s
            RETURNING id
        """, (id,))

        operacao = cursor.fetchone()

        if not operacao:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Operação não encontrada"}), 404

        conn.commit()
        cursor.close()

        return jsonify({"mensagem": "Operação removida com sucesso"})

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao remover operação: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)