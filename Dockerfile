FROM node:18-alpine
WORKDIR /app
RUN npm install --global pm2

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3000

CMD [ "pm2-runtime", "start", "npm", "--", "run", "start" ]
