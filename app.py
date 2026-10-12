from flask import Flask, render_template, send_file
import os
import io
import urllib.request

app = Flask(__name__, template_folder='.')

THREE_JS_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
THREE_JS_PATH = "/tmp/three.min.js"

def verify_and_download_three():
    # Force delete the file if it's corrupted, empty, or a leftover 404 text string
    if os.path.exists(THREE_JS_PATH) and os.path.getsize(THREE_JS_PATH) < 10000:
        print("🗑️ Removing invalid or corrupted three.min.js file...")
        try:
            os.remove(THREE_JS_PATH)
        except Exception:
            pass

    if not os.path.exists(THREE_JS_PATH):
        print(f"📥 Fetching fresh Three.js build to: {THREE_JS_PATH}")
        try:
            opener = urllib.request.build_opener()
            opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
            urllib.request.install_opener(opener)
            urllib.request.urlretrieve(THREE_JS_URL, THREE_JS_PATH)
            print(f"✅ Three.js verification successful! File size: {os.path.getsize(THREE_JS_PATH)} bytes.")
        except Exception as e:
            print(f"⚠️ Network fetch failed: {e}. Check cluster firewall policies.")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/three.min.js')
def serve_three():
    # Make sure the file is healthy before trying to stream it to the user
    if not os.path.exists(THREE_JS_PATH) or os.path.getsize(THREE_JS_PATH) < 10000:
        verify_and_download_three()
        
    if os.path.exists(THREE_JS_PATH):
        with open(THREE_JS_PATH, 'rb') as f:
            return send_file(
                io.BytesIO(f.read()),
                mimetype='application/javascript',
                download_name='three.min.js'
            )
    return "Three.js Engine Missing", 404

if __name__ == '__main__':
    verify_and_download_three()
    app.run(host='0.0.0.0', port=8080)
