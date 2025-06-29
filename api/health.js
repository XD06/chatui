// 健康检查API端点
export default function handler(req, res) {
  console.log('【API健康检查】收到请求:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query
  });

  // 只接受 GET 请求
  if (req.method !== 'GET') {
    console.log('【API健康检查】拒绝非GET请求');
    return res.status(405).json({ error: '只允许 GET 请求' });
  }

  try {
    // 检查API密钥是否配置
    const apiKeyConfigured = !!process.env.API_KEY;
    const apiUrlConfigured = !!process.env.API_URL;
    
    console.log('【API健康检查】环境变量检查:', {
      apiKeyConfigured,
      apiUrlConfigured,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    });

    // 返回更详细的健康状态信息
    const responseData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      apiKeyConfigured,
      apiUrlConfigured,
      platform: 'vercel',
      environment: process.env.NODE_ENV || 'unknown',
      vercelEnv: process.env.VERCEL_ENV || 'unknown',
      region: process.env.VERCEL_REGION || 'unknown',
      apiEndpoint: '/api/health',
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
    
    console.log('【API健康检查】返回响应:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('【API健康检查】发生错误:', error);
    res.status(500).json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 