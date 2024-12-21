FROM node:18-alpine

WORKDIR /mutual_fund_broker_app/

COPY public/ /mutual_fund_broker_app/public
COPY src/ /mutual_fund_broker_app/src
COPY package.json /mutual_fund_broker_app/

RUN npm install

CMD ["npm", "start"]