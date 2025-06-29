// 服务器端 API 代理
import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 为了支持与前端一致的Markdown渲染，引入必要的库
const require = createRequire(import.meta.url);
let markdownIt = null;
let hljs = null;

// 动态加载markdown-it（仅在处理响应时加载，避免不必要的初始化）
async function loadMarkdownDependencies() {
  if (!markdownIt) {
    try {
      // 尝试动态导入所需的库
      markdownIt = require('markdown-it');
      hljs = require('highlight.js');
      
      // 若导入失败，会默默地跳过扩展处理
      console.log('已加载Markdown处理依赖');
      return true;
    } catch (err) {
      console.warn('Markdown依赖加载失败，将跳过Markdown增强处理', err);
      return false;
    }
  }
  return !!markdownIt;
}

// 应用与前端相似的扩展到Markdown内容
function applyMarkdownExtensions(content) {
  if (!markdownIt) return content;
  
  try {
    // 创建Markdown实例
    const md = markdownIt({
      html: true,
      breaks: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch (e) {
            console.error('代码高亮失败', e);
          }
        }
        return ''; // 使用默认转义
      }
    });
    
    // 尝试导入前端使用的相同扩展
    try {
      // 动态导入markdownExtensions.js
      const markdownExtensionsPath = path.resolve(__dirname, '../src/utils/markdownExtensions.js');
      const markdownExtensions = require(markdownExtensionsPath);
      
      // 注册所有扩展
      if (typeof markdownExtensions.registerAllExtensions === 'function') {
        markdownExtensions.registerAllExtensions(md);
        console.log('成功加载前端Markdown扩展');
      }
    } catch (extensionError) {
      console.warn('加载前端Markdown扩展失败，将使用基本Markdown处理', extensionError);
    }
    
    // 渲染Markdown
    return md.render(content);
  } catch (error) {
    console.error('应用Markdown扩展失败', error);
    return content; // 出错时返回原始内容
  }
}

const router = express.Router();

// 添加CORS支持
router.use(cors());
router.use(express.json());

// 常规聊天完成API端点
router.post('/chat', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY; // 从环境变量获取API密钥
    if (!apiKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    // 从环境变量获取API URL，如果未设置则使用默认OpenAI API
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    
    const { model, messages, temperature, max_tokens, stream } = req.body;
    
    console.log(`正在处理API请求: 模型=${model}, 消息数=${messages?.length}, 流式=${stream ? '是' : '否'}`);
    
    // 如果客户端请求流式响应
    if (stream) {
      // 设置响应头以支持流式传输
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // 调用API并设置流式传输
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API错误:', errorData);
        res.write(`data: ${JSON.stringify({ error: '请求AI服务失败', details: errorData })}\n\n`);
        res.end();
        return;
      }
      
      // 直接将API的流式响应转发到客户端
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // 尝试加载Markdown处理依赖
      const markdownEnabled = await loadMarkdownDependencies();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        // 获取数据块
        let chunk = decoder.decode(value, { stream: true });
        
        // 如果启用了Markdown处理，尝试增强内容
        if (markdownEnabled) {
          try {
            // 解析SSE数据
            const lines = chunk.split('\n');
            let processedChunk = '';
            
            for (const line of lines) {
              if (line.startsWith('data: ') && !line.includes('[DONE]')) {
                try {
                  const data = JSON.parse(line.substring(6));
                  if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
                    // 由于流式内容是片段的，不对单个片段应用Markdown，而是在客户端累积后应用
                    // 这里不做处理
                  }
                } catch (e) {
                  // 解析失败，保留原始行
                }
              }
              processedChunk += line + '\n';
            }
            
            if (processedChunk) {
              chunk = processedChunk;
            }
          } catch (e) {
            console.error('处理流式响应失败', e);
            // 出错时保留原始响应
          }
        }
        
        // 直接将数据发送到客户端
        res.write(chunk);
        // 确保数据立即发送
        res.flush && res.flush();
      }
      
      res.end();
      return;
    }
    
    // 非流式请求的处理
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API错误:', errorData);
      return res.status(response.status).json({ 
        error: '请求AI服务失败', 
        details: errorData 
      });
    }
    
    const data = await response.json();
    
    // 尝试加载Markdown依赖
    const markdownEnabled = await loadMarkdownDependencies();
    
    // 如果Markdown处理可用，为内容应用扩展
    if (markdownEnabled && data.choices && data.choices[0] && data.choices[0].message) {
      const originalContent = data.choices[0].message.content;
      
      // 应用Markdown扩展，但不直接修改响应
      // 因为前端也会进行处理，避免重复处理
      const processedContent = applyMarkdownExtensions(originalContent);
      console.log('已应用Markdown增强，原始内容长度:', originalContent.length);
      
      // 在调试模式下，可以查看处理前后的差异
      if (process.env.DEBUG_MARKDOWN) {
        console.log('原始内容:', originalContent.substring(0, 100) + '...');
        console.log('处理后内容:', processedContent.substring(0, 100) + '...');
      }
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('API 调用错误:', error);
    return res.status(500).json({ error: '服务器错误', message: error.message });
  }
});

// 重新生成消息API端点
router.post('/regenerate', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    const { model, messages, temperature, max_tokens, stream } = req.body;
    
    console.log(`处理重新生成请求: 模型=${model}, 消息数=${messages?.length}`);
    
    // 重用现有的聊天逻辑，但标记为重新生成
    if (stream) {
      // 设置流式响应头
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // 调用API并传输流式响应
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream: true
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('重新生成API错误:', errorData);
        res.write(`data: ${JSON.stringify({ error: '重新生成失败', details: errorData })}\n\n`);
        res.end();
        return;
      }
      
      // 转发流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // 尝试加载Markdown处理依赖
      const markdownEnabled = await loadMarkdownDependencies();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
        res.flush && res.flush();
      }
      
      res.end();
      return;
    }
    
    // 非流式请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('重新生成API错误:', errorData);
      return res.status(response.status).json({ 
        error: '重新生成失败', 
        details: errorData 
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('重新生成错误:', error);
    return res.status(500).json({ error: '服务器错误', message: error.message });
  }
});

// 获取可用模型列表API端点 - 更新为使用后端代理
router.get('/models', handleModelsRequest);
// 添加标准格式路由 - 与OpenAI API保持一致
router.get('/v1/models', handleModelsRequest);

// 提取模型处理逻辑为单独函数以便重用
async function handleModelsRequest(req, res) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    // 提取API基础URL
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    const baseUrl = apiUrl.split('/chat/completions')[0].replace(/\/v1$/, '');
    const modelsUrl = `${baseUrl}/v1/models`;
    
    console.log(`获取模型列表: ${modelsUrl}`);
    
    const response = await fetch(modelsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('获取模型列表错误:', errorData);
      return res.status(response.status).json({ 
        error: '获取模型列表失败', 
        details: errorData 
      });
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('获取模型列表错误:', error);
    return res.status(500).json({ error: '服务器错误', message: error.message });
  }
}

// 提示词优化API端点
router.post('/optimize', async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    const { promptText, model, temperature, max_tokens } = req.body;
    
    console.log(`处理提示词优化请求: 模型=${model}, 温度=${temperature}`);
    
    if (!promptText) {
      return res.status(400).json({ error: '缺少必要的提示词内容' });
    }
    
    // 调用API进行提示词优化
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的提示词优化助手。你的任务是将用户提供的提示词优化成更清晰、更具体的版本，以便获得更好的AI回答。不要包含任何解释，只需返回优化后的提示词。'
          },
          {
            role: 'user',
            content: promptText
          }
        ],
        temperature: temperature || 0.5,
        max_tokens: max_tokens || 2000
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('提示词优化错误:', errorData);
      return res.status(response.status).json({ 
        error: '提示词优化失败', 
        details: errorData 
      });
    }
    
    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: 'API返回无效响应' });
    }
    
    return res.status(200).json({
      content: data.choices[0].message.content,
      success: true
    });
  } catch (error) {
    console.error('提示词优化错误:', error);
    return res.status(500).json({ error: '服务器错误', message: error.message });
  }
});

// 验证访问密码API端点
router.post('/verify-code', (req, res) => {
  const { code } = req.body;
  const websiteCode = process.env.WEBSITE_CODE;
  
  // 如果网站访问密码未设置或为空，则跳过验证，直接返回有效
  if (!websiteCode || websiteCode.trim() === '') {
    console.log('网站访问密码未设置或为空，跳过验证');
    return res.status(200).json({ valid: true });
  }
  
  console.log(`验证访问密码: ${code === websiteCode ? '成功' : '失败'}`);
  
  if (code === websiteCode) {
    return res.status(200).json({ valid: true });
  }
  
  return res.status(200).json({ valid: false });
});

// 健康检查端点
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.API_KEY,
    apiUrlConfigured: !!process.env.API_URL
  });
});

// 检查是否需要密码登录 - 添加此端点
router.get('/check-auth-required', (req, res) => {
  const websiteCode = process.env.WEBSITE_CODE;
  // 如果环境变量未设置或为空，则不需要密码验证
  const authRequired = !!(websiteCode && websiteCode.trim() !== '');
  
  console.log('密码登录状态检查: 需要密码验证 =', authRequired);
  
  return res.status(200).json({
    authRequired: authRequired
  });
});

export default router; 