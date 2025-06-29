// 检查是否需要密码验证的 Netlify 函数
exports.handler = async function(event, context) {
  // 只接受 GET 请求
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: '只允许 GET 请求' }) 
    };
  }

  const websiteCode = process.env.WEBSITE_CODE;
  
  // 如果环境变量未设置或为空，则不需要密码验证
  const authRequired = !!(websiteCode && websiteCode.trim() !== '');
  
  console.log('密码登录状态检查: 需要密码验证 =', authRequired);
  
  return {
    statusCode: 200,
    body: JSON.stringify({
      authRequired: authRequired
    })
  };
}; 