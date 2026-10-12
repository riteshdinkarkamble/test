FROM registry.redhat.io/ubi9/python-39:latest

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all application assets directly
COPY app.py .
COPY index.html .

# Explicitly ensure your download engine runs during image creation
RUN python -c "import urllib.request; urllib.request.urlretrieve('https://cloudflare.com', 'three.min.js')"

EXPOSE 8080

CMD ["python", "app.py"]


