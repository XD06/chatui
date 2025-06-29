// 引入 Pinia 的 defineStore 方法，用于定义一个新的 store
import { defineStore } from 'pinia'

// 解析环境变量中的模型信息
function parseEnvModels(modelsStr) {
    if (!modelsStr) return [];
    
    return modelsStr.split(',').map(modelInfo => {
        const [value, label] = modelInfo.split(':');
        return {
            label: label || value, // 如果没有指定标签，使用值作为标签
            value: value.trim()
        };
    });
}

// 从环境变量获取默认模型
const defaultModel = import.meta.env.VITE_DEFAULT_MODEL;

// 从环境变量获取默认最大tokens
const defaultMaxTokens = parseInt(import.meta.env.VITE_DEFAULT_MAX_TOKENS) || 1000;

// 从环境变量获取网站访问密码
const websiteCode = import.meta.env.VITE_WEBSITE_CODE || '';

// 以下变量不再从环境变量中读取，而是通过后端 API 安全处理
// 不再需要: const ENV_API_KEY = import.meta.env.VITE_API_KEY || '';
// 不再需要: const ENV_API_URL = import.meta.env.VITE_API_URL || 'https://api.openai.com/v1/chat/completions';

// 定义一个名为 'settings' 的 store
export const useSettingsStore = defineStore('settings', {
    // 定义 store 的状态
    state: () => ({
        // 是否启用深色模式，默认为 false
        isDarkMode: false,
        // 温度参数，控制生成文本的随机性，默认值为 0.7
        temperature: 0.7,
        // 最大 token 数量，从环境变量读取默认值
        maxTokens: defaultMaxTokens,
        // 使用的模型名称 - 从环境变量读取默认值
        model: defaultModel,
        // 用户在界面上输入的API Key，初始为空
        apiKey: '',
        // 用户在界面上输入的API端点，初始为默认值
        apiEndpoint: '',
        // 标记用户是否自定义了API设置
        userCustomizedAPI: false,
        // 是否启用流式响应，默认为 true
        streamResponse: true,
        // Top P 参数
        topP: 0.7,
        // Top K 参数
        topK: 50,
        // 系统提示词已移除，现在通过currentRole处理
        // 当前选择的角色
        currentRole: null,
        // 用户自定义角色列表
        customRoles: [],
        // 网站访问密码验证状态 - 默认为未验证
        isAuthenticated: false,
        // 可用模型选项列表 - 从环境变量读取默认值或使用预设值
        modelOptions: import.meta.env.VITE_MODELS 
            ? parseEnvModels(import.meta.env.VITE_MODELS)
            : [
                { label: 'GLM-Z1-9B', value: 'THUDM/GLM-Z1-9B-0414' },
                { label: 'Qwen3-8B', value: 'Qwen/Qwen3-8B' },
                { label: 'Qwen2.5-Coder-7B', value: 'Qwen/Qwen2.5-Coder-7B-Instruct' },
                { label: 'THUDM/GLM-4-9B-0414', value: 'THUDM/GLM-4-9B-0414' },
                { label: 'DeepSeek-R1-7B', value: 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B' },
            ],
    }),

    // 计算属性 - 获取实际使用的值
    getters: {
        // 获取实际使用的API Key - 现在通过后端 API 处理，不再直接使用
        actualApiKey: (state) => {
            // 如果用户选择了自定义API，返回用户设置的值
            if (state.userCustomizedAPI) {
                return state.apiKey;
            }
            // 否则返回空字符串，实际的 API Key 由后端处理
            return '';
        },
        
        // 获取实际使用的API端点 - 现在通过后端 API 处理，不再直接使用
        actualApiEndpoint: (state) => {
            // 如果用户选择了自定义API，返回用户设置的值
            if (state.userCustomizedAPI) {
                // 确保返回有效的API端点
                return state.apiEndpoint || '';
            }
            // 否则返回空字符串，表示使用后端默认端点
            return '';
        },
        
        // 获取显示在UI上的API Key值
        displayApiKey: (state) => {
            // 如果用户选择了自定义API，返回用户设置的值
            if (state.userCustomizedAPI) {
                return state.apiKey;
            }
            // 否则返回空字符串
            return '';
        },
        
        // 获取显示在UI上的API端点值
        displayApiEndpoint: (state) => {
            // 如果用户选择了自定义API，返回用户设置的值
            if (state.userCustomizedAPI) {
                return state.apiEndpoint;
            }
            // 否则返回空字符串
            return '';
        },
        
        // 判断是否有可用的API Key
        hasApiKey: (state) => {
            return (state.userCustomizedAPI && !!state.apiKey) || !state.userCustomizedAPI;
        },
        
        // 获取网站访问密码
        websiteCode: () => websiteCode
    },

    // 定义 store 的动作
    actions: {
        // 切换深色模式
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode
            // 根据当前的深色模式状态设置 HTML 元素的 data-theme 属性
            document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light')
        },

        // 更新设置
        updateSettings(settings) {
            // 使用 Object.assign 方法将传入的设置对象合并到当前 store 的状态中
            Object.assign(this.$state, settings)
        },
        
        // 验证网站访问密码 - 现在通过后端 API 处理，这个方法只作为兼容性保留
        verifyWebsiteCode(code) {
            // 此方法不再直接验证密码，而是通过后端 API 处理
            // 保留此方法仅为兼容性，实际验证逻辑已移至 PasswordScreen 组件
            return false;
        },
        
        // 添加自定义角色
        addCustomRole(role) {
            // 确保角色有所有必要的字段
            const newRole = {
                name: role.name || '自定义角色',
                description: role.description || '自定义提示词',
                prompt: role.prompt,
                color: role.color || '#34A853',
                isUserCreated: true,
                id: Date.now().toString() // 添加唯一ID
            };
            
            this.customRoles.push(newRole);
            return newRole;
        },
        
        // 更新自定义角色
        updateCustomRole(roleId, updatedRole) {
            const index = this.customRoles.findIndex(role => role.id === roleId);
            if (index !== -1) {
                this.customRoles[index] = {
                    ...this.customRoles[index],
                    ...updatedRole
                };
                return true;
            }
            return false;
        },
        
        // 删除自定义角色
        deleteCustomRole(roleId) {
            const index = this.customRoles.findIndex(role => role.id === roleId);
            if (index !== -1) {
                this.customRoles.splice(index, 1);
                // 如果当前选中的角色被删除，清除当前角色
                if (this.currentRole && this.currentRole.id === roleId) {
                    this.currentRole = null;
                }
                return true;
            }
            return false;
        },
        
        // 设置自定义 API 凭证
        setCustomAPI(apiKey, apiEndpoint) {
            this.apiKey = apiKey || '';
            this.apiEndpoint = apiEndpoint || '';
            this.userCustomizedAPI = true;
            
            // 添加日志，确认API设置已更新
            console.log('已更新自定义API设置:', {
                apiKeySet: !!this.apiKey,
                apiEndpointSet: !!this.apiEndpoint,
                userCustomizedAPI: this.userCustomizedAPI
            });
        },
        
        // 清除自定义API设置，恢复使用环境变量
        clearCustomAPI() {
            this.apiKey = '';
            this.apiEndpoint = '';
            this.userCustomizedAPI = false;
            
            // 添加日志，确认API设置已清除
            console.log('已清除自定义API设置');
        },
        
        // 添加新模型到选项列表
        addModels(newModels, clearExisting = false) {
            if (clearExisting && newModels.length > 0) {
                // 完全替换现有模型列表
                // 使用新数组而不是修改原数组，以确保 Vue 正确检测到变更
                const newModelOptions = newModels.map(model => ({
                    label: model,
                    value: model
                }));
                this.modelOptions = newModelOptions;
                
                // 如果当前选择的模型不在新列表中，选择第一个模型
                const modelExists = newModels.includes(this.model);
                if (!modelExists && newModels.length > 0) {
                    this.model = newModels[0];
                }
                
                return newModels.length;
            } else {
                // 过滤掉已存在的模型
                const existingValues = this.modelOptions.map(option => option.value);
                const uniqueNewModels = newModels
                    .filter(model => !existingValues.includes(model))
                    .map(model => ({
                        label: model,
                        value: model
                    }));
                    
                // 添加新模型到列表中
                if (uniqueNewModels.length > 0) {
                    // 使用新数组而不是修改原数组
                    this.modelOptions = [...this.modelOptions, ...uniqueNewModels];
                    return uniqueNewModels.length;
                }
                
                return 0;
            }
        }
    },

    // 配置持久化选项
    persist: {
        // 启用持久化功能
        enabled: true,
        // 持久化策略数组
        strategies: [
            {
                // 存储键名
                key: 'ai-chat-settings',
                // 存储方式，这里使用的是 localStorage
                storage: localStorage,
                // 排除敏感信息，只持久化非敏感设置
                paths: ['isDarkMode', 'temperature', 'maxTokens', 'model', 'streamResponse', 'topP', 'topK', 'currentRole', 'customRoles', 'modelOptions', 'userCustomizedAPI', 'apiKey', 'apiEndpoint', 'isAuthenticated']
            },
        ],
    },
})
console.log( '当前模型列表:', );
/**
 * @async
 * @function fetchModelList
 * @description Fetches a list of available AI models from an OpenAI-compatible API endpoint.
 * It intelligently handles API endpoint variations, supports GET/POST methods, and includes error handling.
 *
 * @param {string} endpoint - The API endpoint URL. Can be a full URL or a base domain.
 * @param {string} apiKey - The API key for authorization.
 * @param {number} [timeout=5000] - Optional timeout for the request in milliseconds.
 * @returns {Promise<string[]>} A promise that resolves to an array of model names.
 * @throws {Error} Throws an error if the request fails or the response is invalid.
 */
export async function fetchModelList(endpoint, apiKey, timeout = 5000) {
    if (typeof fetch === 'undefined' && typeof require !== 'undefined') {
        global.fetch = require('node-fetch');
    }

    let url = endpoint;

    // 1. 智能补全API地址: 自动添加缺失的协议头
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // 移除末尾可能存在的斜杠，以进行统一处理
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    // 核心逻辑：确保最终路径指向 /v1/models 
    // 此函数旨在获取模型列表，因此目标路径应为 OpenAI 兼容的 /models 端点。
    const v1PathSegment = '/v1';
    const modelsPathSegment = '/models';

    const v1Index = url.indexOf(v1PathSegment);

    if (v1Index !== -1) {
        // 如果URL中包含 "/v1"
        // 截取到 "/v1" 部分，然后确保其后是 "/models"
        // 例如: "https://example.com/api/v1/custom" -> "https://example.com/api/v1/models"
        // 例如: "https://example.com/v1" -> "https://example.com/v1/models"
        url = url.substring(0, v1Index + v1PathSegment.length) + modelsPathSegment;
    } else {
        // 如果URL中不包含 "/v1"
        // 直接在末尾追加 "/v1/models"
        // 例如: "https://example.com" -> "https://example.com/v1/models"
        // 例如: "https://example.com/custombase" -> "https://example.com/custombase/v1/models"
        url += v1PathSegment + modelsPathSegment;
    }

    const headers = {
        'Authorization': `Bearer ${apiKey}`
    };

    const tryRequest = async () => {
        const controller = new AbortController();
        const signal = controller.signal;
        let timer;

        try {
            timer = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(url, {
                method: 'GET',
                headers: headers,
                signal: signal
            });

            clearTimeout(timer);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // Ignore if response is not JSON
                }
                const statusText = errorData?.error?.message || response.statusText || 'Unknown error';
                throw new Error(`HTTP error ${response.status}: ${statusText}`);
            }

            const data = await response.json();

            if (!data || !data.data || !Array.isArray(data.data)) {
                throw new Error('Invalid response format: Expected an array of models in data.data');
            }

            return data.data.map(model => model.id).sort();

        } catch (error) {
            clearTimeout(timer);
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeout}ms`);
            }
            throw error; // Re-throw other errors
        }
    };

    try {
        // 只使用GET请求获取模型列表
        return await tryRequest();
    } catch (error) {
        console.error(`GET request to ${url} failed: ${error.message}`);
        throw new Error(`Failed to fetch model list from ${url}: ${error.message}`);
    }
}

// 删除示例调用