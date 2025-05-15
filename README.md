# MyChat - 现代化 AI 聊天应用

基于 Vue 3 和 Element Plus 构建的现代化 AI 聊天应用，支持暗色/明亮主题切换、消息样式和字体自定义，以及其他丰富功能。

## 特性

- 响应式设计，适配桌面和移动设备
- 暗色/明亮主题切换
- 主题自定义（消息渐变色、字体大小、字体选择）
- Markdown 消息渲染
- 代码块语法高亮
- Mermaid 图表支持
- 消息历史记录保存
- 支持多种部署方式（本地、Docker、Netlify、Vercel）

## 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建
npm run preview
```

### 环境变量设置

创建一个 `.env` 文件（从 `env.example` 复制），并按需设置以下变量：

```
# 网站访问密码（可选）
WEBSITE_CODE=your_password_here

# OpenAI API 密钥（必需）
API_KEY=your_api_key_here

# 默认模型和其他前端设置
VITE_DEFAULT_MODEL=gpt-3.5-turbo
VITE_DEFAULT_MAX_TOKENS=1000
VITE_MODELS=gpt-3.5-turbo:GPT-3.5,gpt-4:GPT-4,gpt-4-turbo:GPT-4 Turbo
```

## 部署指南

### Netlify 部署

1. 将代码推送到 GitHub 仓库
2. 在 Netlify 中创建新站点，连接到 GitHub 仓库
3. 设置以下环境变量：
   - `API_KEY` - 您的 OpenAI API 密钥
   - `WEBSITE_CODE` - 网站访问密码（可选）
4. 构建命令: `npm run build`
5. 发布目录: `dist`

### Vercel 部署

1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中创建新项目，连接到 GitHub 仓库
3. 设置以下环境变量：
   - `API_KEY` - 您的 OpenAI API 密钥
   - `WEBSITE_CODE` - 网站访问密码（可选）
4. 构建命令自动设置为: `npm run build`

### Docker 部署

```bash
# 使用 Docker Compose 构建和运行
docker-compose up -d
```

更多详细的部署说明，请参考：
- [DEPLOY.md](./DEPLOY.md) - 一般部署指南
- [SERVER_DEPLOY.md](./SERVER_DEPLOY.md) - 服务器部署指南
- [DOCKER_GUIDE.md](./DOCKER_GUIDE.md) - Docker 部署指南

## 故障排除

### Netlify 部署常见问题

1. 函数 API 错误：确保已正确设置 `API_KEY` 环境变量
2. 访问密码问题：检查 `WEBSITE_CODE` 环境变量设置
3. 构建失败：确保 Node.js 版本 >= 18

### Vercel 部署常见问题

1. API 路由错误：确保 `/api` 目录下的文件正确设置
2. 环境变量未生效：重新部署并检查环境变量配置

## 自定义

### 主题设置

应用内置了主题设置面板，可以自定义：
- 明亮/暗黑模式
- 用户消息渐变色
- 聊天字体大小
- 字体类型选择

## 贡献

欢迎提交 Pull Request 和 Issue 来改进此项目。

# YourChat

简洁、强大的AI聊天应用，支持多种模型和丰富的内容渲染功能。

<!-- 待添加应用截图 -->

## ✨ 核心功能

### 💬 聊天体验

- 🚀 **流式响应** - 实时展示AI回复，支持打字机效果
- ⚡ **快速响应** - 减少首字符显示时间，提升交互体验
- ⏸️ **生成控制** - 随时暂停和继续AI响应生成
- 🔄 **重新生成** - 一键重新生成AI回复
- 📱 **全设备适配** - 完美支持桌面和移动设备

### 📊 内容展示

- 📝 **完整Markdown** - 支持各种Markdown语法元素
- 🎨 **代码高亮** - 多种编程语言的语法高亮
- 📊 **图表可视化** - 支持Mermaid图表（流程图、时序图、饼图等）
- 🧮 **数学公式** - 优雅渲染行内和块级数学公式
- 📋 **表格增强** - 美观的表格样式与响应式设计
- ℹ️ **提示框** - 支持info、warning、error等提示样式
- 🌓 **双主题模式** - 自动或手动切换深色/浅色主题

### 💾 数据管理

- 📚 **会话历史** - 自动保存聊天记录，随时恢复
- 📤 **多格式导出** - 支持Markdown、HTML、TXT和JSON格式导出
- 📥 **会话导入** - 从文件导入历史会话

### ⚙️ 高级设置

- 🔌 **多模型支持** - 兼容OpenAI、Anthropic等多种API
- 🧩 **自定义模型** - 添加自定义模型到下拉菜单
- 🎛️ **参数调整** - 灵活设置温度、最大令牌数等参数
- 🔑 **API管理** - 安全配置API密钥和端点
- 👤 **角色系统** - 设置AI角色和系统提示词

## 📦 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/XD06/yourchat.git
cd yourchat
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
# 查看环境变量配置示例
cat ENV-EXAMPLE.md

# 创建本地环境变量文件
touch .env.local
# 编辑.env.local文件，添加你的API密钥和其他配置
```

> **重要安全说明**：敏感信息（如API密钥和访问密码）不应使用 `VITE_` 前缀，以防止它们被打包到前端代码中。详细说明请参阅 `ENV-EXAMPLE.md` 文件。

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

### 使用 Docker

本项目支持使用 Docker 进行部署，提供了多容器设置的 Docker Compose 配置。

#### 前提条件

- [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/) 已安装

#### 使用 Docker Compose 部署

1. 构建并启动容器：

```bash
docker-compose up -d
```

2. 应用将在 http://localhost:3000 上运行

3. 停止容器：

```bash
docker-compose down
```

#### 仅使用 Docker 部署

1. 构建 Docker 镜像：

```bash
docker build -t yourchat .
```

2. 运行容器：

```bash
docker run -d -p 3000:80 --env-file .env --name yourchat-app yourchat
```

3. 应用将在 http://localhost:3000 上运行

4. 停止容器：

```bash
docker stop yourchat-app
docker rm yourchat-app
```

## 📄 许可证

本项目采用MIT许可证

## 📬 联系方式

项目链接: [https://github.com/XD06/yourchat](https://github.com/XD06/yourchat)

