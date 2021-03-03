FROM node:10

RUN apt-get update && \
    apt-get install git -y

ARG APP_DIR=/usr/src/app
RUN mkdir -p ${APP_DIR}

COPY . ${APP_DIR}

WORKDIR ${APP_DIR}

RUN npm install
RUN npm run build

ENTRYPOINT ["/usr/local/bin/npm"]

EXPOSE 9000/tcp
CMD ["run", "start-container"]