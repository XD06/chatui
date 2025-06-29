// 提示词优化API端点
export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

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
} 