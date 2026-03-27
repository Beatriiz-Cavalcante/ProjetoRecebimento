from flask import Flask, request, jsonify
import psycopg2

app = Flask(__name__)
conn = psycopg2.connect(
    host="localhost",
    database="logistica_teste",
    user="postgres",
    password="recife@1020"
)

@app.route('/')
def home():
    return "API rodando 🚀"

if __name__ == '__main__':
    app.run(debug=True)


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
