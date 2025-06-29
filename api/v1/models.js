// 标准格式的模型列表API端点
export default async function handler(req, res) {
  // 只接受 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只允许 GET 请求' });
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API密钥未配置' });
    }
    
    // 提取API基础URL
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    const baseUrl = apiUrl.split('/chat/completions')[0].replace(/\/v1$/, '');
    const modelsUrl = `${baseUrl}/v1/models`;
    
    console.log(`获取模型列表 (标准格式): ${modelsUrl}`);
    
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