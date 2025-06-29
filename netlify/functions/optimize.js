// 提示词优化的 Netlify 函数
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
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'API密钥未配置' }) 
      };
    }
    
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    const body = JSON.parse(event.body);
    const { promptText, model, temperature, max_tokens } = body;
    
    console.log(`处理提示词优化请求: 模型=${model}, 温度=${temperature}`);
    
    if (!promptText) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: '缺少必要的提示词内容' }) 
      };
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
      return { 
        statusCode: response.status, 
        body: JSON.stringify({ 
          error: '提示词优化失败', 
          details: errorData 
        }) 
      };
    }
    
    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'API返回无效响应' }) 
      };
    }
    
    return { 
      statusCode: 200, 
      body: JSON.stringify({
        content: data.choices[0].message.content,
        success: true
      }) 
    };
  } catch (error) {
    console.error('提示词优化错误:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: '服务器错误', message: error.message }) 
    };
  }
}; 