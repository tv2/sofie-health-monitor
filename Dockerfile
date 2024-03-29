FROM node:16-alpine

EXPOSE 8080

WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]
