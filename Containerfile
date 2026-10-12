FROM registry.redhat.io/ubi9/python-39:latest

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY index.html .

# Single line python statement that cleanly executes without multi-line layout blocks
RUN python -c "import urllib.request; opener = urllib.request.build_opener(); opener.addheaders = [('User-Agent', 'Mozilla/5.0')]; urllib.request.install_opener(opener); urllib.request.urlretrieve('https://cloudflare.com', 'three.min.js')"

EXPOSE 8080

CMD ["python", "app.py"]




