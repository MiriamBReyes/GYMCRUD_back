FROM node:18

WORKDIR /app

COPY ./backend/package*.json ./

RUN npm install

COPY ./backend .

EXPOSE 8080

CMD ["node", "src/index.js"]
