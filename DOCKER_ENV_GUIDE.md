# Docker环境变量管理指南

本文档介绍如何简化Docker容器的环境变量管理，特别是解决修改环境变量后需要重新创建容器的问题。

## 简化的方法

我们提供了两种方法来简化环境变量的更新：

1. 使用Docker Compose自动管理容器
2. 使用快速重启脚本应用新的环境变量

## 使用方法

### 初始设置

1. 确保您已经安装了Docker和Docker Compose
2. 在项目根目录创建`.env`文件，包含所有需要的环境变量：

```
# 网站访问密码（留空则不需要密码验证）
WEBSITE_CODE=your_password_here

# API密钥
API_KEY=your_api_key_here

# 其他配置参数...
```

### 使用Docker Compose启动应用

首次启动应用程序：

```bash
docker-compose up -d
```

这将构建镜像并创建容器，自动加载`.env`文件中的环境变量。

### 更新环境变量

当您需要更改环境变量时：

1. 编辑`.env`文件，修改所需的环境变量
2. 运行重启脚本：

**Windows系统**：
双击运行`restart.bat`或在命令提示符中执行：
```
restart.bat
```

**Linux/Mac系统**：
```bash
./restart.sh
```

这个脚本会自动:
- 停止当前运行的容器
- 重新创建容器并应用新的环境变量
- 启动服务

不需要手动删除和重建容器！

## 环境变量说明

### 关键环境变量

- `WEBSITE_CODE`: 网站访问密码，设置为空字符串时将不显示密码界面
- `API_KEY`: 用于访问AI服务的API密钥
- `API_URL`: API服务的URL地址（可选）

### 前端可访问变量

带有`VITE_`前缀的变量在构建时会注入到前端代码中，可以在浏览器中访问：

```
# 默认模型配置
VITE_DEFAULT_MODEL=THUDM/GLM-4-9B-0414
VITE_DEFAULT_MAX_TOKENS=1000
VITE_MODELS=THUDM/GLM-4-9B-0414:GLM-4-9B,Qwen/Qwen3-8B:Qwen3-8B
```

### 敏感信息（仅服务器端可访问）

没有`VITE_`前缀的变量不会被注入到前端代码中，只能在服务器端访问，更加安全：

```
# API密钥 - 用于服务器端调用AI API
API_KEY=your_api_key_here

# 网站访问密码 - 如果设置，用户需要输入此密码才能访问网站
WEBSITE_CODE=your_access_password_here
```

## 备注

- 如果您的环境中已经存在名为`yourchat`的容器，第一次运行可能需要手动移除：
  ```
  docker rm -f yourchat
  ```

- 您也可以通过修改`docker-compose.yml`文件来更改容器名称、端口等配置 