FROM registry.redhat.io/ubi9/python-39:latest

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY index.html .

# 1. Download directly to the writable /tmp directory to bypass security permission blocks
RUN python -c "import urllib.request; opener = urllib.request.build_opener(); opener.addheaders = [('User-Agent', 'Mozilla/5.0')]; urllib.request.install_opener(opener); urllib.request.urlretrieve('https://cloudflare.com', '/tmp/three.min.js')"

# 2. Safely move the file into your local app runtime working directory
RUN cp /tmp/three.min.js ./three.min.js

EXPOSE 8080

CMD ["python", "app.py"]
