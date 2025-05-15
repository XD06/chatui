import { promptTemplates } from '../config/promptTemplates'
import { optimizePrompt as apiOptimizePrompt, checkBackendAvailability } from './apiService'
// 导入Markdown处理函数
import { initializeMarkdown, applyMarkdownExtensions } from './markdownExtensions.js'

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
        // 使用更短的输出间隔确保平滑体验，调整到更平衡的值
        const CHAR_OUTPUT_INTERVAL = 1; // 减少到1ms，加快初始输出速度
        const MAX_RETRIES = 3;
        const TIMEOUT_DURATION = 5000;
        
        // 添加调试变量
        let totalCharsReceived = 0;
        let totalCharsOutput = 0;
        let lastLogTime = Date.now();
        let isEndingStream = false;

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
        let isStreaming = true;
        let lastSuccessfulUpdate = Date.now();
        let isStopped = false;
        let lastTokenCount = 0;
        
        // 创建字符缓冲区，用于平滑输出
        let charBuffer = [];
        let isOutputtingChars = false;
        
        // 创建计时器id，用于在需要时清除
        let outputTimerId = null;
        
        // 监控输出状态
        let lastOutputLength = 0;
        let outputStallCount = 0;
        
        // 检测并处理特殊内容的辅助函数
        const checkForSpecialContent = (char) => {
            // 检测是否处于代码块中
            if (!inCodeBlock && charBuffer.join('').endsWith(CODE_BLOCK_START)) {
                // 检测到代码块开始
                inCodeBlock = true;
                currentCodeLang = "";
                codeBlockBuffer = CODE_BLOCK_START;
                console.log("检测到代码块开始");
            } else if (inCodeBlock) {
                codeBlockBuffer += char;

                // 检测语言类型
                if (codeBlockBuffer.length === 4 && codeBlockBuffer === "```m") {
                    console.log("可能是mermaid图表");
                }
                
                // 检测代码块结束
                if (codeBlockBuffer.endsWith(CODE_BLOCK_END) && 
                    // 确保不是只有开始标记
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
        
        // 输出字符的核心函数，一个字符一个字符地输出
        const outputBufferedChars = () => {
            if (charBuffer.length === 0 || isOutputtingChars || isStopped) return;
            
            isOutputtingChars = true;
            
            // 清除任何现有的定时器
            if (outputTimerId) {
                clearInterval(outputTimerId);
            }
            
            // 定期输出状态日志
            const logStatus = () => {
                const now = Date.now();
                if (now - lastLogTime > 2000) { // 每2秒记录一次
                    console.log(`输出状态: 缓冲区大小=${charBuffer.length}, 已输出=${totalCharsOutput}/${totalCharsReceived} 字符, 代码块=${codeBlocksReceived}, 图表=${mermaidBlocksReceived}`);
                    lastLogTime = now;
                }
            };
            
            outputTimerId = setInterval(() => {
                if (charBuffer.length === 0) {
                    // 如果这是流的结束，并且我们已经清空了缓冲区
                    if (isEndingStream) {
                        console.log(`输出完成: 共输出 ${totalCharsOutput} 个字符, 包含 ${codeBlocksReceived} 个代码块和 ${mermaidBlocksReceived} 个图表`);
                    }
                    
                    clearInterval(outputTimerId);
                    isOutputtingChars = false;
                    return;
                }
                
                if (isStopped) {
                    console.log('输出被手动终止');
                    clearInterval(outputTimerId);
                    isOutputtingChars = false;
                    return;
                }
                
                // 一次处理多个字符，根据缓冲区大小动态调整
                const batchSize = Math.min(
                    // 如果缓冲区很大，一次处理更多字符
                    charBuffer.length > 500 ? 10 : 
                    charBuffer.length > 200 ? 5 : 
                    charBuffer.length > 50 ? 3 : 1,
                    charBuffer.length // 确保不超过缓冲区大小
                );
                
                let batchContent = '';
                for (let i = 0; i < batchSize; i++) {
                const char = charBuffer.shift();
                    batchContent += char;
                // 检查特殊内容
                checkForSpecialContent(char);
                }
                
                full_content += batchContent;
                totalCharsOutput += batchContent.length;
                
                // 应用Markdown处理到完整内容
                const processedContent = this.processContentWithFullMarkdown(full_content);
                
                // 将当前内容更新到UI
                updateMessage({
                    content: processedContent || full_content,
                    thinkingContent: full_reasonResponse
                });
                
                // 监控是否存在停滞
                if (full_content.length === lastOutputLength) {
                    outputStallCount++;
                    
                    // 如果检测到输出停滞，自动释放一批字符（更积极地释放）
                    if (outputStallCount > 3 && charBuffer.length > 0) {
                        console.log(`检测到输出停滞，释放一批字符 (${Math.min(20, charBuffer.length)}个)`);
                        const batchSize = Math.min(20, charBuffer.length);
                        const batch = charBuffer.splice(0, batchSize).join('');
                        
                        // 在释放批次字符前，检查它们是否含有代码块或图表的开始/结束标记
                        let tempContent = full_content;
                        for (let i = 0; i < batch.length; i++) {
                            tempContent += batch[i];
                            checkForSpecialContent(batch[i]);
                        }
                        
                        full_content = tempContent;
                        totalCharsOutput += batch.length;
                        
            updateMessage({
                            content: full_content,
                            thinkingContent: full_reasonResponse
                        });
                        
                        outputStallCount = 0;
                    }
                } else {
                    lastOutputLength = full_content.length;
                    outputStallCount = 0;
                }
                
                // 记录状态
                logStatus();
                
            }, CHAR_OUTPUT_INTERVAL); // 使用更短的间隔加快输出速度
        };

        // 添加刷新缓冲区的函数，确保缓冲区不会太大
        const flushBufferIfNeeded = () => {
            // 如果缓冲区超过特定大小，强制开始输出
            if (charBuffer.length > 100 && !isOutputtingChars) {
                console.log(`缓冲区达到阈值(${charBuffer.length}个字符)，开始输出`);
                outputBufferedChars();
            } else if (charBuffer.length > 1000) {
                // 如果缓冲区非常大，释放一半以避免内存问题
                console.log(`缓冲区极大(${charBuffer.length}个字符)，释放一半`);
                const releaseCount = Math.floor(charBuffer.length / 2);
                const releasedChars = charBuffer.splice(0, releaseCount).join('');
                full_content += releasedChars;
                totalCharsOutput += releasedChars.length;
                
                updateMessage({
                    content: full_content,
                    thinkingContent: full_reasonResponse
                });
            }
        };

        // 全部内容更新函数（仅在结束时使用）
        const immediateFullUpdate = (content, thinkingContent) => {
            if (isStopped) return;
            
            // 强制清除所有定时器
            if (outputTimerId) {
                clearInterval(outputTimerId);
                outputTimerId = null;
            }
            
            console.log(`强制最终更新: 内容长度=${content.length}, 缓冲区=${charBuffer.length}`);
            
            // 应用Markdown处理
            const processedContent = this.processContentWithFullMarkdown(content);
            
            updateMessage({
                content: processedContent || content,
                thinkingContent: thinkingContent
            });
        };

        const processChunk = async (chunk) => {
            try {
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                let hasUpdate = false;
                
                for (const line of lines) {
                    if (!line.includes('data: ')) continue;
                    
                        const jsonStr = line.replace('data: ', '');
                        if (jsonStr === '[DONE]') {
                        console.log('收到流结束标记 [DONE]');
                        isStreaming = false;
                        isEndingStream = true;
                            continue;
                    }

                    try {
                        const jsData = JSON.parse(jsonStr);
                        let contentUpdated = false;
                        
                        if (jsData.choices[0].delta.reasoning_content) {
                            // 修改：将思考内容也添加到字符缓冲区，实现逐字显示
                            const newThinkingContent = jsData.choices[0].delta.reasoning_content;
                            
                            // 将新的思考内容添加到全局变量，用于最终更新
                            full_reasonResponse += newThinkingContent;
                            
                            // 同样每次更新UI，实现逐字显示
                            updateMessage({
                                content: full_content,
                                thinkingContent: full_reasonResponse
                            });
                            
                            contentUpdated = true;
                        }
                        
                        if (jsData.choices[0].delta.content) {
                            const newContent = jsData.choices[0].delta.content;
                            totalCharsReceived += newContent.length;
                            
                            // 将每个字符添加到缓冲区
                            for (let i = 0; i < newContent.length; i++) {
                                charBuffer.push(newContent[i]);
                            }
                            
                            // 如果没有正在输出，则开始输出字符
                            if (!isOutputtingChars) {
                                outputBufferedChars();
                            }
                            
                            // 定期检查缓冲区是否需要刷新
                            flushBufferIfNeeded();
                            
                            contentUpdated = true;
                        }

                        if (contentUpdated) {
                            hasUpdate = true;
                            
                            // 计算token数量（包括将要显示的内容）
                            const newTokenCount = this.countTokens(full_content + charBuffer.join(''));
                            if (newTokenCount !== lastTokenCount) {
                                updateTokenCount({
                                    prompt_tokens: 0,
                                    completion_tokens: newTokenCount,
                                    total_tokens: newTokenCount
                                });
                                lastTokenCount = newTokenCount;
                            }

                            lastSuccessfulUpdate = Date.now();
                        }
                    } catch (e) {
                        console.warn('解析JSON失败:', e);
                        continue;
                    }
                }
                
                return hasUpdate;
            } catch (error) {
                console.error('处理数据块失败:', error);
                throw error;
            }
        };

        const processStream = async () => {
            console.log('开始处理流式响应');
            try {
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';

                while (isStreaming) {
                    try {
                        const { done, value } = await reader.read();
                        
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
                            
                            // 在流结束时刷新所有缓冲区字符
                            isEndingStream = true;
                            console.log(`流结束，剩余 ${charBuffer.length} 个字符在缓冲区`);
                            
                            if (outputTimerId) {
                                clearInterval(outputTimerId);
                                outputTimerId = null;
                            }
                            
                            // 确保所有缓冲区字符都添加到最终输出中
                            if (charBuffer.length > 0) {
                                console.log(`将剩余的 ${charBuffer.length} 个字符添加到最终输出`);
                                full_content += charBuffer.join('');
                                totalCharsOutput += charBuffer.length;
                                charBuffer = [];
                            }
                            
                            // 最终更新以确保显示完整内容
                            immediateFullUpdate(full_content, full_reasonResponse);
                            break;
                        }

                        buffer += decoder.decode(value, { stream: true });
                        
                        // 使用更保守的分块方法
                        const chunks = [];
                        let startIdx = 0;
                        let endIdx;
                        
                        while ((endIdx = buffer.indexOf('\n\n', startIdx)) !== -1) {
                            chunks.push(buffer.substring(startIdx, endIdx + 2));
                            startIdx = endIdx + 2;
                        }
                        
                        if (startIdx < buffer.length) {
                            buffer = buffer.substring(startIdx);
                        } else {
                            buffer = '';
                        }

                        for (const chunk of chunks) {
                            // 再次检查是否应该停止处理
                            if (!isStreaming) {
                                console.log('流处理在处理块时被中断');
                                isStopped = true;
                                break;
                            }
                            
                            if (chunk.trim()) {
                                await processChunk(chunk);
                            }
                        }

                        // 如果处理被中断，则退出循环
                        if (isStopped) {
                            break;
                        }

                        // 检查超时
                        if (Date.now() - lastSuccessfulUpdate > TIMEOUT_DURATION) {
                            console.warn('流式响应超时，尝试重新连接...');
                            if (retryCount < MAX_RETRIES) {
                                retryCount++;
                                await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                                continue;
                            } else {
                                throw new Error('流式响应超时');
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
                // 清理所有定时器
                if (outputTimerId) {
                    clearInterval(outputTimerId);
                    outputTimerId = null;
                }
                
                // 如果处理被中断，告诉调用者
                if (isStopped) {
                    console.log('流处理被用户中断，不会处理缓冲区中的剩余字符');
                    if (onComplete) onComplete();
                    return;
                }
                
                // 确保缓冲区中的任何剩余字符都被添加到输出中
                if (charBuffer.length > 0) {
                    console.log(`在finally块中处理剩余的 ${charBuffer.length} 个字符`);
                    full_content += charBuffer.join('');
                    totalCharsOutput += charBuffer.length;
                    charBuffer = [];
                }
                
                // 更新最终内容
                if (full_content) {
                    immediateFullUpdate(full_content, full_reasonResponse);
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
        const { apiKey, apiEndpoint } = authOptions;
        
        // 添加日志，检查传入的API设置
        console.log('===== API请求设置开始 =====');
        console.log('传入的自定义API Key:', apiKey ? '已设置 (长度: ' + apiKey.length + ')' : '未设置');
        console.log('传入的自定义API端点:', apiEndpoint || '未设置');
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
                    'Authorization': `Bearer ${apiKey}`
                };
                
                console.log('准备直接发送API请求到:', apiEndpoint);
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload),
                    signal
                });
                
                if (!response.ok) {
                    throw new Error(`直接API请求失败: ${response.status} ${response.statusText}`);
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
                    'Content-Type': 'application/json'
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