import { promptTemplates } from '../config/promptTemplates'
import { optimizePrompt as apiOptimizePrompt, checkBackendAvailability } from './apiService'
// 导入Markdown处理函数
import { initializeMarkdown, applyMarkdownExtensions } from './markdownExtensions.js'
// Import the URL normalization function
import { normalizeChatCompletionsUrl } from './parsemodels.js'

export const messageHandler = {
    formatMessage(role, content) {
        const hasImage = content.includes('![') && content.includes('](data:image/')
        
        return {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            role,
            content,
            thinkingContent: '',
            hasImage,
            loading: false,
            isRegenerationPlaceholder: false
        };
    },

    /**
     * 从消息数组构建请求格式
     * @param {Array} messages - 消息数组
     * @param {Object} systemMessage - 可选的系统消息
     * @returns {Array} - 格式化后的消息数组
     */
    buildRequestMessages(messages, systemMessage = null) {
        const requestMessages = [];
        
        // 添加可选的系统消息
        if (systemMessage) {
            requestMessages.push({
                role: 'system',
                content: systemMessage
            });
        }
        
        // 添加用户和助手消息
        for (const message of messages) {
            requestMessages.push({
                role: message.role,
                content: message.content
            });
        }
        
        return requestMessages;
    },

    /**
     * 检测是否为流式数据
     * @param {string} chunk - 数据块
     * @returns {boolean} - 是否为流式数据
     */
    isStreamData(chunk) {
        return chunk.startsWith('data:') && (chunk.includes('"delta"') || chunk.includes('"choices"'));
    },

    /**
     * 解析流式数据块
     * @param {string} chunk - 数据块
     * @returns {Object} - 解析后的数据对象
     */
    parseStreamChunk(chunk) {
        // 处理多行数据
        const lines = chunk.split('\n');
        let content = '';
        let done = false;
        
        for (const line of lines) {
            if (line.startsWith('data:')) {
                const dataContent = line.substring(5).trim();
                
                // 检查是否为结束标记
                if (dataContent === '[DONE]') {
                    done = true;
                    continue;
                }
                
                try {
                    // 解析JSON数据
                    const data = JSON.parse(dataContent);
                    
                    // 提取内容增量
                    if (data.choices && data.choices.length > 0) {
                        const choice = data.choices[0];
                        
                        // 处理流式响应的差异格式
                        if (choice.delta && choice.delta.content) {
                            content += choice.delta.content;
                        } else if (choice.text) {
                            content += choice.text;
                        }
                    }
                } catch (error) {
                    console.error('解析流式数据错误:', error, '原始数据:', dataContent);
                }
            }
        }
        
        return { content, done };
    },

    /**
     * 计算消息的token数
     * @param {string} text - 文本内容
     * @returns {number} - 估算的token数
     */
    countTokens(text) {
        // 更准确的token计算方法
        if (!text) return 0;
        
        // 基础规则：中文每个字符约等于1个token，英文和数字每4个字符约等于1个token
        let tokenCount = 0;
        let codeBlockExtra = 0;
        
        // 检查是否有代码块，代码块通常需要更多token
        const codeBlocks = text.match(/```[\s\S]*?```/g) || [];
        let remainingText = text;
        
        // 先处理代码块
        if (codeBlocks.length > 0) {
            for (const block of codeBlocks) {
                // 从文本中移除代码块
                remainingText = remainingText.replace(block, '');
                
                // 代码通常每2.5个字符约1个token
                codeBlockExtra += Math.ceil(block.length / 2.5);
            }
        }
        
        // 分离中文字符和非中文字符
        const chineseChars = remainingText.match(/[\u4e00-\u9fa5]/g) || [];
        const nonChineseText = remainingText.replace(/[\u4e00-\u9fa5]/g, '');
        
        // 中文字符：每个字符约1个token
        tokenCount += chineseChars.length;
        
        // 非中文字符：每4个字符约1个token
        tokenCount += Math.ceil(nonChineseText.length / 4);
        
        // 特殊字符和表情符号可能消耗更多token
        const specialChars = remainingText.match(/[^\w\s\u4e00-\u9fa5]/g) || [];
        tokenCount += specialChars.length * 0.25; // 平均每4个特殊字符额外增加1个token
        
        // 添加代码块的额外token
        tokenCount += codeBlockExtra;
        
        // 添加基础token（每条消息的角色标识等）
        tokenCount += 4;
        
        return Math.ceil(tokenCount);
    },

    /**
     * 优化用户的提示词
     * @param {string} promptText - 需要优化的提示词文本
     * @param {string} apiKey - API密钥 (可选,如果使用后端则不需要)
     * @param {string} apiEndpoint - API端点URL (可选,如果使用后端则不需要)
     * @param {Object} apiOptions - API选项（模型、温度等）
     * @param {boolean} userCustomizedAPI - 是否使用用户自定义的API设置
     * @returns {Promise<Object>} - 优化结果
     */
    async optimizePrompt(promptText, apiKey, apiEndpoint, apiOptions, userCustomizedAPI = false) {
        try {
            // 记录调用参数
            console.log('messageHandler.optimizePrompt 被调用:');
            console.log('- 自定义API:', userCustomizedAPI);
            console.log('- API密钥:', apiKey ? '已设置' : '未设置');
            console.log('- API端点:', apiEndpoint);
            
            // 调用apiService的优化函数，传递userCustomizedAPI参数
            return await apiOptimizePrompt(promptText, apiKey, apiEndpoint, apiOptions, userCustomizedAPI);
        } catch (error) {
            console.error('优化提示词错误:', error);
            throw error;
        }
    },

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        let lastFunc;
        let lastRan;
        return function(...args) {
            const context = this;
            if (!lastRan) {
                func.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(function() {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        }
    },

    /**
     * 使用完整的Markdown扩展处理内容
     * @param {string} content - 原始内容
     * @returns {string} - 处理后的内容
     */
    processContentWithFullMarkdown(content) {
        if (!content) return content;
        
        try {
            // 应用所有Markdown扩展
            return applyMarkdownExtensions(content);
        } catch (error) {
            console.error('Markdown处理失败:', error);
            // 出错时返回原始内容
            return content;
        }
    },

    /**
     * 处理流式响应
     * @param {Response} response - 响应对象
     * @param {Object} options - 处理选项
        * @param {Function} options.updateMessage - 更新消息内容的回调
        * @param {Function} options.updateTokenCount - 更新token使用量的回调
     * @param {Function} options.onError - 错误处理回调
     * @param {Function} options.onComplete - 完成处理回调
     * @param {boolean} options.isRegeneration - 是否为重新生成操作
     */
    async processStreamResponse(response, { updateMessage, updateTokenCount, onError, onComplete, isRegeneration = false }) {
        // 固定的小时间间隔，确保平滑输出
        const OUTPUT_INTERVAL = 10; // 固定10ms的输出间隔
        const MAX_RETRIES = 5; // 增加最大重试次数
        const TIMEOUT_DURATION = 8000; // 增加超时阈值，给不稳定网络更多时间
        const INITIAL_RETRY_DELAY = 500; // 初始重试延迟（毫秒）
        const RECONNECT_DELAY = 2000; // 重连延迟
        const HEALTH_CHECK_INTERVAL = 1000; // 健康检查间隔
        
        // 添加调试变量
        let totalCharsReceived = 0;
        let totalCharsOutput = 0;
        let lastLogTime = Date.now();
        let lastNetworkActivity = Date.now(); // 跟踪最后一次网络活动时间
        let isEndingStream = false;
        let healthCheckIntervalId = null;

        // 添加代码块和图表检测变量
        const CODE_BLOCK_START = "```";
        const CODE_BLOCK_END = "```";
        const MERMAID_START = "```mermaid";
        let inCodeBlock = false;
        let codeBlockBuffer = "";
        let currentCodeLang = "";
        let codeBlocksReceived = 0;
        let mermaidBlocksReceived = 0;

        let retryCount = 0;
        let full_content = '';
        let full_reasonResponse = '';
        let full_reasoning_content = '';
        let isStreaming = true;
        let lastSuccessfulUpdate = Date.now();
        let isStopped = false;
        let lastTokenCount = 0;
        
        // 字符处理速度控制
        let pendingChars = ''; // 待处理的字符缓冲区
        let isProcessingOutput = false; // 是否正在处理输出
        let outputIntervalId = null; // 输出定时器ID
        let queuedContentUpdate = false; // 队列中是否有内容更新
        
        // 检测特殊内容（代码块、图表等）
        const checkForSpecialContent = (content) => {
            // 检测代码块并更新状态
            if (!inCodeBlock && content.includes(CODE_BLOCK_START)) {
                inCodeBlock = true;
                console.log("检测到代码块开始");
                codeBlockBuffer = CODE_BLOCK_START;
            } else if (inCodeBlock) {
                codeBlockBuffer += content;
                
                if (codeBlockBuffer.includes(CODE_BLOCK_END) && 
                    codeBlockBuffer.length > (CODE_BLOCK_START.length + CODE_BLOCK_END.length)) {
                    inCodeBlock = false;
                    
                    // 检查是否是mermaid图表
                    if (codeBlockBuffer.startsWith(MERMAID_START)) {
                        mermaidBlocksReceived++;
                        console.log(`检测到完整的mermaid图表，当前共${mermaidBlocksReceived}个`);
                    } else {
                        codeBlocksReceived++;
                        console.log(`检测到完整的代码块，当前共${codeBlocksReceived}个`);
                    }
                    
                    codeBlockBuffer = "";
                    currentCodeLang = "";
                }
            }
        };
        
        // 立即更新完整内容
        const immediateFullUpdate = (content, reasonResponse) => {
            try {
                // 应用Markdown处理
                const processedContent = this.processContentWithFullMarkdown(content);
                
                updateMessage({
                    role: 'assistant',
                    content: processedContent,
                    complete: true,
                    reason: reasonResponse
                });
            } catch (error) {
                console.error('更新完整内容时出错:', error);
            }
        };
        
        // 启动平滑输出处理
        const startSmoothOutput = () => {
            if (isProcessingOutput) return;
            isProcessingOutput = true;
            
            outputIntervalId = setInterval(() => {
                if (pendingChars.length === 0) {
                    if (isEndingStream) {
                        // 如果流已结束且没有更多内容，清理定时器
                        clearInterval(outputIntervalId);
                        isProcessingOutput = false;
                        
                        // 强制一次最终更新，确保所有内容都显示
                        if (queuedContentUpdate) {
                            immediateFullUpdate(full_content, full_reasonResponse);
                            queuedContentUpdate = false;
                        }
                        
                        console.log(`输出完成: 共输出 ${totalCharsOutput} 个字符, 包含 ${codeBlocksReceived} 个代码块和 ${mermaidBlocksReceived} 个图表`);
                    }
                    return;
                }
                
                if (isStopped) {
                    console.log('输出被手动终止');
                    clearInterval(outputIntervalId);
                    isProcessingOutput = false;
                    return;
                }

                // 计算本次要输出的字符数量
                // 对于小于100个字符的缓冲区，每次输出较少字符
                // 对于大于100个字符的缓冲区，每次输出字符数量比例增加
                let charsToOutput;
                if (pendingChars.length <= 20) {
                    charsToOutput = 1; // 每次只输出1个字符，非常平滑
                } else if (pendingChars.length <= 100) {
                    charsToOutput = Math.ceil(pendingChars.length * 0.1); // 输出10%的字符
                } else if (pendingChars.length <= 500) {
                    charsToOutput = Math.ceil(pendingChars.length * 0.15); // 输出15%的字符
                } else {
                    charsToOutput = Math.ceil(pendingChars.length * 0.2); // 输出20%的字符
                }
                
                // 提取要输出的字符
                const outputContent = pendingChars.substring(0, charsToOutput);
                pendingChars = pendingChars.substring(charsToOutput);
                
                // 检查特殊内容
                checkForSpecialContent(outputContent);
                
                // 添加到完整内容
                full_content += outputContent;
                totalCharsOutput += outputContent.length;
                
                // 标记有内容更新
                queuedContentUpdate = true;
                
                // 进行适度频率的UI更新 - 避免每次都更新UI造成性能问题
                // 当缓冲区很小或即将清空时，进行更新
                if (pendingChars.length <= 20 || pendingChars.length % 50 === 0) {
                    queuedContentUpdate = false;
                    
                    // 应用Markdown处理到完整内容
                    const processedContent = this.processContentWithFullMarkdown(full_content);
                    
                    // 输出增量更新
                    updateMessage({
                        role: 'assistant',
                        content: processedContent,
                        complete: false,
                        reason: full_reasonResponse
                    });
                }
            }, OUTPUT_INTERVAL);
        };
        
        // 处理数据块
        const processChunk = async (chunk) => {
            if (!chunk.trim()) return false;
            
            try {
                // 查找并解析SSE数据行
                const lines = chunk.split('\n');
                let hasUpdate = false;
                
                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();
                        
                        // 检查是否是结束标记
                        if (data === '[DONE]') {
                            console.log('接收到流结束标记: [DONE]');
                            isStreaming = false;
                            return true;
                        }
                        
                        try {
                            // 解析JSON数据
                            const parsed = JSON.parse(data);
                            lastSuccessfulUpdate = Date.now();
                            
                            // 处理文本增量
                            if (parsed.choices && parsed.choices.length > 0) {
                                const choice = parsed.choices[0];
                                
                                // 更新令牌计数
                                if (parsed.usage && typeof updateTokenCount === 'function') {
                                    if (parsed.usage.total_tokens !== lastTokenCount) {
                                        lastTokenCount = parsed.usage.total_tokens;
                                        updateTokenCount(parsed.usage);
                                    }
                                }
                                
                                // 检查是否为流式响应的结束
                                if (choice.finish_reason) {
                                    full_reasonResponse = choice.finish_reason;
                                    console.log('流式响应接收完成，原因:', choice.finish_reason);
                                    isStreaming = false;
                                    continue;
                                }
                                
                                // 处理内容增量
                                let contentDelta = null;
                                
                                // 处理不同API格式的响应
                                if (choice.delta && choice.delta.content) {
                                    // OpenAI格式
                                    contentDelta = choice.delta.content;
                                } else if (choice.delta && choice.delta.text) {
                                    // 兼容Mistral/Claude的格式
                                    contentDelta = choice.delta.text;
                                } else if (choice.text) {
                                    // 最早期的OpenAI格式
                                    contentDelta = choice.text;
                                } else if (choice.message && choice.message.content) {
                                    // 常规完整响应
                                    contentDelta = choice.message.content;
                                }

                                // 处理推理内容
                                let reasoningContentDelta = null;
                                if (choice.delta && choice.delta.reasoning_content) {
                                    reasoningContentDelta = choice.delta.reasoning_content;
                                } else if (choice.reasoning_content) {
                                    reasoningContentDelta = choice.reasoning_content;
                                } else if (choice.message && choice.message.reasoning_content) {
                                    reasoningContentDelta = choice.message.reasoning_content;
                                }
                                
                                // 如果有增量内容
                                if (contentDelta || reasoningContentDelta) {
                                    hasUpdate = true;
                                    if (contentDelta) {
                                        totalCharsReceived += contentDelta.length;
                                        // 将增量内容直接添加到待处理字符缓冲区
                                        pendingChars += contentDelta;
                                    }
                                    
                                    // 处理推理内容
                                    if (reasoningContentDelta) {
                                        // 累加推理内容
                                        full_reasoning_content += reasoningContentDelta;
                                        updateMessage({
                                            role: 'assistant',
                                            content: full_content,
                                            reasoningContent: full_reasoning_content,
                                            complete: false,
                                            reason: full_reasonResponse
                                        });
                                    }
                                    
                                    // 确保输出处理正在运行
                                    if (!isProcessingOutput) {
                                        startSmoothOutput();
                                    }
                                    
                                    // 定期记录统计信息
                                    const currentTime = Date.now();
                                    if (currentTime - lastLogTime > 3000) {
                                        console.log(`流处理状态: 已接收=${totalCharsReceived}, 已输出=${totalCharsOutput}, 待处理=${pendingChars.length}`);
                                        lastLogTime = currentTime;
                                    }
                                }
                            }
                        } catch (jsonError) {
                            console.warn('无法解析SSE数据:', jsonError, '原始数据:', data);
                        }
                    }
                }
                
                return hasUpdate;
            } catch (error) {
                console.error('处理数据块失败:', error);
                throw error;
            }
        };

        // 健康检查函数 - 监控流式响应状态
        const startHealthCheck = () => {
            if (healthCheckIntervalId) {
                clearInterval(healthCheckIntervalId);
            }
            
            healthCheckIntervalId = setInterval(() => {
                const now = Date.now();
                const timeSinceLastActivity = now - lastNetworkActivity;
                
                // 如果长时间没有网络活动但仍在流式处理中
                if (isStreaming && !isEndingStream && timeSinceLastActivity > TIMEOUT_DURATION) {
                    console.warn(`健康检查: ${timeSinceLastActivity}ms没有网络活动，检查连接状态...`);
                    
                    // 添加状态更新，让用户知道正在尝试恢复连接
                    if (pendingChars.length > 0) {
                        // 保存当前内容，避免重复
                        const currentContent = full_content;
                        
                        // 添加一个临时信息
                        const reconnectingMessage = '\n\n*[正在尝试恢复连接...]*';
                        if (!full_content.endsWith(reconnectingMessage)) {
                            pendingChars += reconnectingMessage;
                        }
                    }
                }
            }, HEALTH_CHECK_INTERVAL);
        };

        // 处理流式响应
        const processStream = async () => {
            console.log('开始处理流式响应');
            startHealthCheck(); // 启动健康检查
            
            try {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let reconnectAttempts = 0;

                while (isStreaming) {
                    try {
                        const { done, value } = await reader.read();
                        
                        // 更新网络活动时间
                        lastNetworkActivity = Date.now();
                        
                        // 检查流是否应该停止（例如，由于AbortController被触发）
                        if (!isStreaming) {
                            console.log('流处理被中断');
                            isStopped = true;
                            break;
                        }
                        
                        if (done) {
                            console.log('读取器报告流已结束');
                            if (buffer.length > 0) {
                                await processChunk(buffer);
                            }
                            
                            // 在流结束时设置标志
                            isEndingStream = true;
                            console.log(`流接收结束，仍有 ${pendingChars.length} 个字符待处理`);
                            
                            // 如果没有待处理字符，手动触发一次最终更新
                            if (pendingChars.length === 0 && queuedContentUpdate) {
                                immediateFullUpdate(full_content, full_reasonResponse);
                                queuedContentUpdate = false;
                            }
                            
                            break;
                        }

                        // 如果收到了数据，重置重连计数
                        if (value && value.length > 0) {
                            reconnectAttempts = 0; 
                        }

                        buffer += decoder.decode(value, { stream: true });
                        
                        // 分块处理
                        const chunks = buffer.split('\n\n');
                        buffer = chunks.pop() || ''; // 最后一个可能不完整
                        
                        for (const chunk of chunks) {
                            if (!isStreaming) break;
                            if (chunk.trim()) {
                                const success = await processChunk(chunk);
                                // 如果处理成功，更新最后成功时间
                                if (success) {
                                    lastSuccessfulUpdate = Date.now();
                                }
                            }
                        }

                        // 如果处理被中断，则退出循环
                        if (isStopped) break;

                        // 改进的超时检测和恢复逻辑
                        const inactiveTime = Date.now() - lastSuccessfulUpdate;
                        if (inactiveTime > TIMEOUT_DURATION) {
                            console.warn(`流式响应超时(${inactiveTime}ms)，尝试恢复连接...`);
                            
                            // 更新UI以通知用户
                            if (pendingChars.length === 0) {
                                pendingChars += '\n\n*[网络连接不稳定，正在尝试恢复...]*';
                                if (!isProcessingOutput) {
                                    startSmoothOutput();
                                }
                            }
                            
                            // 逐步增加重试次数，但不要无限重试
                            if (retryCount < MAX_RETRIES) {
                                retryCount++;
                                // 使用指数退避策略
                                const retryDelay = INITIAL_RETRY_DELAY * Math.pow(1.5, retryCount - 1);
                                console.log(`尝试第${retryCount}次恢复，等待${retryDelay}ms...`);
                                await new Promise(resolve => setTimeout(resolve, retryDelay));
                                continue;
                            } else {
                                // 最后一次尝试完全重新连接
                                if (reconnectAttempts < 2) { // 限制重连尝试次数
                                    reconnectAttempts++;
                                    console.warn(`重试耗尽，尝试第${reconnectAttempts}次完全重连...`);
                                    
                                    // 关闭当前reader
                                    try {
                                        reader.cancel().catch(e => console.error('取消reader错误:', e));
                                    } catch (e) {
                                        console.warn('取消reader时发生错误:', e);
                                    }
                                    
                                    // 短暂延迟后重新开始 - 在实际应用中可能需要重新获取响应
                                    await new Promise(resolve => setTimeout(resolve, RECONNECT_DELAY));
                                    
                                    // 重置重试计数器
                                    retryCount = 0;
                                    continue;
                                }
                                
                                throw new Error(`流式响应在${inactiveTime}ms内无响应，已尝试恢复但失败`);
                            }
                        }
                    } catch (error) {
                        // 检查是否是AbortError
                        if (error.name === 'AbortError') {
                            console.log('流处理被用户中断');
                            isStreaming = false;
                            isStopped = true;
                            break;
                        }
                        
                        if (retryCount < MAX_RETRIES) {
                            retryCount++;
                            console.warn(`重试第 ${retryCount} 次...`);
                            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                            continue;
                        }
                        throw error;
                    }
                }
            } catch (error) {
                // 检查是否是AbortError
                if (error.name === 'AbortError') {
                    console.log('流处理被用户中断 (在主catch块中)');
                    isStreaming = false;
                    isStopped = true;
                } else {
                    console.error('流处理错误:', error);
                    if (onError) onError(error);
                    throw error;
                }
            } finally {
                // 清理定时器
                if (outputIntervalId) {
                    clearInterval(outputIntervalId);
                    outputIntervalId = null;
                }
                
                // 清理健康检查定时器
                if (healthCheckIntervalId) {
                    clearInterval(healthCheckIntervalId);
                    healthCheckIntervalId = null;
                    console.log('已清理健康检查定时器');
                }
                
                // 如果处理被中断，告诉调用者
                if (isStopped) {
                    console.log('流处理被用户中断，不会处理缓冲区中的剩余字符');
                    if (onComplete) onComplete();
                    return;
                }
                
                // 处理重连通知消息
                const reconnectingMessage = '*[正在尝试恢复连接...]*';
                const networkUnstableMessage = '*[网络连接不稳定，正在尝试恢复...]*';
                
                // 如果在处理完成后内容中还有临时状态消息，移除它们
                let finalContent = full_content;
                if (finalContent.includes(reconnectingMessage)) {
                    finalContent = finalContent.replace(reconnectingMessage, '');
                }
                if (finalContent.includes(networkUnstableMessage)) {
                    finalContent = finalContent.replace(networkUnstableMessage, '');
                }
                
                // 确保所有待处理字符都被添加到输出中
                if (pendingChars.length > 0) {
                    // 从待处理字符中移除状态消息
                    let remainingChars = pendingChars;
                    if (remainingChars.includes(reconnectingMessage)) {
                        remainingChars = remainingChars.replace(reconnectingMessage, '');
                    }
                    if (remainingChars.includes(networkUnstableMessage)) {
                        remainingChars = remainingChars.replace(networkUnstableMessage, '');
                    }
                    
                    console.log(`在finally块中处理剩余的 ${remainingChars.length} 个字符`);
                    finalContent += remainingChars;
                    totalCharsOutput += remainingChars.length;
                    pendingChars = '';
                }
                
                // 更新最终内容
                if (finalContent) {
                    immediateFullUpdate(finalContent, full_reasonResponse);
                }
                
                console.log(`流处理完成: 共收到 ${totalCharsReceived} 个字符，输出 ${totalCharsOutput} 个字符`);
                if (onComplete) onComplete();
            }
        };

        await processStream();
    },

    async processSyncResponse(response, onUpdate) {
        try {
            if (!response || !response.choices) {
                throw new Error('无效的响应格式');
            }

            const content = response.choices[0]?.message?.content || '';
            onUpdate(content);

            // 使用新的token计算方法
            const tokenCount = this.countTokens(content);
            return {
                content,
                usage: {
                    prompt_tokens: 0,
                    completion_tokens: tokenCount,
                    total_tokens: tokenCount
                }
            };
        } catch (error) {
            console.error('同步响应处理错误:', error);
            throw error;
        }
    },

    // 发送消息到API，支持流式和同步响应
    async sendMessage(messages, apiKey, apiEndpoint, apiOptions, onUpdate, isRegeneration = false) {
        const controller = new AbortController();
        const signal = controller.signal;
        
        const {
            model = 'gpt-3.5-turbo',
            temperature = 0.7,
            max_tokens = 1000,
            stream = true
        } = apiOptions;
        
        // 检查API Key是否有效
        if (!apiKey) {
            console.error('错误: 没有提供有效的API Key');
            onUpdate('API Key未提供。请在设置中配置您的API Key。', true);
            return { success: false, error: 'No API Key provided' };
        }
        
        // 构建基本payload
        const payload = {
            model,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content || ''
            })),
            temperature,
            max_tokens,
            stream: true,  // 确保stream设置为true
            // 添加必需的字段以兼容SiliconFlow API
           // top_p: 0.7,
          //  top_k: 50,
           // n: 1,
           // frequency_penalty: 0,
           // presence_penalty: 0
        };



        // 删除可能导致错误的null值
        Object.keys(payload).forEach(key => {
            if (payload[key] === null) {
                delete payload[key];
            }
        });
        
        try {
            // console.log('准备发送API请求:', { 
            //     endpoint: apiEndpoint,
            //     model: model,
            //     messagesCount: messages.length,
            //     messagesExample: messages.length > 0 ? JSON.stringify(messages[0]) : 'No messages'
            // });

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}` // 直接使用传入的 apiKey 参数
            };
            
            console.log('请求体:', payload);

            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
                signal // 添加信号用于中断
            });

            console.log('收到API响应:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                let errorText = '';
                let errorJson = null;
                
                try {
                    // 尝试解析为JSON
                    const errorContent = await response.text();
                    console.error('API错误原始内容:', errorContent);
                    
                    try {
                        errorJson = JSON.parse(errorContent);
                        console.error('API错误JSON解析:', errorJson);
                        // 尝试找出具体缺少了哪个字段
                        if (errorJson.message && errorJson.message.includes('Field required')) {
                            console.error('可能缺少的字段:', errorJson.message);
                        }
                        errorText = errorContent;
                    } catch (e) {
                        console.error('错误内容不是有效的JSON:', e);
                        errorText = errorContent;
                    }
                } catch (e) {
                    console.error('无法读取错误响应内容:', e);
                    errorText = `Status: ${response.status}, StatusText: ${response.statusText}`;
                }
                
                throw new Error(`API请求失败: ${response.status} ${response.statusText} - ${errorText}`);
            }

            if (!response.body) {
                throw new Error('API响应没有可读取的流');
            }

            console.log('使用processStreamResponse处理流响应');
            
            // 使用processStreamResponse方法处理流式响应
            await this.processStreamResponse(response, {
                updateMessage: (messageData) => {
                    // 将内部的消息对象格式转换为onUpdate回调所需的参数
                    onUpdate(messageData, messageData.content !== '');
                },
                updateTokenCount: () => {}, // 如果需要可以传递
                onError: (error) => {
                    console.error('流处理错误:', error);
                },
                onComplete: () => {
                    console.log('流处理完成');
                },
                isRegeneration: false
            });
            
            return { success: true, controller };
        } catch (error) {
            // 如果是中断错误，不需要抛出异常
            if (error.name === 'AbortError') {
                console.log('请求被用户中断');
                return { success: false, aborted: true };
            }
            console.error('API请求失败:', error);
            throw error;
        }
    },

    /**
     * 使用后端API发送消息
     * 
     * @param {Array} messages 消息列表
     * @param {Object} apiOptions API选项
     * @param {Function} onUpdate 更新回调
     * @param {Boolean} isRegeneration 是否为重新生成
     * @param {Object} authOptions 可选的认证选项，包含API Key和端点URL
     * @returns {Promise<Object>} 结果对象
     */
    async sendMessageViaBackend(messages, apiOptions, onUpdate, isRegeneration = false, authOptions = {}) {
        const controller = new AbortController();
        const signal = controller.signal;
        
        const {
            model = 'gpt-3.5-turbo',
            temperature = 0.7,
            max_tokens = 1000,
            stream = true
        } = apiOptions;
        
        // 提取认证信息
        const { apiKey, apiEndpoint: rawApiEndpoint } = authOptions;
        
        // 使用normalizeChatCompletionsUrl规范化API端点
        const apiEndpoint = rawApiEndpoint ? normalizeChatCompletionsUrl(rawApiEndpoint) : '';
        
        // 添加日志，检查传入的API设置
        console.log('===== API请求设置开始 =====');
        console.log('传入的自定义API Key:', apiKey ? '已设置 (长度: ' + apiKey.length + ')' : '未设置');
        console.log('传入的自定义API端点:', rawApiEndpoint || '未设置');
        console.log('规范化后的API端点:', apiEndpoint || '未设置');
        console.log('使用的模型:', model);
        
        // 关键修改：优先使用前端API设置的逻辑
        // 如果有自定义API密钥和端点，优先使用，不管后端是否可用
        const { userCustomizedAPI } = authOptions;
        const useCustomApi = userCustomizedAPI && apiKey && apiEndpoint;
        console.log('是否启用自定义API:', userCustomizedAPI);
        console.log('是否有完整的自定义API设置:', useCustomApi);
        
        // 构建payload
        const payload = {
            model,
            messages: messages.map(msg => ({
                role: msg.role,
                content: msg.content || ''
            })),
            temperature,
            max_tokens,
            stream
        };
        
        try {
            // 检查后端API是否可用
            const backendAvailable = await checkBackendAvailability();
            console.log('后端API是否可用:', backendAvailable);
            
            console.log('决定使用:', useCustomApi ? '前端自定义API' : (backendAvailable ? '后端API' : '直接API调用'));
            console.log('===== API请求设置结束 =====');
            
            // 修改后的条件：如果有自定义API或后端不可用，使用直接API调用
            if (useCustomApi || !backendAvailable) {
                console.log('使用直接API调用', useCustomApi ? '(优先使用自定义API)' : '(后端不可用)');
                
                // 验证API密钥和端点是否可用
                if (!apiKey) {
                    throw new Error('API密钥未提供，无法继续操作');
                }
                
                if (!apiEndpoint) {
                    throw new Error('API端点URL未提供，无法继续操作');
                }
                
                // 使用直接API调用
                console.log(`使用直接API调用 (${isRegeneration ? '重新生成' : '新消息'}):`, {
                    model,
                    temperature,
                    max_tokens,
                    stream,
                    messages,
                    endpoint: apiEndpoint
                });
                
                const headers = {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    ...(stream && { 'Accept': 'text/event-stream' })
                };
                
                console.log('准备直接发送API请求到:', apiEndpoint);
                
                // 添加重试逻辑，处理429错误
                let response;
                let retryCount = 0;
                const maxRetries = 3; // 最大重试次数
                let retryDelay = 2000; // 初始重试延迟（毫秒）
                
                while (retryCount <= maxRetries) {
                    try {
                        response = await fetch(apiEndpoint, {
                            method: 'POST',
                            headers: headers,
                            body: JSON.stringify(payload),
                            signal
                        });
                        
                        // 如果不是429错误或已达到最大重试次数，跳出循环
                        if (response.status !== 429 || retryCount === maxRetries) {
                            break;
                        }
                        
                        // 如果是429错误并且还可以重试
                        if (response.status === 429) {
                            retryCount++;
                            console.log(`收到429错误，正在进行第${retryCount}次重试，等待${retryDelay / 1000}秒...`);
                            
                            // 使用onUpdate回调通知用户
                            if (onUpdate && typeof onUpdate === 'function') {
                                onUpdate({
                                    content: `API请求被限流，正在进行第${retryCount}次重试，等待${retryDelay / 1000}秒...`
                                }, false);
                            }
                            
                            // 等待延迟时间
                            await new Promise(resolve => setTimeout(resolve, retryDelay));
                            
                            // 指数退避算法，增加下次重试的延迟时间
                            retryDelay *= 2;
                        }
                    } catch (error) {
                        // 如果是因为用户取消而失败，直接抛出错误
                        if (error.name === 'AbortError') {
                            throw error;
                        }
                        
                        // 其他错误，如果还可以重试，则继续重试
                        if (retryCount < maxRetries) {
                            retryCount++;
                            console.log(`请求失败，正在进行第${retryCount}次重试，等待${retryDelay / 1000}秒...`, error);
                            await new Promise(resolve => setTimeout(resolve, retryDelay));
                            retryDelay *= 2;
                        } else {
                            throw error;
                        }
                    }
                }
                
                if (!response.ok) {
                    if (response.status === 429) {
                        throw new Error(`API请求被限流(429)，已尝试${retryCount}次重试但仍然失败。请稍后再试。`);
                    } else {
                        throw new Error(`直接API请求失败: ${response.status} ${response.statusText}`);
                    }
                }
                
                // 处理流式响应
                if (stream) {
                    await this.processStreamResponse(response, {
                        updateMessage: (messageData) => {
                            onUpdate(messageData, messageData.content !== '');
                        },
                        updateTokenCount: () => {},
                        onError: (error) => {
                            console.error('流处理错误:', error);
                        },
                        onComplete: () => {
                            console.log('流处理完成');
                        },
                        isRegeneration
                    });
                    
                    return { success: true, controller };
                } else {
                    const data = await response.json();
                    const aiReply = data.choices && data.choices[0] && data.choices[0].message 
                        ? data.choices[0].message.content 
                        : '无法获取回复内容';
                    onUpdate(aiReply, true);
                    return { success: true, controller };
                }
            }
            
            // 如果后端可用，且没有自定义API设置，使用后端API
            console.log(`使用后端API (${isRegeneration ? '重新生成' : '新消息'}):`, { 
                model,
                temperature,
                max_tokens,
                stream,
                messagesCount: messages.length
            });
            
            // 如果是重新生成，使用regenerate端点
            const endpoint = isRegeneration ? '/api/regenerate' : '/api/chat';
            
            // 发送请求
            console.log('准备发送请求到后端API:', endpoint);
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(stream && { 'Accept': 'text/event-stream' })
                },
                body: JSON.stringify(payload),
                signal
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
            }
            
            // 处理流式响应
            if (stream) {
                // 使用现有的processStreamResponse方法处理流式响应
                await this.processStreamResponse(response, {
                    updateMessage: (messageData) => {
                        onUpdate(messageData, messageData.content !== '');
                    },
                    updateTokenCount: () => {}, // 如果需要可以传递
                    onError: (error) => {
                        console.error('流处理错误:', error);
                    },
                    onComplete: () => {
                        console.log('流处理完成');
                    },
                    isRegeneration
                });
                
                return { success: true, controller };
            } else {
                // 处理非流式响应
                const data = await response.json();
                
                // 提取AI回复内容
                const aiReply = data.choices && data.choices[0] && data.choices[0].message 
                    ? data.choices[0].message.content 
                    : '无法获取回复内容';
                
                // 调用回调函数更新消息
                onUpdate(aiReply, true);
                
                return { success: true, controller };
            }
        } catch (error) {
            // 如果是中断错误，不需要抛出异常
            if (error.name === 'AbortError') {
                console.log('请求被用户中断');
                return { success: false, aborted: true };
            }
            console.error('API请求失败:', error);
            throw error;
        }
    },

    // 集成sendMessage方法到messageHandler对象
}; 