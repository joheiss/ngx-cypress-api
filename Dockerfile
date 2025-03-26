FROM cypress/base

RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install

CMD ["npm", "run", "cypress:run"]
