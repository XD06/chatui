# 服务器 API 代理配置指南

本文档说明如何在服务器上配置 yourcaht 应用以保护 API 密钥安全。

## 概述

在服务器部署中，我们采用了以下安全措施保护 API 密钥：

1. 使用服务器端 API 代理转发请求到 OpenAI API
2. 将 API 密钥存储在服务器环境变量中，不暴露给前端
3. 使用 Express.js 作为 API 代理服务器
4. 使用 Docker 容器化应用部署

## 服务器文件结构

```
/server
  /api.js       # API 路由实现
  /index.js     # Express 服务器主文件
/.env           # 环境变量配置（不包含在代码仓库中）
/Dockerfile     # 用于构建 Docker 镜像
/docker-compose.yml      # 开发环境 Docker 配置
/docker-compose.prod.yml # 生产环境 Docker 配置
```

## 环境变量配置

创建 `.env` 文件并添加以下内容：

```
# API 密钥（服务器端安全存储）
API_KEY=your_openai_api_key_here

# 网站访问密码（可选）
WEBSITE_CODE=your_access_code_here

# 公共配置（前端可见）
VITE_DEFAULT_MODEL=gpt-3.5-turbo
VITE_DEFAULT_MAX_TOKENS=4000
VITE_MODELS=gpt-3.5-turbo:GPT-3.5 Turbo,gpt-4:GPT-4

# 服务器端口设置
PORT=3000
```

## 部署步骤

### 1. 准备服务器

确保服务器安装了 Docker 和 Docker Compose：

```bash
# 安装 Docker（Ubuntu/Debian）
sudo apt update
sudo apt install docker.io docker-compose

# 启动 Docker 服务
sudo systemctl enable docker
sudo systemctl start docker
```

### 2. 构建和部署应用

将您的代码部署到服务器，然后执行：

```bash
# 构建镜像
docker build -t yourcaht-app .

# 或者，从已有的 tar 文件加载镜像
docker load -i yourcaht-app.tar

# 创建 .env 文件
nano .env
# 添加环境变量（参考上面的示例）

# 使用 docker-compose 启动应用
docker-compose -f docker-compose.prod.yml up -d
```

### 3. 配置 Nginx 反向代理（推荐）

为应用添加 Nginx 反向代理以启用 HTTPS：

```bash
# 安装 Nginx
sudo apt install nginx

# 创建站点配置
sudo nano /etc/nginx/sites-available/yourcaht
```

添加以下配置（替换 your-domain.com 为您的实际域名）：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到 HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL 配置
    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # 安全头
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # 反向代理到 Express 服务器
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 优化静态文件传送
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

启用配置并重启 Nginx：

```bash
sudo ln -s /etc/nginx/sites-available/yourcaht /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

### 4. 获取 SSL 证书（Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 安全建议

1. 限制 `.env` 文件访问权限：
   ```bash
   chmod 600 .env
   ```

2. 定期更新 Docker 镜像和容器

3. 使用防火墙仅开放必要端口：
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

4. 定期备份环境配置：
   ```bash
   cp .env .env.backup-$(date +%Y%m%d)
   ```

## 故障排查

1. 检查 Docker 容器状态：
   ```bash
   docker ps
   docker logs yourcaht-app
   ```

2. 验证环境变量：
   ```bash
   docker exec yourcaht-app env | grep API_KEY
   ```

3. 检查 Nginx 配置：
   ```bash
   sudo nginx -t
   ```

如有其他问题，请参考详细的部署文档或联系系统管理员。 