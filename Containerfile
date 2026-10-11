FROM python:3.11-slim

WORKDIR /app

# Copy the HTML file into the container
COPY index.html /app/index.html

# Expose port 8080
EXPOSE 8080

# Run a simple HTTP server on port 8080
CMD ["python3", "-m", "http.server", "8080"]
