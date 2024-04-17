FROM node:lts-alpine3.19
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY pacakge*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
