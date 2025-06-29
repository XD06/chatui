# AIchat

AIchat是一个现代化的AI聊天应用，支持流式响应、Markdown渲染、代码高亮、数学公式和图表生成等功能。

## 特性

- ✨ **流式响应** - 实时显示AI回复，无需等待完整响应
- 📝 **Markdown支持** - 完整支持Markdown语法，包括表格和列表
- 💻 **代码高亮** - 自动识别并高亮显示代码块
- 🔢 **数学公式** - 使用KaTeX渲染LaTeX数学公式
- 📊 **图表生成** - 支持Mermaid图表语法
- 🌓 **暗色模式** - 内置亮色/暗色主题切换
- 🔒 **密码保护** - 可选的访问密码保护
- 🔄 **历史记录** - 保存和管理聊天历史
- 🚀 **多种部署方式** - 支持Docker、Vercel和Netlify部署

## 部署方式

### 1. Docker部署（推荐，功能完整）

最简单的方式是使用Docker Compose:

```bash
# 克隆仓库
git clone https://github.com/yourusername/aichat.git
cd aichat

# 创建环境变量文件
cp .env.example .env
# 编辑.env文件，添加你的API密钥

# 启动容器
docker-compose up -d
```

访问 http://localhost:3000 即可使用。

#### 生产环境部署

```bash
# 使用生产配置
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Vercel部署（基本功能）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FXD06%2Fchatui)

1. 点击上方按钮，直接从GitHub仓库导入项目到Vercel
2. 在Vercel项目设置中添加以下环境变量:
   - `API_KEY`: 你的OpenAI API密钥
   - `WEBSITE_CODE`: (可选) 访问密码

Vercel部署现已支持流式响应和所有主要功能，与Docker部署体验一致。

### 3. Netlify部署（基本功能）

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/XD06/chatui)

1. 点击上方按钮，直接从GitHub仓库导入项目到Netlify
2. 在Netlify项目设置中添加以下环境变量:
   - `API_KEY`: 你的OpenAI API密钥
   - `WEBSITE_CODE`: (可选) 访问密码

Netlify部署使用优化的流式响应方案，提供与Docker部署相似的用户体验。

### 4. 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 配置选项

主要配置通过环境变量设置:

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `API_KEY` | AI服务提供商的API密钥 | - |
| `API_URL` | API端点URL | https://api.openai.com/v1/chat/completions |
| `PORT` | 服务器监听端口 | 3000 |
| `WEBSITE_CODE` | 访问密码 (留空则无需密码) | - |

## 使用示例

### 基本对话

直接在输入框中输入问题并发送:

```
如何使用JavaScript创建一个简单的计时器？
```

### 代码示例

```
生成一个React计数器组件
```

### 数学公式

```
请解释牛顿第二定律并用LaTeX公式表示
```

### 图表生成

```
使用Mermaid语法创建一个简单的流程图，展示用户注册流程
```

## 更多信息

- [技术文档](TECH_DOC.md) - 详细的技术实现文档
- [贡献指南](CONTRIBUTING.md) - 如何贡献代码
- [许可证](LICENSE) - MIT许可证

## 项目结构

```
AIchat/
├── api/                # API路由（备选部署方式）
├── dist/               # 构建输出目录
├── public/             # 静态资源文件
│   ├── logo.svg        # 应用图标
│   └── favicon.ico     # 网站图标
├── server/             # 服务器端代码
│   ├── api.js          # API路由和代理实现
│   └── index.js        # 服务器入口文件
├── src/                # 前端源代码
│   ├── assets/         # 资源文件
│   │   ├── styles/     # SCSS样式文件
│   │   └── themes/     # 主题相关文件
│   ├── components/     # Vue组件
│   │   ├── ChatInput.vue    # 聊天输入组件
│   │   ├── ChatMessage.vue  # 消息显示组件
│   │   └── ThemeSettings.vue # 主题设置组件
│   ├── config/         # 配置文件
│   │   └── promptTemplates.js # 提示词模板
│   ├── router/         # Vue Router配置
│   ├── stores/         # Pinia状态管理
│   │   ├── chat.js     # 聊天状态
│   │   ├── history.js  # 历史记录
│   │   └── settings.js # 应用设置
│   ├── utils/          # 工具函数
│   │   ├── apiService.js    # API服务
│   │   ├── markdown.js      # Markdown处理
│   │   ├── mermaid-plugin.js # Mermaid图表支持
│   │   └── codeExecutor.js  # 代码执行器
│   ├── views/          # 页面视图
│   │   └── ChatView.vue # 主聊天界面
│   ├── App.vue         # 根组件
│   └── main.js         # 应用入口
├── .dockerignore       # Docker忽略文件
├── .gitignore          # Git忽略文件
├── docker-compose.yml  # 开发环境Docker配置
├── docker-compose.prod.yml # 生产环境Docker配置
├── Dockerfile          # 标准Docker构建文件
├── Dockerfile.offline  # 离线部署Docker构建文件
├── index.html          # HTML入口文件
├── package.json        # 项目依赖配置
└── vite.config.js      # Vite构建配置
```

