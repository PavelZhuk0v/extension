import traceback
from flask import Flask, request, jsonify
from main import process_text

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    return response

@app.route('/', methods=['POST', 'GET', 'OPTIONS'])
def home():
    if request.method == 'OPTIONS':
        return '', 200

    if request.method == 'GET':
        return "Сервер работает!", 200

    data = request.get_json(silent=True, force=True)
    if not data:
        return jsonify({"message": "Ошибка: Пустой запрос или не JSON формат"}), 400

    text = data.get('text', '').strip()
    if not text:
        return jsonify({"message": "Ошибка: Текст для сжатия пуст"}), 400

    try:
        reduction = int(data.get('reduction', 50))
    except (ValueError, TypeError):
        reduction = 50

    print(f"\n[Входящий текст]: {text[:50]}...")
    print(f"[Процент сжатия]: {reduction}%")

    try:
        result_text = process_text(text, reduction)
        return jsonify({"message": result_text})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": f"Ошибка нейросети: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)