FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --silent && npm cache clean --force

COPY . ./

CMD [ "npm", "run", "dev" ]

EXPOSE 3000