from flask import Flask, render_template, send_from_bytes
import os

app = Flask(__name__, template_folder='.')

# Point explicitly to the secure /tmp file path
THREE_JS_PATH = "/tmp/three.min.js"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/three.min.js')
def serve_three():
    # Read directly from the writable system /tmp allocation block
    if os.path.exists(THREE_JS_PATH):
        with open(THREE_JS_PATH, 'rb') as f:
            return send_from_bytes(f.read(), mimetype='application/javascript')
    return "Three.js Engine Missing", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
