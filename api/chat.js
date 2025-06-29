// 处理 AI 聊天请求的 API 路由
export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  try {
    const apiKey = process.env.API_KEY; // 从环境变量获取 API 密钥
    if (!apiKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    const { model, messages, temperature, max_tokens, stream } = req.body;
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    
    console.log(`处理API请求: 模型=${model}, 消息数=${messages?.length}, 流式=${stream ? '是' : '否'}`);
    
    // 处理流式响应
    if (stream) {
      // 设置响应头以支持流式传输
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      try {
        // 创建到AI服务的请求
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
          console.error('API请求错误:', errorData);
          res.write(`data: ${JSON.stringify({ error: '请求AI服务失败', details: errorData })}\n\n`);
          return res.end();
        }
        
        // 直接将流转发给客户端
        const reader = response.body.getReader();
        
        async function readStream() {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              res.end();
              break;
            }
            
            // 直接将原始数据块发送给客户端
            const chunk = new TextDecoder().decode(value);
            res.write(chunk);
            
            // 确保数据立即发送
            if (res.flush) {
              res.flush();
            }
          }
        }
        
        // 开始读取流
        await readStream();
      } catch (error) {
        console.error('处理流式响应错误:', error);
        res.write(`data: ${JSON.stringify({ error: '处理流式响应失败', message: error.message })}\n\n`);
        return res.end();
      }
    } else {
      // 非流式响应
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
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API请求错误:', errorData);
        return res.status(response.status).json({ 
          error: 'API请求失败', 
          details: errorData 
        });
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (error) {
    console.error('处理请求错误:', error);
    return res.status(500).json({ error: '服务器错误', message: error.message });
  }
} 