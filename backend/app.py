from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
CORS(app)
conn = psycopg2.connect(
    host="localhost",
    database="logistica_teste",
    user="postgres",
    password="recife@1020",
    port=5433
)

def valor_preenchido(valor):
    return valor is not None and str(valor).strip() != ""

def calcular_status(data):
    campos_obrigatorios = [
        data.get("fornecedor"),
        data.get("chegada_na_rua"),
        data.get("entrada_no_cd"),
        data.get("data"),
        data.get("horario_inicio"),
        data.get("horario_final"),
        data.get("desconto_hora"),
        data.get("numero_palet"),
        data.get("tipo_carga"),
        data.get("num_homens"),
    ]

    faltando = any(not valor_preenchido(valor) for valor in campos_obrigatorios)
    return "PENDENTE" if faltando else "RESOLVIDO"

def gerar_observacao_automatica(data):
    faltando = []

    if not valor_preenchido(data.get("fornecedor")):
        faltando.append("Fornecedor")
    if not valor_preenchido(data.get("chegada_na_rua")):
        faltando.append("Chegada na Rua")
    if not valor_preenchido(data.get("entrada_no_cd")):
        faltando.append("Entrada no CD")
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
    return "Registro preenchido corretamente."

def normalizar_saida(registro):
    for chave, valor in registro.items():
        if hasattr(valor, "isoformat"):
            registro[chave] = valor.isoformat()
    return registro

@app.route('/')
def home():
    return "API rodando 🚀"

#primeiro end point (POST - criar)
@app.route('/operacoes', methods=['POST'])
def criar_operacao():
    try:
        data = request.json or {}

        status_calculado = calcular_status(data)
        observacao_final = data.get("observacao_status")

        if not valor_preenchido(observacao_final):
            observacao_final = gerar_observacao_automatica(data)

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO operacoes_logistica (
                fornecedor,
                chegada_na_rua,
                entrada_no_cd,
                data,
                horario_inicio,
                horario_final,
                desconto_hora,
                numero_palet,
                tipo_carga,
                num_homens,
                avaria,
                volumes,
                descricao,
                status,
                observacao_status,
                observacao_manual
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING *
        """, (
            data.get("fornecedor"),
            data.get("chegada_na_rua"),
            data.get("entrada_no_cd"),
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
            status_calculado,
            observacao_final,
            data.get("observacao_manual", "")
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

#segundo end point (GET - puxar/ler dados)
@app.route('/operacoes', methods=['GET'])
def listar_operacoes():
    try:
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        cursor.execute("""
            SELECT
                id,
                fornecedor,
                chegada_na_rua,
                entrada_no_cd,
                data,
                horario_inicio,
                horario_final,
                desconto_hora,
                numero_palet,
                tipo_carga,
                num_homens,
                avaria,
                volumes,
                descricao,
                ativo,
                criado_em,
                status,
                observacao_status,
                observacao_manual
            FROM operacoes_logistica
            WHERE ativo = TRUE
            ORDER BY id DESC
        """)
        dados = cursor.fetchall()
        cursor.close()

        resultado = [normalizar_saida(dict(linha)) for linha in dados]
        return jsonify(resultado)

    except Exception as e:
        return jsonify({"erro": f"Erro ao listar operações: {str(e)}"}), 500

# terceiro end point (PUT - editar dados)
@app.route("/operacoes/<int:id>", methods=["PUT"])
def atualizar_operacao(id):
    try:
        data = request.json or {}

        status_final = calcular_status(data)
        observacao_final = gerar_observacao_automatica(data)
        observacao_manual = data.get("observacao_manual", "")

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE operacoes_logistica SET
                fornecedor = %s,
                chegada_na_rua = %s,
                entrada_no_cd = %s,
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
                status = %s,
                observacao_status = %s,
                observacao_manual = %s
            WHERE id = %s
            RETURNING *
        """, (
            data.get("fornecedor"),
            data.get("chegada_na_rua"),
            data.get("entrada_no_cd"),
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
            status_final,
            observacao_final,
            observacao_manual,
            id
        ))

        operacao_atualizada = cursor.fetchone()

        if not operacao_atualizada:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Operação não encontrada"}), 404

        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Operação atualizada com sucesso",
            "dados": normalizar_saida(dict(operacao_atualizada))
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao atualizar operação: {str(e)}"}), 500
    
# Método PUT - atualizar somente status e observação
@app.route("/operacoes/<int:id>/status", methods=["PUT"])
def atualizar_status_operacao(id):
    try:
        data = request.json or {}

        status = data.get("status")
        observacao_status = data.get("observacao_status", "")

        if status not in ["PENDENTE", "RESOLVIDO"]:
            return jsonify({"erro": "Status inválido. Use PENDENTE ou RESOLVIDO."}), 400

        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            UPDATE operacoes_logistica
            SET
                status = %s,
                observacao_status = %s
            WHERE id = %s
            RETURNING *
        """, (status, observacao_status, id))

        operacao_atualizada = cursor.fetchone()

        if not operacao_atualizada:
            cursor.close()
            conn.rollback()
            return jsonify({"erro": "Operação não encontrada"}), 404

        conn.commit()
        cursor.close()

        return jsonify({
            "mensagem": "Status e observação atualizados com sucesso",
            "dados": normalizar_saida(dict(operacao_atualizada))
        })

    except Exception as e:
        conn.rollback()
        return jsonify({"erro": f"Erro ao atualizar status: {str(e)}"}), 500

#quarto end point (delete - apagar)
@app.route('/operacoes/<int:id>', methods=['DELETE'])
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

if __name__ == '__main__':
    app.run(debug=True)
