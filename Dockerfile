#Specify a base image
FROM node:alpine


WORKDIR /usr/app

#Install some dependecies

COPY ./package.json ./
RUN npm install
COPY ./ ./

#Default command

CMD ["npm", "start"]