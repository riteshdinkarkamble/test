from flask import Flask, render_template_string, request, session
import random

app = Flask(__name__)
app.secret_key = 'openshift-secret-key'  # Required for sessions

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>OpenShift Base Game</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; background-color: #f4f4f9; }
        .card { background: white; padding: 30px; border-radius: 10px; display: inline-block; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        input[type="number"] { padding: 10px; width: 80px; font-size: 16px; }
        button { padding: 10px 20px; font-size: 16px; background-color: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="card">
        <h2>🎯 OpenShift Number Guessing Game</h2>
        <p>{{ message }}</p>
        <form method="POST">
            <input type="number" name="guess" min="1" max="100" required>
            <button type="submit">Guess</button>
        </form>
        <br>
        <a href="/reset"><button style="background-color: #666;">Restart Game</button></a>
    </div>
</body>
</html>
"""

@app.route('/', methods=['GET', 'POST'])
def game():
    if 'number' not in session:
        session['number'] = random.randint(1, 100)
        session['message'] = "I'm thinking of a number between 1 and 100!"

    if request.method == 'POST':
        try:
            guess = int(request.form['guess'])
            if guess < session['number']:
                session['message'] = f"📉 {guess} is too low! Try higher."
            elif guess > session['number']:
                session['message'] = f"📈 {guess} is too high! Try lower."
            else:
                session['message'] = f"🎉 Winner! The number was {session['number']}. Game restarted!"
                session.pop('number', None)
        except ValueError:
            session['message'] = "⚠️ Please enter a valid number."

    return render_template_string(HTML_TEMPLATE, message=session['message'])

@app.route('/reset')
def reset():
    session.pop('number', None)
    return f"<script>window.location.href='/'</script>"

if __name__ == '__main__':
    # OpenShift routes traffic on 8080 by default for non-root containers
    app.run(host='0.0.0.0', port=8080)
