FROM node:lts-alpine
WORKDIR /usr/app
COPY pacakge*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
