// 健康检查 Netlify 函数
exports.handler = async function(event, context) {
  // 只接受 GET 请求
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: '只允许 GET 请求' }) 
    };
  }

  // 检查API密钥是否配置
  const apiKeyConfigured = !!process.env.API_KEY;
  const apiUrlConfigured = !!process.env.API_URL;

  // 返回健康状态
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      apiKeyConfigured,
      apiUrlConfigured,
      platform: 'netlify'
    })
  };
}; 