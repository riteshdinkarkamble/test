FROM registry.redhat.io/ubi9/python-39:latest

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .
COPY index.html .

# Bypasses Cloudflare 403 block by simulating a regular browser header
RUN python -c "\
import urllib.request; \
req = urllib.request.Request('https://cloudflare.com', headers={'User-Agent': 'Mozilla/5.0'}); \
with urllib.request.urlopen(req) as response, open('three.min.js', 'wb') as out_file: \
    out_file.write(response.read())"

EXPOSE 8080

CMD ["python", "app.py"]



