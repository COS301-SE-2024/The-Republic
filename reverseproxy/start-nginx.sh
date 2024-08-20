#!/bin/sh
# Replace the placeholder with the actual port
sed -i "s/PORT_PLACEHOLDER/$PORT/" /etc/nginx/nginx.conf
# Start Nginx
nginx -g 'daemon off;'
