FROM node:12-alpine

WORKDIR '/app'
COPY package.json .
RUN npm install
# Copy all files
COPY . .