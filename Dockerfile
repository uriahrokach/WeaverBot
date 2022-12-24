FROM node:19.2.0-slim

COPY . /opt/weaverbot
WORKDIR /opt/weaverbot

RUN npm install .
ENV BOT_LOGIN="login-key"

CMD ["node", "bot.js"]