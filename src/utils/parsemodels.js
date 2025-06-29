/**
 * 规格化API模型URL
 * @param {string} url 输入的API地址
 * @returns {string} 规范化后的 /v1/models 地址
 */
export function normalizeModelsUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let u = url.trim();
  // 去除结尾的斜杠
  u = u.replace(/\/+$|[?#].*$/g, '');
  // 匹配 /v+数字
  const match = u.match(/(\/v\d+)(?=\/|$)/i);
  if (match) {
    // 去除原有的 /v+数字 及其后内容
    u = u.replace(/(\/v\d+)(?:\/.*)?$/i, '');
    // 拼接匹配到的 vx + /models
    return u + match[1] + '/models';
  } else {
    // 没有 v+数字，直接加 /v1/models
    return u.replace(/\/models.*/i, '') + '/v1/models';
  }
}

// 规格化聊天完成API URL
export function normalizeChatCompletionsUrl(url) {
  if (!url || typeof url !== 'string') return '';
  let u = url.trim();
  // 去除结尾的斜杠
  u = u.replace(/\/+$|[?#].*$/g, '');
  // 匹配 /v+数字
  const match = u.match(/(\/v\d+)(?=\/|$)/i);
  if (match) {
    // 去除原有的 /v+数字 及其后内容
    u = u.replace(/(\/v\d+)(?:\/.*)?$/i, '');
    // 拼接匹配到的 vx + /chat/completions
    return u + match[1] + '/chat/completions';
  } else {
    // 没有 v+数字，直接加 /v1/chat/completions
    return u.replace(/\/chat\/completions.*/i, '') + '/v1/chat/completions';
  }
}

// 测试功能
export function testNormalizeModelsUrl() {
  const testCases = [
    "https://cloud.infini-ai.com/v1/models",
    "https://cloud.infini-ai.com/maas/v1/models",
    "https://cloud.infini-ai.com/maas/",
    "https://cloud.infini-ai.com/v1/chat/completions",
    "https://cloud.infini-ai.com/maas/v1/models",
    "https://cloud.infini-ai.com/maas/xxx/",
    "https://cloud.infini-ai.com/maas/v1/chat/completions",
    "https://cloud.infini-ai.com/maas/v1/models",
    "https://cloud.infini-ai.com/maas/v1/models/",
    "https://cloud.infini-ai.com/maas/v1/models/////",
    "https://cloud.infini-ai.com/maas/v1/models?param=1",
    "https://cloud.infini-ai.com/maas/v1/models#anchor",
    "https://cloud.infini-ai.com/maas/v1/models/extra/path",
    "https://cloud.infini-ai.com/maas/v2/models",
    "https://cloud.infini-ai.com/maas/v2/models/extra/path",
    "https://cloud.infini-ai.com/maas/v2/models?param=1",
    "https://cloud.infini-ai.com/maas/v2/chat/Completions"
  ];
  testCases.forEach(url => {
    console.log(`输入: ${url}\n模型URL输出: ${normalizeModelsUrl(url)}`);
    console.log(`聊天完成URL输出: ${normalizeChatCompletionsUrl(url)}\n`);
  });
}