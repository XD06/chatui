# 环境变量配置示例

在部署项目时，请按照以下格式配置环境变量。

## 公共配置变量（前端可访问）

以 `VITE_` 开头的变量会在构建时被注入到前端代码中，可以在浏览器中访问：

```
# 默认模型配置
VITE_DEFAULT_MODEL=THUDM/GLM-4-9B-0414
VITE_DEFAULT_MAX_TOKENS=1000
VITE_MODELS=THUDM/GLM-4-9B-0414:GLM-4-9B,Qwen/Qwen3-8B:Qwen3-8B
```

## 敏感信息（仅服务器端可访问）

不带 `VITE_` 前缀的变量不会被注入到前端代码中，只能在服务器端（API 路由）中访问：

```
# API密钥 - 用于服务器端调用AI API
API_KEY=your_api_key_here

# 网站访问密码 - 如果设置，用户需要输入此密码才能访问网站
WEBSITE_CODE=your_access_password_here
```

## 重要安全说明

1. **敏感信息**（如API密钥和访问密码）**不应使用** `VITE_` 前缀，这样它们就不会被打包到前端代码中
2. **带有 `VITE_` 前缀**的环境变量会在构建时被注入到前端代码中，可能被用户查看
3. **不带 `VITE_` 前缀**的环境变量只能在服务器端（API路由）中访问，更加安全

## 在不同平台设置环境变量

### Vercel

1. 进入项目设置
2. 找到 "Environment Variables" 部分
3. 添加上述环境变量

### Netlify

1. 进入站点设置
2. 找到 "Build & deploy" > "Environment variables" 部分
3. 添加上述环境变量

### 本地开发

1. 复制此示例内容到 `.env.local` 文件（该文件会被 Git 忽略）
2. 填入实际的值
3. 重启开发服务器 