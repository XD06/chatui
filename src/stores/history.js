import { defineStore } from 'pinia'
import { useChatStore } from './chat'
import { useSettingsStore } from './settings'

export const useHistoryStore = defineStore('history', {
    state: () => ({
        // Array of chat history records
        records: [],
        // ID of the active history record, 'current' means the current session
        activeRecordId: 'current',
    }),

    getters: {
        /**
         * Get a specific chat history record by ID
         */
        getRecordById: (state) => (id) => {
            return state.records.find(record => record.id === id)
        },

        /**
         * Get all chat history records sorted by timestamp (newest first)
         */
        getAllRecords: (state) => {
            return [...state.records].sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp)
            })
        },
        
        /**
         * Check if a specific chat history record exists
         */
        hasRecord: (state) => (id) => {
            return state.records.some(record => record.id === id)
        },
        
        /**
         * Get the active record ID
         */
        activeId: (state) => {
            return state.activeRecordId
        },
        
        /**
         * Check if we are in the current session
         */
        isCurrentSession: (state) => {
            return state.activeRecordId === 'current'
        }
    },

    actions: {
        /**
         * Add a new chat history record
         */
        addRecord(record) {
            // Check if record with the same ID already exists
            const existingIndex = this.records.findIndex(r => r.id === record.id)
            
            if (existingIndex !== -1) {
                // Update existing record
                this.records[existingIndex] = {
                    ...this.records[existingIndex],
                    ...record,
                    timestamp: new Date().toISOString() // Update timestamp
                }
            } else {
                // Add new record
                this.records.push({
                    ...record,
                    timestamp: record.timestamp || new Date().toISOString()
                })
            }
        },
        
        /**
         * Update an existing chat history record
         */
        updateRecord(id, updates, updateTimestamp = true) {
            const index = this.records.findIndex(record => record.id === id)
            if (index !== -1) {
                this.records[index] = {
                    ...this.records[index],
                    ...updates,
                    ...(updateTimestamp ? { timestamp: new Date().toISOString() } : {})
                }
                return true
            }
            return false
        },
        
        /**
         * Delete a chat history record
         */
        deleteRecord(id) {
            const index = this.records.findIndex(record => record.id === id)
            if (index !== -1) {
                this.records.splice(index, 1)
                
                // If the deleted record was active, switch to current session
                if (this.activeRecordId === id) {
                    this.setActiveRecord('current')
                }
                return true
            }
            return false
        },
        
        /**
         * Save the current chat session as a new history record
         */
        saveCurrentAsHistory(title) {
            const chatStore = useChatStore()
            const settingsStore = useSettingsStore()
            
            // Skip if there are no messages
            if (chatStore.messages.length === 0) {
                return null
            }
            
            // Create a new record ID
            const recordId = `history_${Date.now()}`
            
            // Create a deep copy of the messages to prevent reference issues
            const messagesCopy = JSON.parse(JSON.stringify(chatStore.messages))
            
            // 保存当前角色设定（如果有）
            const roleData = settingsStore.currentRole ? {
                id: settingsStore.currentRole.id,
                name: settingsStore.currentRole.name,
                description: settingsStore.currentRole.description,
                prompt: settingsStore.currentRole.prompt,
                color: settingsStore.currentRole.color,
                isUserCreated: settingsStore.currentRole.isUserCreated
            } : null
            
            // Create the new record
            const newRecord = {
                id: recordId,
                title: title || this.generateTitleFromMessages(chatStore.messages),
                messages: messagesCopy,
                timestamp: new Date().toISOString(),
                tokenCount: { ...chatStore.tokenCount },
                roleData: roleData, // 添加角色设定数据
                modelInfo: { // 添加模型信息
                    model: settingsStore.model,
                    temperature: settingsStore.temperature,
                    maxTokens: settingsStore.maxTokens,
                    topP: settingsStore.topP,
                    topK: settingsStore.topK
                }
            }
            
            // Add the record to the history
            this.addRecord(newRecord)
            
            return recordId
        },
        
        /**
         * Set the active history record
         */
        setActiveRecord(id) {
            // Don't do anything if already active
            if (id === this.activeRecordId) {
                console.log('[HistoryStore] Already active record:', id);
                return;
            }

            const chatStore = useChatStore();
            const settingsStore = useSettingsStore();
            console.log('[HistoryStore] Switching from', this.activeRecordId, 'to', id);

            // 在切换前保存当前的系统角色设定和模型设置（如果是当前会话）
            if (this.activeRecordId === 'current' && chatStore.messages.length > 0) {
                // 保存当前会话的系统角色到 localStorage
                localStorage.setItem('currentChatRole', settingsStore.currentRole ? 
                    JSON.stringify(settingsStore.currentRole) : '');
                
                // 保存当前模型设置到 localStorage
                localStorage.setItem('currentChatModel', JSON.stringify({
                    model: settingsStore.model,
                    temperature: settingsStore.temperature,
                    maxTokens: settingsStore.maxTokens,
                    topP: settingsStore.topP,
                    topK: settingsStore.topK
                }));
            }

            // Scenario 1: Switching TO a history record (from 'current' or another history record)
            if (id !== 'current') {
                const record = this.getRecordById(id);
                if (record) {
                    // If we were in the 'current' session and it has messages, 
                    // save its state to localStorage['currentChat'].
                    // This ensures that if the user switches back to 'current' later, 
                    // they can resume what they left off with.
                    if (this.activeRecordId === 'current' && chatStore.messages.length > 0) {
                        console.log('[HistoryStore] Saving current session before switching to history');
                        localStorage.setItem('currentChat', JSON.stringify(chatStore.messages));
                    }
                    
                    // First set the activeRecordId to ensure any watch effects know we're changing mode
                    this.activeRecordId = id;
                    
                    // Load the history record's messages into the chat store with a deep copy
                    console.log('[HistoryStore] Loading history record:', record.title);
                    chatStore.setMessages(JSON.parse(JSON.stringify(record.messages)));
                    
                    // 加载此记录特有的角色设定（如果有）
                    if (record.roleData) {
                        console.log('[HistoryStore] Restoring role setting for this chat:', record.roleData.name);
                        
                        // 检查是否是自定义角色，如果是，需要查找或创建
                        if (record.roleData.isUserCreated) {
                            // 先检查当前自定义角色列表中是否有相同的角色
                            const existingRole = settingsStore.customRoles.find(r => r.id === record.roleData.id);
                            if (existingRole) {
                                // 如果找到了相同的角色，直接使用
                                settingsStore.currentRole = existingRole;
                            } else {
                                // 如果没有找到，则将记录的角色添加到自定义角色列表中并使用
                                const newRole = settingsStore.addCustomRole(record.roleData);
                                settingsStore.currentRole = newRole;
                            }
                        } else {
                            // 对于非自定义角色，直接设置
                            settingsStore.currentRole = record.roleData;
                        }
                    } else {
                        // 此记录没有角色设定，清除当前角色
                        console.log('[HistoryStore] No role setting for this chat, clearing current role');
                        settingsStore.currentRole = null;
                    }
                    
                    // 加载此记录的模型信息（如果有）
                    if (record.modelInfo) {
                        console.log('[HistoryStore] Restoring model settings for this chat:', record.modelInfo.model);
                        settingsStore.model = record.modelInfo.model;
                        settingsStore.temperature = record.modelInfo.temperature;
                        settingsStore.maxTokens = record.modelInfo.maxTokens;
                        settingsStore.topP = record.modelInfo.topP;
                        settingsStore.topK = record.modelInfo.topK;
                    }
                    
                    return true;
                }
                console.log('[HistoryStore] Record not found:', id);
                return false; // Record not found
            }
            // Scenario 2: Switching TO the 'current' session (from a history record)
            else {
                // First set the activeRecordId to ensure any watch effects know we're changing mode
                this.activeRecordId = 'current';
                
                // Check if localStorage has currentChat item
                const savedCurrentChat = localStorage.getItem('currentChat');
                
                if (savedCurrentChat) {
                    try {
                        // Attempt to load messages from localStorage with a deep copy
                        const savedMessages = JSON.parse(savedCurrentChat);
                        if (savedMessages && savedMessages.length > 0) {
                            console.log('[HistoryStore] Loading saved current session from localStorage');
                            chatStore.setMessages(JSON.parse(JSON.stringify(savedMessages)));
                            
                            // 恢复当前会话的系统角色
                            const savedRole = localStorage.getItem('currentChatRole');
                            if (savedRole) {
                                try {
                                    const roleData = JSON.parse(savedRole);
                                    console.log('[HistoryStore] Restoring role for current session:', roleData.name);
                                    
                                    // 检查是否是自定义角色
                                    if (roleData.isUserCreated) {
                                        const existingRole = settingsStore.customRoles.find(r => r.id === roleData.id);
                                        if (existingRole) {
                                            settingsStore.currentRole = existingRole;
                                        } else {
                                            const newRole = settingsStore.addCustomRole(roleData);
                                            settingsStore.currentRole = newRole;
                                        }
                                    } else {
                                        settingsStore.currentRole = roleData;
                                    }
                                } catch (roleError) {
                                    console.error('[HistoryStore] Failed to restore role:', roleError);
                                    settingsStore.currentRole = null;
                                }
                            } else {
                                // 没有保存的角色，清除当前角色
                                settingsStore.currentRole = null;
                            }
                            
                            // 恢复当前会话的模型设置
                            const savedModel = localStorage.getItem('currentChatModel');
                            if (savedModel) {
                                try {
                                    const modelInfo = JSON.parse(savedModel);
                                    console.log('[HistoryStore] Restoring model settings for current session:', modelInfo.model);
                                    settingsStore.model = modelInfo.model;
                                    settingsStore.temperature = modelInfo.temperature;
                                    settingsStore.maxTokens = modelInfo.maxTokens;
                                    settingsStore.topP = modelInfo.topP;
                                    settingsStore.topK = modelInfo.topK;
                                } catch (modelError) {
                                    console.error('[HistoryStore] Failed to restore model settings:', modelError);
                                }
                            }
                        } else {
                            console.log('[HistoryStore] Saved current session is empty, clearing messages');
                            chatStore.clearMessages();
                            settingsStore.currentRole = null; // 清除角色设定
                        }
                    } catch (e) {
                        console.error('[HistoryStore] Failed to load current chat from localStorage:', e);
                        chatStore.clearMessages(); // Clear on error
                        settingsStore.currentRole = null; // 清除角色设定
                    }
                } else {
                    // No saved current chat, so clear messages for a fresh start
                    console.log('[HistoryStore] No saved current session, clearing messages');
                    chatStore.clearMessages();
                    settingsStore.currentRole = null; // 清除角色设定
                }
                return true;
            }
        },
        
        /**
         * Generate a title from the first few messages
         */
        generateTitleFromMessages(messages) {
            // Get the first user message
            const firstUserMessage = messages.find(m => m.role === 'user')
            
            if (firstUserMessage) {
                // Extract the first line or first N characters
                let title = firstUserMessage.content.split('\n')[0].trim()
                
                // Limit title length
                if (title.length > 50) {
                    title = title.substring(0, 47) + '...'
                }
                
                return title
            }
            
            // Fallback title
            return '对话 ' + new Date().toLocaleString()
        },
        
        /**
         * Clear all history records
         */
        clearAllRecords() {
            this.records = []
            this.activeRecordId = 'current'
        },

        /**
         * Debug state of the history store
         */
        debugState() {
            console.group('🔍 History Store Debug');
            console.log('Active Record ID:', this.activeRecordId);
            console.log('Is Current Session:', this.isCurrentSession);
            console.log('Records Count:', this.records.length);
            console.log('Records:', this.records.map(r => ({
                id: r.id,
                title: r.title,
                messageCount: r.messages?.length || 0,
                timestamp: r.timestamp
            })));
            console.groupEnd();
            return true;
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'chat-history-records',
                storage: localStorage,
            },
        ],
    },
}) 