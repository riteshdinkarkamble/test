FROM ://redhat.com

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files directly from the root workspace
COPY app.py .
COPY index.html .

EXPOSE 8080

CMD ["python", "app.py"]
