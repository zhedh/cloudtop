#!/bin/bash
set -e

# 同步环境变量

CLOUDTOP_ENV=.env
CLOUDTOP_MONITOR_ENV=cloudtop_monitor/.env
CLOUDTOP_MONITOR_SERVER_ENV=cloudtop_monitor_server/.env
CLOUDTOP_SERVER_ENV=cloudtop_server/.env

if [ -n "$1" ]; then
    CLOUDTOP_ENV="$CLOUDTOP_ENV.$1"
fi

echo "CLOUDTOP_ENV: "
echo $CLOUDTOP_ENV
 
# 将环境变量配置写入各个项目的环境变量
#
while IFS='=' read -r key value; do
  # 注意这里我们忽略以井号(#)开头的注释行
  [[ $key =~ ^#.* ]] && continue

  if grep -q "^$key=" $CLOUDTOP_MONITOR_ENV; then
    # 如果存在，使用 sed 命令替换 value
    sed -i "" "s|^$key=.*|$key=$value|" $CLOUDTOP_MONITOR_ENV
    echo "Key '$key' has been updated with the new value in $CLOUDTOP_MONITOR_ENV"
  fi

  if grep -q "^$key=" $CLOUDTOP_MONITOR_SERVER_ENV; then
    sed -i "" "s|^$key=.*|$key=$value|" $CLOUDTOP_MONITOR_SERVER_ENV
    echo "Key '$key' has been updated with the new value in $CLOUDTOP_MONITOR_SERVER_ENV"
  fi

  if grep -q "^$key=" $CLOUDTOP_SERVER_ENV; then
    sed -i "" "s|^$key=.*|$key=$value|" $CLOUDTOP_SERVER_ENV
    echo "Key '$key' has been updated with the new value in $CLOUDTOP_SERVER_ENV"
  fi

   
done < $CLOUDTOP_ENV


# 停止正在运行的项目
pm2 stop all

# 启动 cloudtop_server 项目
cd cloudtop_server && npm run start && cd ../ &&

# 启动 cloudtop_monitor_server 项目
cd cloudtop_monitor_server && npm run start && cd ../ &&

# 启动 cloudtop_monitor 项目
cd cloudtop_monitor && npm run start && cd ../ 

