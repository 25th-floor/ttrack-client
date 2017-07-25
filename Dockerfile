FROM nginx:mainline

RUN mkdir -p /var/www

COPY public/ /var/www
COPY docker/nginx/conf.d /etc/nginx/conf.d

# Entrypoint related
COPY docker/nginx/entrypoint.sh /entrypoint.sh
COPY docker/nginx/entrypoint.d /entrypoint.d

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]