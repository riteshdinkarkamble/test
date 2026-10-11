# Use the official NGINX image from the unprivileged stream for OpenShift security compatibility
FROM registry.access.redhat.com/ubi8/nginx-120:latest

# Copy your application files into the NGINX HTML directory
COPY index.html app.js .

# Expose port 8080 (the default port for the user-space NGINX image)
EXPOSE 8080

# NGINX is automatically started by the base image CMD
