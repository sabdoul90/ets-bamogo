FROM node:18

WORKDIR /backend-bamogo-app

COPY package*.json ./
RUN npm install

RUN npm install -g sequelize-cli

RUN npm install -g nodemon

COPY . .

EXPOSE 1984

CMD ["sh", "-c", "echo 'Waiting DB...' && sleep 5 && npx sequelize db:migrate && npm start"]