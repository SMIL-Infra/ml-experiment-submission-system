FROM node:lts

RUN ln -sf /usr/share/zoneinfo/PRC /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
ADD package.json package-lock.json /experiment-submission-system/
WORKDIR /experiment-submission-system
RUN npm ci --registry=https://registry.npm.taobao.org
ADD . /experiment-submission-system

VOLUME [ "/experiment-submission-system/data" ]
EXPOSE 7001

CMD [ "npm", "start" ]
