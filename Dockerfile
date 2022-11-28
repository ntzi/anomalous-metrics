FROM node:16
RUN npm install -g ts-node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
ENV PORT 3000
EXPOSE $PORT
CMD ["npm", "run", "dev"]
