// 获取可用模型列表的 Netlify 函数
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 只接受 GET 请求
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: '只允许 GET 请求' }) 
    };
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'API密钥未配置' }) 
      };
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
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ 
          error: '获取模型列表失败', 
          details: errorData 
        }) 
      };
    }
    
    const data = await response.json();
    return { 
      statusCode: 200, 
      body: JSON.stringify(data) 
    };
  } catch (error) {
    console.error('获取模型列表错误:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: '服务器错误', message: error.message }) 
    };
  }
}; 