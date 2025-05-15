// 验证访问密码的 API 路由
export default function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只允许 POST 请求' });
  }

  const { code } = req.body;
  const websiteCode = process.env.WEBSITE_CODE; // 从环境变量获取密码
  
  // 如果网站访问密码未设置或为空，则跳过验证，直接返回有效
  if (!websiteCode || websiteCode.trim() === '') {
    console.log('网站访问密码未设置或为空，跳过验证');
    return res.status(200).json({ valid: true });
  }
  
  // 验证访问码
  if (code === websiteCode) {
    return res.status(200).json({ valid: true });
  }
  
  // 密码错误
  return res.status(200).json({ valid: false });
} 