FROM node:19 as debug
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install nodemon -g
COPY . .
EXPOSE 3001
ENTRYPOINT [ "nodemon", "--inspect=0.0.0.0", "."]



FROM node:19 as prod
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD [ "node", "."]