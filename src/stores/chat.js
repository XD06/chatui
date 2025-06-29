import { defineStore } from 'pinia'
import { ref } from 'vue'
import { messageHandler } from '../utils/messageHandler'

export const useChatStore = defineStore('chat', {
    state: () => ({
        messages: [],
        isLoading: false,
        tokenCount: {
            prompt: 0,
            completion: 0,
            total: 0
        }
    }),

    actions: {
        addMessage(message) {
            this.messages.push(message)
            // 如果是用户消息，计算并更新提示token
            if (message.role === 'user') {
                const promptTokens = messageHandler.countTokens(message.content)
                this.tokenCount.prompt += promptTokens
                this.tokenCount.total += promptTokens
            }
        },

        updateLastMessage(content, reasoningContent = null) {
            const lastMessage = this.messages[this.messages.length - 1]
            if (lastMessage) {
                lastMessage.content = content
                if (reasoningContent !== null) {
                    lastMessage.reasoningContent = reasoningContent
                }
            }
        },

        updateTokenCount(promptTokens = 0, completionTokens = 0) {
            this.tokenCount.prompt = promptTokens
            this.tokenCount.completion = completionTokens
            this.tokenCount.total = promptTokens + completionTokens
        },

        resetTokenCount() {
            this.tokenCount.prompt = 0
            this.tokenCount.completion = 0
            this.tokenCount.total = 0
        },

        clearMessages() {
            console.log('[ChatStore] clearMessages called, removing all messages');
            this.messages = []
            this.resetTokenCount()
            console.log('[ChatStore] Messages cleared, new length:', this.messages.length);
        },
        
        setMessages(messages) {
            this.messages = messages
            // 计算总token使用量
            const promptTokens = messages
                .filter(m => m.role === 'user')
                .reduce((total, m) => total + (m.tokenCount || 0), 0)
            
            const completionTokens = messages
                .filter(m => m.role === 'assistant')
                .reduce((total, m) => total + (m.tokenCount || 0), 0)
            
            this.updateTokenCount(promptTokens, completionTokens)
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'ai-chat-history',
                storage: localStorage,
            },
        ],
    },
}) 