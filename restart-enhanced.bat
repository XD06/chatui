@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cls

title MyChat 容器管理工具

echo.
echo ╔══════════════════════════════════════════════╗
echo ║             MyChat 容器管理工具              ║
echo ╚══════════════════════════════════════════════╝
echo.

REM 设置颜色代码
set "INFO=[94m"
set "SUCCESS=[92m"
set "ERROR=[91m"
set "RESET=[0m"

echo %INFO%[信息]%RESET% 检测 Docker 环境...

REM 检查 Docker 是否正在运行
docker info >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo %ERROR%[错误]%RESET% Docker 未运行或未安装！请确保 Docker 已启动。
  pause
  exit /b 1
)

echo %INFO%[信息]%RESET% Docker 正在运行，继续检测命令...

REM 检查 docker-compose 命令是否存在
where docker-compose >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  set DOCKER_COMPOSE=docker-compose
  echo %INFO%[信息]%RESET% 使用 'docker-compose' 命令
) else (
  REM 检查新版 docker compose 命令
  docker compose version >nul 2>nul
  if %ERRORLEVEL% EQU 0 (
    set DOCKER_COMPOSE=docker compose
    echo %INFO%[信息]%RESET% 使用 'docker compose' 命令
  ) else (
    echo %ERROR%[错误]%RESET% 未找到 docker-compose 或 docker compose，请先安装
    pause
    exit /b 1
  )
)

echo.
echo %INFO%[信息]%RESET% 检查 .env 文件...
if not exist .env (
  echo %ERROR%[错误]%RESET% 未找到 .env 文件！
  echo %INFO%[信息]%RESET% 是否要从示例文件创建？(Y/N)
  set /p create_env=
  if /i "!create_env!"=="Y" (
    if exist env.example (
      copy env.example .env
      echo %SUCCESS%[成功]%RESET% 已创建 .env 文件，请编辑其中的配置。
    ) else (
      echo %ERROR%[错误]%RESET% 找不到 env.example 文件！
      echo %INFO%[信息]%RESET% 将创建一个基本的 .env 文件。
      echo # MyChat基本配置文件 > .env
      echo # 请填写您的实际配置 >> .env
      echo WEBSITE_CODE= >> .env
      echo API_KEY=your_api_key_here >> .env
      echo %SUCCESS%[成功]%RESET% 已创建基本的 .env 文件，请编辑其中的配置。
    )
    echo %INFO%[信息]%RESET% 按任意键继续...
    pause >nul
  ) else (
    echo %ERROR%[错误]%RESET% 没有 .env 文件，操作取消。
    pause
    exit /b 1
  )
)

echo.
echo %INFO%[信息]%RESET% 正在停止现有容器...
%DOCKER_COMPOSE% down
if %ERRORLEVEL% NEQ 0 (
  echo %ERROR%[错误]%RESET% 停止容器时出错。
  pause
  exit /b 1
)

echo.
echo %INFO%[信息]%RESET% 正在启动应用 (使用最新环境变量)...
%DOCKER_COMPOSE% up -d
if %ERRORLEVEL% NEQ 0 (
  echo %ERROR%[错误]%RESET% 启动容器时出错，请检查 docker-compose.yml 和 .env 文件。
  pause
  exit /b 1
)

echo.
echo %SUCCESS%[成功]%RESET% 应用已成功重启，新的环境变量已应用。
echo %INFO%[信息]%RESET% 容器状态:
echo.
%DOCKER_COMPOSE% ps
echo.
echo %INFO%[信息]%RESET% 如果需要查看日志，可执行: %DOCKER_COMPOSE% logs
echo %INFO%[信息]%RESET% 或: docker logs yourchat
echo.
echo 按任意键退出...

pause >nul 