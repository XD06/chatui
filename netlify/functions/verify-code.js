// 验证访问密码的 Netlify 函数
exports.handler = async function(event, context) {
  // 只接受 POST 请求
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: '只允许 POST 请求' }) 
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { code } = body;
    const websiteCode = process.env.WEBSITE_CODE;
    
    // 如果网站访问密码未设置或为空，则跳过验证，直接返回有效
    if (!websiteCode || websiteCode.trim() === '') {
      console.log('网站访问密码未设置或为空，跳过验证');
      return { 
        statusCode: 200, 
        body: JSON.stringify({ valid: true }) 
      };
    }
    
    // 验证访问码
    if (code === websiteCode) {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ valid: true }) 
      };
    }
    
    // 密码错误
    return { 
      statusCode: 200, 
      body: JSON.stringify({ valid: false }) 
    };
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: '服务器错误' }) 
    };
  }
}; 