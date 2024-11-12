#!/bin/bash
set -e

# 同步环境变量

CLOUDTOP_ENV=.env
CLOUDTOP_MONITOR_ENV=cloudtop_monitor/.env
CLOUDTOP_MONITOR_SERVER_ENV=cloudtop_monitor_server/.env
CLOUDTOP_SERVER_ENV=cloudtop_server/.env

cp "$CLOUDTOP_MONITOR_ENV.example" "$CLOUDTOP_MONITOR_ENV"
cp "$CLOUDTOP_MONITOR_SERVER_ENV.example" "$CLOUDTOP_MONITOR_SERVER_ENV"
cp "$CLOUDTOP_SERVER_ENV.example" "$CLOUDTOP_SERVER_ENV"

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
  fi

  if grep -q "^$key=" $CLOUDTOP_MONITOR_SERVER_ENV; then
    sed -i "" "s|^$key=.*|$key=$value|" $CLOUDTOP_MONITOR_SERVER_ENV
  fi

  if grep -q "^$key=" $CLOUDTOP_SERVER_ENV; then
    sed -i "" "s|^$key=.*|$key=$value|" $CLOUDTOP_SERVER_ENV
  fi
   
done < $CLOUDTOP_ENV

echo "环境变量同步完成"

# 停止正在运行的项目
pm2_list=$(pm2 list)

if [[ $pm2_list == *"online"* ]]; then
  pm2 stop cloudtop_server
  pm2 stop cloudtop_monitor_server
  pm2 stop cloudtop_monitor
fi

# 启动 cloudtop_server 项目
cd cloudtop_server && npm run start && cd ../ &&

# 启动 cloudtop_monitor_server 项目
cd cloudtop_monitor_server && npm run start && cd ../ &&

# 启动 cloudtop_monitor 项目
cd cloudtop_monitor && npm run start && cd ../ 

