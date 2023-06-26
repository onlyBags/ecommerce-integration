FROM node:18

WORKDIR /usr/ecommerce-monorepo
COPY package*.json ./
COPY nx.json ./
COPY packages ./packages
COPY wait-for-it.sh ./wait-for-it.sh

RUN npm i
RUN npm i -g nodemon
# Building all the packages
RUN npm run build

