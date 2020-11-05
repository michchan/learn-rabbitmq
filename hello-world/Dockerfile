FROM rabbitmq:3-management-alpine

# Start rabbitmq server
RUN rabbitmq-server -detached

WORKDIR /usr/app
COPY ./package.json ./
RUN apk add --update nodejs npm
RUN npm install
# Copy all files
COPY ./ ./