from flask import Flask, request, jsonify
from main import process_text

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    return response

@app.route('/', methods=['POST', 'GET', 'OPTIONS'])
def home():
    if request.method == 'OPTIONS':
        return '', 200

    if request.method == 'GET':
        return "Server is running!", 200

    # Читаем JSON принудительно, даже если заголовки немного отличаются
    data = request.get_json(silent=True, force=True)
    if not data:
        return jsonify({"message": "No data received"}), 400

    text = data.get('text', '')
    reduction = data.get('reduction', 50)

    try:
        result_text = process_text(text, reduction)
        return jsonify({"message": result_text})
    except Exception as e:
        return jsonify({"message": f"Error inside main.py: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)