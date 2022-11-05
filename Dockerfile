FROM node:18
WORKDIR /app

COPY . .

RUN npm install
#RUN npm ci --only=production

EXPOSE 8080
#CMD ["tail", "-f", "/dev/null"]
CMD [ "node", "./src/index.js" ]