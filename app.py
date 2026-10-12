import os
import urllib.request
from flask import Flask, render_template, send_from_bytes

app = Flask(__name__, template_folder='.')

# --- AUTOMATIC DOWNLOAD OF THREE.JS TO PREVENT BLACK SCREEN ---
THREE_JS_URL = "https://cloudflare.com"
LOCAL_THREE_FILE = "three.min.js"

if not os.path.exists(LOCAL_THREE_FILE):
    print("📥 Downloading Three.js library locally to bypass OpenShift network blocks...")
    try:
        urllib.request.urlretrieve(THREE_JS_URL, LOCAL_THREE_FILE)
        print("✅ Download complete! Three.js is now bundled inside the container.")
    except Exception as e:
        print(f"⚠️ CDN download failed: {e}. Check cluster internet access.")

@app.route('/')
def home():
    return render_template('index.html')

# Endpoint to safely serve the JavaScript asset to the browser from your OpenShift Pod
@app.route('/three.min.js')
def serve_three():
    with open(LOCAL_THREE_FILE, 'rb') as f:
        return send_from_bytes(f.read(), mimetype='application/javascript')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
