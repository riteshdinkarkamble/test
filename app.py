import os
import urllib.request
from flask import Flask, render_template, send_from_bytes

app = Flask(__name__, template_folder='.')

THREE_JS_URL = "https://cloudflare.com"
LOCAL_THREE_FILE = "three.min.js"

if not os.path.exists(LOCAL_THREE_FILE):
    print("📥 Downloading Three.js library locally with browser headers...")
    try:
        # Simulate browser request to prevent 403 blocks
        req = urllib.request.Request(THREE_JS_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(LOCAL_THREE_FILE, 'wb') as out_file:
            out_file.write(response.read())
        print("✅ Download complete!")
    except Exception as e:
        print(f"⚠️ Runtime download fallback failed: {e}.")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/three.min.js')
def serve_three():
    with open(LOCAL_THREE_FILE, 'rb') as f:
        return send_from_bytes(f.read(), mimetype='application/javascript')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
