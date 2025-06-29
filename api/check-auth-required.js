// 检查是否需要密码验证的 API 路由
export default function handler(req, res) {
  // 只接受 GET 请求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '只允许 GET 请求' });
  }

  const websiteCode = process.env.WEBSITE_CODE;
  
  // 如果环境变量未设置或为空，则不需要密码验证
  const authRequired = !!(websiteCode && websiteCode.trim() !== '');
  
  console.log('密码登录状态检查: 需要密码验证 =', authRequired);
  
  return res.status(200).json({
    authRequired: authRequired
  });
} 