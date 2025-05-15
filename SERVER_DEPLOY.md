# yourcaht 应用服务器部署指南

本文档提供了如何将 yourcaht 应用部署到服务器的详细步骤。

## 前提条件

- 服务器（Linux 系统推荐）
- 服务器上已安装 Docker 和 Docker Compose
- SSH 访问权限

## 步骤 1：准备本地文件

您已经完成了本地构建镜像的过程，并生成了 `yourcaht-app.tar` 文件和必要的配置文件。

### 准备环境变量配置

在部署前，您需要创建一个 `.env` 文件用于服务器端配置。根据 `ENV-EXAMPLE.md` 和 `ENV-LOCAL-EXAMPLE.md` 的示例，创建包含以下内容的 `.env` 文件：

```
# 敏感信息（仅服务器端可访问）
API_KEY=your_api_key_here
WEBSITE_CODE=your_access_password_here

# 公共配置变量（前端可访问）
VITE_DEFAULT_MODEL=gemini-pro
VITE_DEFAULT_MAX_TOKENS=4000
VITE_MODELS=gemini-pro:Gemini Pro,gpt-3.5-turbo:GPT-3.5 Turbo,gpt-4:GPT-4

# 服务配置
NODE_ENV=production
```

记得用实际的 API 密钥和访问密码替换示例值。

### 准备生产环境 Docker Compose 配置

我们为服务器部署准备了优化版的 Docker Compose 配置文件 `docker-compose.prod.yml`：

```yaml
version: '3.8'

services:
  app:
    image: yourcaht-app
    container_name: yourcaht-app
    ports:
      - "3000:80"
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    networks:
      - yourcaht-network
    # 设置资源限制（根据您服务器的实际情况调整）
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G

networks:
  yourcaht-network:
    driver: bridge
```

## 步骤 2：上传文件到服务器

### 通过 SCP 上传

```bash
# 将镜像文件上传到服务器
scp yourcaht-app.tar user@your-server-ip:/path/to/deployment/

# 上传 docker-compose 配置文件
scp docker-compose.prod.yml user@your-server-ip:/path/to/deployment/docker-compose.yml

# 上传 .env 文件（包含环境变量）
scp .env user@your-server-ip:/path/to/deployment/
```

## 步骤 3：在服务器上加载和运行

SSH 登录到服务器：

```bash
ssh user@your-server-ip
```

进入部署目录：

```bash
cd /path/to/deployment/
```

加载 Docker 镜像：

```bash
docker load -i yourcaht-app.tar
```

使用 docker-compose 启动应用：

```bash
docker-compose up -d
```

## 步骤 4：配置反向代理（可选但推荐）

如果您希望通过域名访问应用并启用 HTTPS，可以设置 Nginx 作为反向代理。

安装 Nginx（如果尚未安装）：

```bash
# 对于 Ubuntu/Debian
sudo apt update
sudo apt install nginx

# 对于 CentOS/RHEL
sudo yum install epel-release
sudo yum install nginx
```

创建 Nginx 配置文件：

```bash
sudo nano /etc/nginx/sites-available/yourcaht
```

添加以下配置（替换 your-domain.com 为您的实际域名）：

```
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用站点配置并重启 Nginx：

```bash
# 对于 Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/yourcaht /etc/nginx/sites-enabled/
sudo systemctl restart nginx

# 对于 CentOS/RHEL
sudo ln -s /etc/nginx/sites-available/yourcaht /etc/nginx/conf.d/
sudo systemctl restart nginx
```

## 步骤 5：配置 HTTPS（推荐）

您可以使用 Let's Encrypt 为您的站点免费添加 HTTPS：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取并安装证书
sudo certbot --nginx -d your-domain.com

# 按照屏幕上的指示完成 HTTPS 配置
```

## 步骤 6：验证部署

访问您的域名或服务器 IP 地址，确认应用正常运行。

## 故障排除

如果遇到问题，请检查以下几点：

1. 查看 Docker 容器状态：
   ```bash
   docker ps
   ```

2. 查看容器日志：
   ```bash
   docker logs yourcaht-app
   ```

3. 检查环境变量是否正确设置：
   ```bash
   cat .env
   ```

4. 检查防火墙设置，确保端口 80/443 开放：
   ```bash
   # 对于 Ubuntu/Debian
   sudo ufw status
   
   # 对于 CentOS/RHEL
   sudo firewall-cmd --list-all
   ```

## 更新应用

当您有新版本的应用需要部署时，重复步骤 1-3 即可。旧容器将被新容器替换，同时保持数据持久化（如果已配置）。

## 备份与恢复

为确保数据安全，建议定期备份重要数据和配置文件。

备份环境变量和配置：
```bash
cp .env .env.backup-$(date +%Y%m%d)
cp docker-compose.yml docker-compose.yml.backup-$(date +%Y%m%d)
```

备份 Docker 卷数据（如果使用）：
```bash
docker run --rm -v yourcaht_data:/source -v $(pwd):/backup alpine tar -czf /backup/yourcaht-data-$(date +%Y%m%d).tar.gz -C /source .
```

根据需要恢复数据：
```bash
docker run --rm -v yourcaht_data:/target -v $(pwd):/backup alpine sh -c "cd /target && tar -xzf /backup/yourcaht-data-YYYYMMDD.tar.gz"
```

## 自动更新（可选）

您可以设置 CI/CD 流程，自动构建和部署应用。常见选项包括 GitHub Actions、GitLab CI 或 Jenkins。

## 监控（推荐）

为确保应用稳定运行，建议设置监控：

```bash
# 安装 Docker 监控工具
docker run -d --name prometheus -p 9090:9090 prom/prometheus
docker run -d --name grafana -p 3000:3000 grafana/grafana
```

## 安全提示

1. 定期更新系统和 Docker：
   ```bash
   sudo apt update && sudo apt upgrade
   ```

2. 限制 SSH 访问，仅允许密钥认证
3. 使用防火墙仅开放必要端口
4. 定期检查并应用安全更新
5. **重要**：确保 .env 文件权限设置正确，只允许需要访问的用户读取
   ```bash
   chmod 600 .env
   ```

如果有任何问题，请参考 Docker 和 Nginx 的官方文档或寻求服务器管理员的帮助。 