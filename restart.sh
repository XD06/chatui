#!/bin/bash

# 打印彩色信息
function print_info() {
  echo -e "\033[1;36m[INFO] $1\033[0m"
}

function print_success() {
  echo -e "\033[1;32m[SUCCESS] $1\033[0m"
}

function print_error() {
  echo -e "\033[1;31m[ERROR] $1\033[0m"
}

print_info "正在重启 MyChat 应用以应用新的环境变量..."

# 检查 docker-compose 是否存在
if ! command -v docker-compose &> /dev/null; then
  if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    # 新版 Docker 使用 'docker compose' 而不是 'docker-compose'
    DOCKER_COMPOSE="docker compose"
    print_info "使用 'docker compose' 命令"
  else
    print_error "未找到 docker-compose 或 docker compose，请先安装"
    exit 1
  fi
else
  DOCKER_COMPOSE="docker-compose"
  print_info "使用 'docker-compose' 命令"
fi

# 重启容器
print_info "停止并重新创建容器..."
$DOCKER_COMPOSE down
$DOCKER_COMPOSE up -d

# 检查是否成功
if [ $? -eq 0 ]; then
  print_success "应用已成功重启，新的环境变量已应用"
  print_info "运行 'docker logs yourchat' 查看应用日志"
else
  print_error "重启应用时出错，请检查 docker-compose.yml 文件"
fi 