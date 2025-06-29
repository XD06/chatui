// Test script for URL normalization functions
import { normalizeModelsUrl, normalizeChatCompletionsUrl } from './utils/parsemodels.js';

// Test cases
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
  "https://cloud.infini-ai.com/maas/v2/chat/Completions",
  "https://api.chatanywhere.tech/v1/chat/comletions", // Typo case
  "https://api.chatanywhere.tech/v1/chat/completions" // Correct case
];

// Run tests
testCases.forEach(url => {
  console.log(`输入: ${url}`);
  console.log(`模型URL输出: ${normalizeModelsUrl(url)}`);
  console.log(`聊天完成URL输出: ${normalizeChatCompletionsUrl(url)}\n`);
});

// Special test for the typo URL in the error message
console.log("特别测试 - 修正URL中的拼写错误:");
const typoUrl = "https://api.chatanywhere.tech/v1/chat/comletions"; // Typo in "completions"
console.log(`原始URL (有错误): ${typoUrl}`);
console.log(`修正后的URL: ${normalizeChatCompletionsUrl(typoUrl)}\n`); 