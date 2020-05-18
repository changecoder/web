FROM node:8.9.1

ENV PORT=8080 NODE_ENV=production

RUN mkdir -p /usr/src/web

WORKDIR /usr/src/web

COPY . /usr/src/web/packages/host

RUN npm install

EXPOSE 8080

CMD ["node", "server"]