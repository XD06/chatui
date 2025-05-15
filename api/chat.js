// 处理 AI 聊天请求的 API 路由
export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  try {
    const apiKey = process.env.API_KEY; // 从环境变量获取 API 密钥
    const { model, messages, temperature, max_tokens } = req.body;
    
    // 调用外部 API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('API 调用错误:', error);
    return res.status(500).json({ error: '服务器错误', message: error.message });
  }
} 