FROM registry.access.redhat.com/ubi8/nginx-120:latest

# Copy your web application files to the default UBI Nginx public directory
COPY index.html app.js /opt/app-root/src/

# Expose port 8080
EXPOSE 8080
