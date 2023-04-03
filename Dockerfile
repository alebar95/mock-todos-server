FROM node:latest

EXPOSE 3000

COPY ./db.json /opt/db.json

RUN npm install -g json-server

CMD ["json-server", "--port", "3000", "--host", "0.0.0.0", "/opt/db.json"]

