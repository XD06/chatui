// /**
//  * 规格化API模型URL
//  * @param {string} url 输入的API地址
//  * @returns {string} 规范化后的 /v1/models 地址
//  */
// export function normalizeModelsUrl(url) {
//   if (!url || typeof url !== 'string') return '';
//   let u = url.trim();
//   // 去除结尾的斜杠
//   u = u.replace(/\/+$|[?#].*$/g, '');
//   // 匹配 /v+数字
//   const match = u.match(/(\/v\d+)(?=\/|$)/i);
//   if (match) {
//     // 去除原有的 /v+数字 及其后内容
//     u = u.replace(/(\/v\d+)(?:\/.*)?$/i, '');
//     // 拼接匹配到的 vx + /models
//     return u + match[1] + '/models';
//   } else {
//     // 没有 v+数字，直接加 /v1/models
//     return u.replace(/\/models.*/i, '') + '/v1/models';
//   }
// }

// // 测试 normalizeModelsUrl 的代码
// function testNormalizeModelsUrl() {
//   const testCases = [
//     "https://cloud.infini-ai.com/v1/models",
//     "https://cloud.infini-ai.com/maas/v1/models",
//     "https://cloud.infini-ai.com/maas/",
//     "https://cloud.infini-ai.com/v1/chat/completions",
//     "https://cloud.infini-ai.com/maas/v1/models",
//     "https://cloud.infini-ai.com/maas/xxx/",
//     "https://cloud.infini-ai.com/maas/v1/chat/completions",
//     "https://cloud.infini-ai.com/maas/v1/models",
//     "https://cloud.infini-ai.com/maas/v1/models/",
//     "https://cloud.infini-ai.com/maas/v1/models/////",
//     "https://cloud.infini-ai.com/maas/v1/models?param=1",
//     "https://cloud.infini-ai.com/maas/v1/models#anchor",
//     "https://cloud.infini-ai.com/maas/v1/models/extra/path",
//     "https://cloud.infini-ai.com/maas/v2/models",
//     "https://cloud.infini-ai.com/maas/v2/models/extra/path",
//     "https://cloud.infini-ai.com/maas/v2/models?param=1",
//     "https://cloud.infini-ai.com/maas/v2/chat/Completions"
//   ];
//   testCases.forEach(url => {
//     console.log(`输入: ${url}\n输出: ${normalizeModelsUrl(url)}\n`);
//   });
// }

// // 仅在直接运行该文件时执行测试if (require.main === module) {
//   testNormalizeModelsUrl();
const url = 'https://cloud.infini-ai.com/maas/v1/chat/completions';
const options = {
  method: 'POST',
  headers: {'Content-Type': 'application/json', Authorization: 'Bearer sk-r3bdfnr7ugzu5jwh'},
  body: '{"model":"deepseek-r1","messages":[{"role":"user","content":"你是谁"}]}'
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}