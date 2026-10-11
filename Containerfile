FROM nginx:alpine

# Copy the jungle web application into NGINX public directory
COPY index.html /usr/share/nginx/html/index.html

# Expose standard web port
EXPOSE 8080

# Adjust NGINX configuration to run securely as non-root (OpenShift security requirement)
RUN sed -i 's/listenVirt 80;/listen 8080;/g' /etc/nginx/conf.d/default.conf || \
    sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

USER nginx
