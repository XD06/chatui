// API 服务工具函数
import { promptTemplates } from "../config/promptTemplates.js";
// 记录后端API是否可用
let isBackendAvailable = null; // null表示未检查，true表示可用，false表示不可用

/**
 * 获取当前环境的 API 基础 URL
 * @returns {string} API 基础 URL
 */
const getApiBaseUrl = () => {
  // 检测当前部署环境
  if (window.location.hostname.includes('netlify.app')) {
    return '/.netlify/functions';
  }
  // 默认为 Vercel 或本地开发环境
  return '/api';
};

/**
 * 检查后端API是否可用
 * @returns {Promise<boolean>} 后端API是否可用
 */
export const checkBackendAvailability = async () => {
  // 如果已经检查过，直接返回缓存的结果
  if (isBackendAvailable !== null) {
    console.log('【检查后端API】使用缓存结果:', isBackendAvailable ? '可用' : '不可用');
    return isBackendAvailable;
  }
  
  console.log('【检查后端API】开始检查后端API可用性');
  
  try {
    console.log('【检查后端API】发送请求到:', `${getApiBaseUrl()}/health`);
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      method: 'GET',
      timeout: 3000, // 3秒超时
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('【检查后端API】收到响应:', data);
      isBackendAvailable = data && data.status === 'ok' && data.apiKeyConfigured;
      console.log(`【检查后端API】状态: ${isBackendAvailable ? '可用' : '不可用'}, 原因:`, 
                  !data ? 'data为空' : 
                  data.status !== 'ok' ? 'status不为ok' : 
                  !data.apiKeyConfigured ? 'API密钥未配置' : '所有条件都满足');
      return isBackendAvailable;
    } else {
      console.log('【检查后端API】请求失败, 状态码:', response.status);
      isBackendAvailable = false;
      return false;
    }
  } catch (error) {
    console.log('【检查后端API】检查失败, 错误:', error);
    isBackendAvailable = false;
    return false;
  }
};

// 重置后端可用性状态（例如在网络状态改变时）
export const resetBackendAvailability = () => {
  console.log('手动重置后端API可用性状态为未检查');
  isBackendAvailable = null;
};

/**
 * 强制重新检查后端API可用性
 * 用于调试和测试
 * @returns {Promise<boolean>} 后端API是否可用
 */
export const forceCheckBackendAvailability = async () => {
  console.log('强制重新检查后端API可用性');
  isBackendAvailable = null; // 清除缓存
  return await checkBackendAvailability();
};

/**
 * 验证访问密码
 * @param {string} code 用户输入的密码
 * @returns {Promise<{valid: boolean}>} 验证结果
 */
export const verifyAccessCode = async (code) => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/verify-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    
    return await response.json();
  } catch (error) {
    console.error('验证密码错误:', error);
    return { valid: false, error: error.message };
  }
};

/**
 * 检查是否需要密码验证
 * @returns {Promise<{authRequired: boolean}>} 是否需要密码
 */
export const checkAuthRequired = async () => {
  try {
    // 首先检查后端是否可用
    const backendAvailable = await checkBackendAvailability();
    
    if (!backendAvailable) {
      console.log('后端API不可用，假设不需要密码验证');
      return { authRequired: false };
    }
    
    const response = await fetch(`${getApiBaseUrl()}/check-auth-required`);
    if (!response.ok) {
      console.error('检查密码验证需求失败:', response.status);
      // 默认返回需要验证，确保安全
      return { authRequired: true };
    }
    
    return await response.json();
  } catch (error) {
    console.error('检查是否需要密码验证时出错:', error);
    // 出错时默认返回需要验证，确保安全
    return { authRequired: true };
  }
};

/**
 * 发送聊天消息到 AI API（非流式）
 * @param {Array} messages 消息数组
 * @param {string} model 模型名称
 * @param {number} temperature 温度参数
 * @param {number} maxTokens 最大 token 数量
 * @returns {Promise<Object>} API 响应
 */
export const sendChatMessage = async (messages, model, temperature, maxTokens) => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model,
        temperature,
        max_tokens: maxTokens,
        stream: false
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('发送消息错误:', error);
    throw error;
  }
};

/**
 * 发送流式聊天消息
 * @param {Array} messages 消息数组
 * @param {string} model 模型名称
 * @param {number} temperature 温度参数
 * @param {number} maxTokens 最大 token 数量
 * @param {Function} onChunk 处理每个数据块的回调函数
 * @returns {Promise<ReadableStream>} 流式响应
 */
export const sendStreamChatMessage = async (messages, model, temperature, maxTokens, onChunk) => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model,
        temperature,
        max_tokens: maxTokens,
        stream: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP错误状态: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    
    // 读取流数据并处理
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      if (onChunk) onChunk(chunk);
    }
    
    return response;
  } catch (error) {
    console.error('流式消息错误:', error);
    throw error;
  }
};

/**
 * 重新生成消息（流式）
 * @param {Array} messages 消息数组
 * @param {string} model 模型名称
 * @param {number} temperature 温度参数
 * @param {number} maxTokens 最大 token 数量
 * @param {Function} onChunk 处理每个数据块的回调函数
 * @returns {Promise<ReadableStream>} 流式响应
 */
export const regenerateMessage = async (messages, model, temperature, maxTokens, onChunk) => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/regenerate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model,
        temperature,
        max_tokens: maxTokens,
        stream: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP错误状态: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    
    // 读取流数据并处理
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      if (onChunk) onChunk(chunk);
    }
    
    return response;
  } catch (error) {
    console.error('重新生成消息错误:', error);
    throw error;
  }
};

/**
 * 获取可用模型列表
 * @param {string} apiKey API密钥(可选,如果使用后端则不需要)
 * @param {string} apiEndpoint API端点(可选,如果使用后端则不需要)
 * @param {boolean} userCustomizedAPI 是否使用用户自定义的API设置
 * @returns {Promise<Array>} 模型列表
 */
function normalizeModelsUrl(url) {
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
export const getModelsList = async (apiKey, apiEndpoint, userCustomizedAPI = false) => {
  try {
    console.log('===== 模型解析API设置开始 =====');
    console.log('传入的API Key:', apiKey ? '已设置 (长度: ' + apiKey.length + ')' : '未设置');
    console.log('传入的API端点:', apiEndpoint || '未设置');
    console.log('是否使用自定义API:', userCustomizedAPI);
    
    // 判断是否优先使用前端API设置
    const useCustomApi = userCustomizedAPI && apiKey && apiEndpoint;
    
    // 检查后端API是否可用
    const backendAvailable = await checkBackendAvailability();
    console.log('后端API是否可用:', backendAvailable);
    
    // 决策逻辑: 优先使用自定义API，其次才考虑后端API
    const useDirectApi = useCustomApi || !backendAvailable;
    console.log('决定使用:', useDirectApi ? '前端直接API' : '后端API');
    console.log('===== 模型解析API设置结束 =====');
    
    if (!useDirectApi && backendAvailable) {
      // 使用后端API
      console.log('使用后端API获取模型列表');
      useModlesurl = normalizeModelsUrl(getApiBaseUrl());
      console.log('请求模型列表URL:', userModlesurl);
      const response = await fetch(useModlesurl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`后端API错误: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } else {
      // 使用前端直接请求API
      console.log('使用前端API获取模型列表');
      if (!apiKey) {
        throw new Error('API密钥未提供');
      }
      
      if (!apiEndpoint) {
        throw new Error('API端点未提供');
      }
      
      // 提取API基础URL
      let baseUrl = apiEndpoint;

      
      // 添加/v1/models路径
      const modelsUrl = normalizeModelsUrl(baseUrl);
      
      console.log('请求模型列表URL:', modelsUrl);
      
      const response = await fetch(modelsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `获取模型列表失败: HTTP错误状态 ${response.status}`);
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('获取模型列表错误:', error);
    throw error;
  }
};

/**
 * 提示词优化
 * @param {string} promptText 需要优化的提示词
 * @param {string} apiKey API密钥(可选,如果使用后端则不需要)
 * @param {string} apiEndpoint API端点(可选,如果使用后端则不需要)
 * @param {Object} apiOptions 模型参数
 * @param {boolean} userCustomizedAPI 是否使用用户自定义的API设置
 * @returns {Promise<Object>} 优化结果
 */
export const optimizePrompt = async (promptText, apiKey, apiEndpoint, apiOptions, userCustomizedAPI = false) => {
  try {
    if (!promptText) {
      throw new Error('缺少必要的提示词内容');
    }
    
    console.log('===== 提示词优化API设置开始 =====');
    console.log('传入的API Key:', apiKey ? '已设置 (长度: ' + apiKey.length + ')' : '未设置');
    console.log('传入的API端点:', apiEndpoint || '未设置');
    console.log('是否使用自定义API:', userCustomizedAPI);
    
    // 判断是否优先使用前端API设置
    const useCustomApi = userCustomizedAPI && apiKey && apiEndpoint;
    
    // 检查后端API是否可用
    const backendAvailable = await checkBackendAvailability();
    console.log('后端API是否可用:', backendAvailable);
    
    // 决策逻辑: 优先使用自定义API，其次才考虑后端API
    const useDirectApi = useCustomApi || !backendAvailable;
    console.log('决定使用:', useDirectApi ? '前端直接API' : '后端API');
    console.log('===== 提示词优化API设置结束 =====');
    
    if (!useDirectApi && backendAvailable) {
      // 使用后端API
      console.log('使用后端API优化提示词');
      const response = await fetch(`${getApiBaseUrl()}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptText,
          model: apiOptions.model,
          temperature: apiOptions.temperature,
          max_tokens: apiOptions.max_tokens
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `优化失败: HTTP错误状态 ${response.status}`);
      }
      
      return await response.json();
    } else {
      // 使用前端直接请求API
      console.log('使用前端API优化提示词');
      if (!apiKey) {
        throw new Error('API密钥未提供');
      }
      
      if (!apiEndpoint) {
        throw new Error('API端点未提供');
      }
      
      const systemPrompt = promptTemplates.optimizer;
      
      console.log('直接API调用:', apiEndpoint);
      console.log('优化提示词:', {messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: promptText }
      ],model: apiOptions.model, temperature: apiOptions.temperature, max_tokens: apiOptions.max_tokens});
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: apiOptions.model || 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: promptText }
          ],
          temperature: apiOptions.temperature || 0.5,
          max_tokens: apiOptions.max_tokens || 2000
        })
      });

      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `优化失败: HTTP错误状态 ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('API返回无效响应');
      }
      
      return {
        content: data.choices[0].message.content,
        success: true
      };
    }
  } catch (error) {
    console.error('提示词优化错误:', error);
    throw error;
  }
};

/**
 * 检查API健康状态
 * @returns {Promise<Object>} 健康状态信息
 */
export const checkApiHealth = async () => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/health`, {
      method: 'GET'
    });
    
    return await response.json();
  } catch (error) {
    console.error('健康检查错误:', error);
    return { status: 'error', error: error.message };
  }
}; 