FROM node:16-alpine

WORKDIR /usr/src/app

COPY . .

EXPOSE 8080

WORKDIR /usr/src/app/client
RUN npm install
RUN npm run build

WORKDIR /usr/src/app/server
RUN npm install
RUN mv ../hosts.json .
CMD ["npm", "run", "start"]



