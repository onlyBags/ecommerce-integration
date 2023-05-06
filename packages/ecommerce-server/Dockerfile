FROM node:18-alpine AS base

ENV HOST=0.0.0.0
ENV PORT=8080

WORKDIR /app

RUN addgroup --system dg-live && \
          adduser --system -G dg-live dg-live

COPY ../../dist/packages/ecommerce-server ./
COPY ["package.json", "package-lock.json*", "ecommerce-server/"]
RUN ls 

RUN npm install

RUN chown -R dg-live:dg-live .

CMD ["node", "src/index.js"]