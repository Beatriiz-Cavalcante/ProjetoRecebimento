from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)
conn = psycopg2.connect(
    host="localhost",
    database="logistica_teste",
    user="postgres",
    password="recife@1020"
)

@app.route('/')
def home():
    return "API rodando 🚀"

#primeiro end point (POST - criar)
@app.route('/operacoes', methods=['POST'])
def criar_operacao():
    data = request.json #(request pega os dados em python e transforma em json para mandar para o banco)
    
    cursor = conn.cursor() #usado para criar comandos no banco de dados

    cursor.execute("""
        INSERT INTO operacoes_logistica(fornecedor, chegada_na_rua, entrada_no_cd, data, horario_inicio, horario_final, desconto_hora, numero_palet,
                   tipo_carga, num_homens, avaria, volumes, descricao) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        data['fornecedor'],
        data['chegada_na_rua'],
        data['entrada_no_cd'],
        data['data'],
        data['horario_inicio'],
        data['horario_final'],
        data['desconto_hora'],
        data['numero_palet'],
        data['tipo_carga'],
        data['num_homens'],
        data['avaria'],
        data['volumes'],
        data['descricao']
    ) )

    conn.commit()
    return jsonify({"Mensagem":"Operação criada com sucesso"})

#segundo end point (GET - puxar/ler dados)
@app.route('/operacoes', methods=['GET'])
def listar_operacoes():
    cursor = conn.cursor()
    cursor.execute("""
        SELECT * FROM operacoes_logistica
        WHERE ativo = TRUE
        ORDER BY id DESC
    """)
    dados = cursor.fetchall() #fetchall é usado para pegar todos os resultados da consulta
    colunas = [desc[0] for desc in cursor.description]
    resultado = []
    for linha in dados:
        linha_dict = dict(zip(colunas, linha)) #zip junta nome da coluna ao valor, dict cria o dicionario e append adiciona esse dicionario ao resultado
        for chave, valor in linha_dict.items():
            if hasattr(valor, 'isoformat'): #verificando o tipo TIME
                linha_dict[chave]= valor.isoformat() #aplicando conversão para string
        resultado.append(linha_dict)
    return jsonify(resultado)    

#terceiro end point (PUT - editar dados)
@app.route('/operacoes/<int:id>', methods=['PUT'])
def atualizar_operacao(id):
    data = request.json

    cursor = conn.cursor()

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
            descricao = %s
        WHERE id = %s
    """, (
        data['fornecedor'],
        data['chegada_na_rua'],
        data['entrada_no_cd'],
        data['data'],
        data['horario_inicio'],
        data['horario_final'],
        data['desconto_hora'],
        data['numero_palet'],
        data['tipo_carga'],
        data['num_homens'],
        data['avaria'],
        data['volumes'],
        data['descricao'],
        id
    ))

    conn.commit()

    return jsonify({"mensagem": "Operação atualizada com sucesso"})

#quarto end point (delete - apagar)
@app.route('/operacoes/<int:id>', methods=['DELETE'])
def deletar_operacao(id):
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE operacoes_logistica
        SET ativo = FALSE
        WHERE id = %s
    """, (id,))

    conn.commit()

    return jsonify({"mensagem": "Operação removida com sucesso"})

if __name__ == '__main__':
    app.run(debug=True)
