from flask import Flask, render_template, send_file
import os
import io

app = Flask(__name__, template_folder='.')

# Point explicitly to the secure /tmp file path where the build saved it
THREE_JS_PATH = "/tmp/three.min.js"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/three.min.js')
def serve_three():
    # Read directly from the writable system /tmp allocation block
    if os.path.exists(THREE_JS_PATH):
        with open(THREE_JS_PATH, 'rb') as f:
            # Wrap the raw file bytes in a BytesIO stream so send_file can process it cleanly
            return send_file(
                io.BytesIO(f.read()),
                mimetype='application/javascript',
                download_name='three.min.js'
            )
    return "Three.js Engine Missing", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
