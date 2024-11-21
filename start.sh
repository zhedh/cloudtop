#!/bin/bash
set -e

update_env_value() {
  local key=$1
  local value=$2
  local file=$3

  if grep -q "^$key=" $file; then
    # 如果存在，使用 sed 命令替换 value
    if [[ "$OSTYPE" == "darwin"* ]]; then
      # macOS
      sed -i '' "s|^$key=.*|$key=$value|" "$file"
    else
      # Linux
      sed -i "s|^$key=.*|$key=$value|" "$file"
    fi
  fi
}

pm2_stop() {
  if test -z $(pm2 pid $1); then
    echo "$1 应用不存在"
  else 
    echo "$1 应用存在"
    pm2 stop $1
  fi
}

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

  update_env_value "$key" "$value" "$CLOUDTOP_MONITOR_ENV"

  update_env_value "$key" "$value" "$CLOUDTOP_MONITOR_SERVER_ENV"

  update_env_value "$key" "$value" "$CLOUDTOP_SERVER_ENV"
   
done < $CLOUDTOP_ENV

echo "环境变量同步完成"

# 启动 cloudtop_server 项目
pm2_stop 'cloudtop_server'
cd cloudtop_server && npm run start && cd ../ &&

# 启动 cloudtop_monitor_server 项目
pm2_stop 'cloudtop_monitor_server'
cd cloudtop_monitor_server && npm run start && cd ../ &&

# 启动 cloudtop_monitor 项目
pm2_stop 'cloudtop_monitor'
cd cloudtop_monitor && npm run start && cd ../ 

