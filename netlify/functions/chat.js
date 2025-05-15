// 处理 AI 聊天请求的 Netlify 函数
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 只接受 POST 请求
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: '只允许 POST 请求' }) 
    };
  }

  try {
    const apiKey = process.env.API_KEY;
    const body = JSON.parse(event.body);
    const { model, messages, temperature, max_tokens } = body;
    
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
    return { 
      statusCode: 200, 
      body: JSON.stringify(data) 
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: '服务器错误', message: error.message }) 
    };
  }
}; 