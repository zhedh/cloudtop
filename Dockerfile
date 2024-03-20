FROM node:lts-bullseye-slim 

COPY . /app
WORKDIR /app

RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' >/etc/timezone

# 使用阿里云镜像，构建速度提升很大
RUN npm config set registry https://registry.npmmirror.com
RUN npm install -g pm2 
RUN npm install -g typescript

RUN cd cloudtop_server && npm install && cd ../
RUN cd cloudtop_monitor && npm install && cd ../
RUN cd cloudtop_monitor_server && npm install && cd ../
CMD npm run start
RUN pm2 log

EXPOSE 3000
EXPOSE 3100
EXPOSE 8000