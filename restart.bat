@echo off
chcp 65001 >nul
cls

echo [INFO] 正在重启 MyChat 应用以应用新的环境变量...

REM 检查 docker-compose 命令是否存在
where docker-compose >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  set DOCKER_COMPOSE=docker-compose
  echo [INFO] 使用 'docker-compose' 命令
) else (
  REM 检查新版 docker compose 命令
  docker compose version >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    set DOCKER_COMPOSE=docker compose
    echo [INFO] 使用 'docker compose' 命令
  ) else (
    echo [ERROR] 未找到 docker-compose 或 docker compose，请先安装
    exit /b 1
  )
)

echo [INFO] 停止并重新创建容器...
%DOCKER_COMPOSE% down
%DOCKER_COMPOSE% up -d

if %ERRORLEVEL% EQU 0 (
  echo [SUCCESS] 应用已成功重启，新的环境变量已应用
  echo [INFO] 运行 'docker logs yourchat' 查看应用日志
) else (
  echo [ERROR] 重启应用时出错，请检查 docker-compose.yml 文件
)

pause 