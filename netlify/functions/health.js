// 简单的健康检查函数，用于确认 Netlify Functions 是否正常工作
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'ok',
      message: 'API is running',
      timestamp: new Date().toISOString()
    })
  };
}; 