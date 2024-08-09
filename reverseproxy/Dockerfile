# Use the official Nginx image from the Docker Hub
FROM nginx:latest

# Copy the Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the start script to the container
COPY start-nginx.sh /usr/bin/start-nginx.sh
RUN chmod +x /usr/bin/start-nginx.sh

# Expose port 80
EXPOSE 80

# Start Nginx using the start script
CMD ["/usr/bin/start-nginx.sh"]
