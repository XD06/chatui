// 健康检查API端点
export default function handler(req, res) {
  // 只接受 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只允许 GET 请求' });
  }

  // 检查API密钥是否配置
  const apiKeyConfigured = !!process.env.API_KEY;
  const apiUrlConfigured = !!process.env.API_URL;

  // 返回健康状态
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    apiKeyConfigured,
    apiUrlConfigured,
    platform: 'vercel'
  });
} 