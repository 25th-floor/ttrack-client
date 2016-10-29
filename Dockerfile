FROM node:5

MAINTAINER 25th-floor GmbH "team@25th-floor.com"
EXPOSE "8080"

# Installing production dependencies
ENV NODE_ENV production
ADD ./package.json /tmp/
RUN cd /tmp && \
	npm install

COPY . /app
WORKDIR /app
RUN cp -R /tmp/node_modules/ /app/node_modules/ && \
	cp config/config.json.example config.json

COPY ./docker-entrypoint.sh /
ENTRYPOINT ["/docker-entrypoint.sh"]

CMD ["ttrack-server"]
