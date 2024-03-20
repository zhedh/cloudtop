#!/bin/bash
set -e

# 项目初始化，依赖安装

# 国内使用阿里云镜像，构建速度提升很大
npm config set registry https://registry.npmmirror.com
npm install -g pm2  &&
npm install -g typescript &&

# 项目以来安装
cd cloudtop_server && npm install && cd ../ &&
cd cloudtop_monitor_server && npm install && cd ../ &&
cd cloudtop_monitor && npm install && cd ../

