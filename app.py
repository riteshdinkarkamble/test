from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Defaulting to 8080 for OpenShift non-root compliance
    app.run(host='0.0.0.0', port=8080)
