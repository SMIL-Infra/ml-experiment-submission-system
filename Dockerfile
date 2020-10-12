FROM node:12.12.0

ADD package.json package-lock.json /experiment-submission-system/
WORKDIR /experiment-submission-system
RUN npm ci
ADD . /experiment-submission-system

VOLUME [ "/experiment-submission-system/data" ]
EXPOSE 7001

CMD [ "npm", "run", "dev" ]
