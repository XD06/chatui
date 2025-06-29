<template>
  <!-- 消息容器，根据消息角色和加载状态动态调整样式 -->
  <div 
    :class="[
      'message-container',
      `role-${message.role}`,
      { 'regenerating': message.loading },
      { 'latest-message': props.isLatestMessage && message.role === 'assistant' },
      { 'completed': isMessageComplete },
      { 'history-message': !props.isLatestMessage || isMessageComplete }
    ]"
    :data-message-status="props.isLatestMessage && !isMessageComplete ? 'generating' : 'completed'"
  >
    <!-- AI头像（只在AI消息时显示在左侧） -->
    <div v-if="message.role === 'assistant'" class="avatar assistant-avatar">
      <!-- <el-icon><ChatDotRound /></el-icon> -->
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="50" height="50" viewBox="0 0 50 50">
<path d="M 25 1 A 2.5 2.5 0 0 0 22.509766 3.2851562 L 7.2539062 12.119141 A 2.5 2.5 0 0 0 6.5 12 A 2.5 2.5 0 0 0 5 16.498047 L 5 33.503906 A 2.5 2.5 0 0 0 6.5 38 A 2.5 2.5 0 0 0 7.2558594 37.882812 L 22.513672 46.716797 A 2.5 2.5 0 0 0 25 49 A 2.5 2.5 0 0 0 27.490234 46.714844 L 42.746094 37.880859 A 2.5 2.5 0 0 0 43.5 38 A 2.5 2.5 0 0 0 45 33.501953 L 45 16.496094 A 2.5 2.5 0 0 0 43.5 12 A 2.5 2.5 0 0 0 42.744141 12.117188 L 27.486328 3.2832031 A 2.5 2.5 0 0 0 25 1 z M 22.265625 5.7402344 L 15.130859 18.128906 L 8.9960938 14.578125 A 2.5 2.5 0 0 0 8.8027344 13.533203 L 22.265625 5.7402344 z M 27.734375 5.7402344 L 41.197266 13.533203 A 2.5 2.5 0 0 0 41.001953 14.580078 L 34.869141 18.128906 L 27.734375 5.7402344 z M 8.1347656 16.390625 L 14.134766 19.865234 L 15.136719 18.134766 L 23.519531 22.990234 C 23.939531 22.690234 24.45 22.5 25 22.5 C 25.55 22.5 26.060469 22.690234 26.480469 22.990234 L 34.863281 18.134766 L 35.865234 19.865234 L 41.867188 16.390625 A 2.5 2.5 0 0 0 43 16.947266 L 43 32.253906 L 35.869141 19.869141 L 27.470703 24.720703 C 27.480703 24.820703 27.5 24.91 27.5 25 C 27.5 26.02 26.88 26.899062 26 27.289062 L 26 37 L 40.275391 37 L 26.822266 44.789062 A 2.5 2.5 0 0 0 26 44.210938 L 26 37 L 24 37 L 24 44.210938 A 2.5 2.5 0 0 0 23.177734 44.789062 L 9.7246094 37 L 24 37 L 24 27.289062 C 23.12 26.899062 22.5 26.02 22.5 25 C 22.5 24.91 22.519297 24.820703 22.529297 24.720703 L 14.130859 19.869141 L 7 32.253906 L 7 16.949219 A 2.5 2.5 0 0 0 8.1347656 16.390625 z"></path>
</svg>
    </div>
    
    <!-- 消息内容容器 -->
    <div class="message-content">
      <!-- 消息头部：角色名和时间戳 -->
      <div class="message-header">
        <div class="message-role">{{ message.role === 'user' ? 'User' : 'AI Assistant' }}</div>
        <div class="message-time">{{ formatTime(message.timestamp) }}</div>
      </div>

      <!-- 思考内容区域 (只在AI消息且存在思考内容时显示) -->
      <div 
        v-if="message.role === 'assistant' && message.reasoningContent" 
        class="thinking-bubble"
        :class="{ 'thinking-active': !message.completed }"
      >
        <div class="thinking-header">
          <div class="thinking-icon" style="margin-left: 5px;">
            <el-icon><Operation /></el-icon>
          </div>
          <div class="thinking-title">
            <!-- 根据消息状态显示不同的标题 -->
            <span v-if="!message.completed">思考中
              <span class="thinking-dots">
                <span class="dot dot-1">.</span>
                <span class="dot dot-2">.</span>
                <span class="dot dot-3">.</span>
              </span>
            </span>
            <span v-else>已深度思考☁️</span>
          </div>
          <el-button 
            v-if="message.completed"
            type="text" 
            class="toggle-thinking-btn" 
            @click="isThinkingExpanded = !isThinkingExpanded"
          >
            {{ isThinkingExpanded ? '▲' : '▼' }}
          </el-button>
        </div>
        <!-- 思考中状态或展开状态时显示思考内容 -->
        <div 
          v-show="!message.completed || isThinkingExpanded" 
          class="thinking-content" 
          v-html="formatThinkingContent"
        ></div>
      </div>

      <!-- 消息气泡 -->
      <div class="message-bubble">
        
        <div v-if="message.loading" class="message-loading">
          <div class="loading-circle"></div>
          <span class="loading-text">AI思考中
            <span class="thinking-dots">
              <span class="dot dot-1">.</span>
              <span class="dot dot-2">.</span>
              <span class="dot dot-3">.</span>
            </span>
          </span>
        </div>
        <div v-else class="message-text" ref="messageText">
          <div
            v-if="isEditing"
            class="message-editing"
          >
            <el-input
              v-model="editingContent"
              type="textarea"
              :rows="3"
              autofocus
              @keydown.esc="cancelEdit"
              @keydown.ctrl.enter="saveEdit"
            />
            <div class="editing-actions">
              <el-button
                @click="saveEdit"
                size="small"
                type="primary"
              >Save</el-button>
              <el-button
                @click="cancelEdit"
                size="small"
              >Cancel</el-button>
            </div>
          </div>
          <div v-else>
            <!-- Message content rendered with v-html -->
            <div class="message-display" v-html="formatContent"></div>
            
            <!-- Only show for AI messages that are the latest and not complete -->
            <div v-if="message.role === 'assistant' && props.isLatestMessage && !isMessageComplete" class="typing-indicator">
              <div class="dot"></div>
              <div class="dot"></div>
              <div class="dot"></div>
            </div>
          </div>
        </div>
        
        <!-- 消息统计信息 -->
        <div v-if="message.role === 'assistant' && isMessageComplete" class="message-stats">
          <span v-if="message.tokenCount" class="stat-item">Tokens:{{ message.tokenCount }}</span>
          <span v-if="message.firstResponseTime" class="stat-item" title="首次响应时间 - 从发送请求到收到第一个数据包的延迟">FR: {{ formatResponseTime(message.firstResponseTime - message.startTimestamp) }}</span>
          <span v-if="message.responseTime" class="stat-item" title="完成时间 - 从发送请求到消息完全接收完成的总时间">CT: {{ formatResponseTime(message.responseTime) }}</span>
        </div>
      </div>

      <!-- 消息底部工具栏 - 直接显示按钮 -->
      <div class="message-actions">
        <!-- 用户消息的操作按钮 -->
        <template v-if="message.role === 'user'">
          <!-- 桌面端操作按钮 - 与移动端一致 -->
          <div class="desktop-actions">
            <div class="action-buttons-container">
              <el-button class="action-btn" @click="handleCopy" type="text" size="small">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
              <el-button class="action-btn" @click="handleDelete" type="text" size="small">
                <el-icon><Delete /></el-icon>
              </el-button>
              <el-button class="action-btn" @click="startEdit" type="text" size="small">
                <el-icon><EditPen /></el-icon>
              </el-button>
            </div>
          </div>
          
          <!-- Mobile version with direct buttons (will only show on mobile) - icons only -->
          <div class="mobile-actions">
            <el-button class="mobile-action-btn" @click="handleCopy" type="text" size="small">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
            <el-button class="mobile-action-btn" @click="handleDelete" type="text" size="small">
              <el-icon><Delete /></el-icon>
            </el-button>
            <el-button class="mobile-action-btn" @click="startEdit" type="text" size="small">
              <el-icon><EditPen /></el-icon>
            </el-button>
          </div>
        </template>
        
        <!-- AI消息的操作按钮 -->
        <template v-else>
          <!-- 桌面端操作按钮 - 与移动端一致 -->
          <div class="desktop-actions">
            <div class="action-buttons-container">
              <el-button class="action-btn" @click="handleCopy" type="text" size="small">
                <el-icon><CopyDocument /></el-icon>
              </el-button>
              
              <el-button v-if="props.isLatestMessage" class="action-btn" @click="handleRegenerate" type="text" size="small">
                <el-icon><Refresh /></el-icon>
              </el-button>
              
              <el-button class="action-btn" @click="handleDelete" type="text" size="small">
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
          
          <!-- Mobile version with direct buttons (will only show on mobile) - icons only -->
          <div class="mobile-actions">
            <el-button class="mobile-action-btn" @click="handleCopy" type="text" size="small">
              <el-icon><CopyDocument /></el-icon>
            </el-button>
            <el-button v-if="props.isLatestMessage" class="mobile-action-btn" @click="handleRegenerate" type="text" size="small">
              <el-icon><Refresh /></el-icon>
            </el-button>
            <el-button class="mobile-action-btn" @click="handleDelete" type="text" size="small">
              <el-icon><Delete /></el-icon>
            </el-button>
          </div>
        </template>
      </div>
      
      <!-- 建议问题显示区域（仅在最新的AI消息完全加载完成后显示） -->
      <SuggestedQuestions
        v-if="message.role === 'assistant' && messageCompleted && props.isLatestMessage && message.suggestedQuestions && message.suggestedQuestions.length"
        :questions="message.suggestedQuestions"
        @select="handleQuestionSelect"
        class="suggested-questions-inside"
      />
    </div>
    
    <!-- 用户头像（及欧兰色渐变气泡） -->
    <div v-if="message.role === 'user'" class="avatar user-avatar">
      <div class="gradient-avatar"></div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, getCurrentInstance, onMounted, nextTick, watch, onUnmounted, onUpdated } from 'vue'
import { useChatStore } from '../stores/chat'
import { ElMessage, ElMessageBox } from 'element-plus'
import SuggestedQuestions from './SuggestedQuestions.vue'
import { 
  ChatDotRound, 
  MoreFilled, 
  EditPen, 
  Delete, 
  CopyDocument, 
  Refresh,
  Operation
} from '@element-plus/icons-vue'
import hljs from 'highlight.js'
import markdownIt from 'markdown-it'
// 导入代码执行工具
import { openCodeModal } from '../utils/codeExecutor'
// 导入markdown渲染函数
import { renderMarkdown, processPendingCodeBlocks } from '@/utils/markdown.js'
import { renderMermaidDiagrams } from '@/utils/mermaid-plugin'

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isLatestMessage: {
    type: Boolean,
    default: false
  },
  messageStreamFinished: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'delete', 'regenerate', 'questionSelected', 'messageRenderComplete'])

const messageText = ref(null)
const isThinkingExpanded = ref(false)
const messageCompleted = ref(false)
const messageContent = ref('')

// Add options to control markdown rendering behavior
const mdOptions = {
  html: false,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    // 优化的高亮功能，避免闪烁
    if (lang && hljs.getLanguage(lang)) {
      try {
        // 使用一次性渲染方式，不设置任何过渡效果
        const highlighted = hljs.highlight(str, { 
          language: lang, 
          ignoreIllegals: true 
        }).value;
        
        // 计算行数，但不设置固定高度，让代码块自适应内容
        const lineCount = str.split('\n').length;
        
        // 使用不含过渡和动画效果的HTML结构
        return `<pre class="code-block code-block-static" data-lang="${lang}" data-line-count="${lineCount}">
          <div class="code-header">
            <span class="code-lang">${lang}</span>
            <div class="code-actions">
              ${lang.toLowerCase() === 'html' ? 
                `<button class="run-btn" title="在沙盒中运行代码">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>` : ''
              }
              <button class="copy-btn" title="复制代码">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
          <code class="hljs-static">${highlighted}</code>
        </pre>`;
      } catch (error) {
        console.error('Highlight error:', error);
        return `<pre class="code-block code-block-static"><code class="hljs-static">${md.utils.escapeHtml(str)}</code></pre>`;
      }
    }
    
    // For unknown languages
    const lineCount = str.split('\n').length;
    
    return `<pre class="code-block code-block-static" data-lang="plaintext" data-line-count="${lineCount}">
      <div class="code-header">
        <span class="code-lang">plaintext</span>
        <div class="code-actions">
          <button class="copy-btn" title="复制代码">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
        </div>
      </div>
      <code class="hljs-static">${md.utils.escapeHtml(str)}</code>
    </pre>`;
  }
};

// Use the updated options for markdown rendering
const md = markdownIt(mdOptions);

// 编辑状态和内容
const isEditing = ref(false)
const editingContent = ref('')

// 开始编辑消息
const startEdit = () => {
  editingContent.value = props.message.content
  isEditing.value = true
  nextTick(() => {
    const textarea = document.querySelector('.message-editing textarea')
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(textarea.value.length, textarea.value.length)
    }
  })
}

// 保存编辑内容
const saveEdit = () => {
  if (editingContent.value.trim() === '') {
    ElMessage.warning('Message cannot be empty')
    return
  }
  
  const updatedMessage = { ...props.message, content: editingContent.value }
  emit('update', updatedMessage)
  isEditing.value = false
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
}

// 处理用户消息的命令
const handleUserCommand = (command) => {
  switch (command) {
    case 'edit':
      startEdit()
      break
    case 'delete':
      handleDelete()
      break
    case 'copy':
      handleCopy()
      break
  }
}

// 处理AI消息的命令
const handleAssistantCommand = (command) => {
  switch (command) {
    case 'regenerate':
      // 确保传递完整的消息对象
      console.log('[DEBUG] 发出重新生成事件，消息:', props.message);
      emit('regenerate', props.message);
      break;
    case 'copy':
      handleCopy();
      break;
    case 'delete':
      handleDelete();
      break;
  }
}

// 统一处理删除消息
const handleDelete = () => {
  // 使用confirm避免误删
  ElMessageBox.confirm('确定要删除这条消息吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    emit('delete', props.message)
  }).catch(() => {
    // 用户取消，不执行任何操作
  })
}

// 复制消息内容
const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.message.content)
    ElMessage.success('Copied to clipboard')
  } catch (error) {
    console.error('Failed to copy:', error)
    ElMessage.error('Failed to copy content')
  }
}

// 处理重新生成
const handleRegenerate = () => {
  console.log('[DEBUG] 发出重新生成事件，消息:', props.message);
  emit('regenerate', props.message);
}

// 处理建议问题选择
const handleQuestionSelect = (question) => {
  // 将选中的问题发送给父组件，由父组件转发给聊天输入框
  console.log('[DEBUG] 选择了建议问题:', question);
  emit('questionSelected', question);
}

// 优化建议问题的显示时机：只在消息完全接收后延迟5秒显示
watch([
  () => props.message.completed,
  () => props.messageStreamFinished
], ([completed, streamFinished]) => {
  if (completed && streamFinished) {
    nextTick(() => {
      setTimeout(() => {
        messageCompleted.value = false;
      }, 5000);
    });
  } else {
    messageCompleted.value = false;
  }
});

// 修改updateContentDisplay函数，移除动画效果
const updateContentDisplay = (content) => {
  if (!content) return;
  
  // 检查消息角色
  if (props.message.role !== 'assistant') {
    // 用户消息不需要Markdown渲染，直接显示纯文本
    messageContent.value = `<div class="user-message-text">${content.replace(/\n/g, '<br>')}</div>`;
    messageCompleted.value = false;
    return;
  }
  
  // 检查消息是否已完成
  const isComplete = props.message.completed || props.message.error;
  
  // 检测消息是否包含完整的代码块或图表
  const hasCompleteCodeBlocks = content.includes("```") && 
                               (content.match(/```/g) || []).length % 2 === 0;
  
  const hasMermaidBlocks = content.includes("```mermaid") && 
                           content.match(/```mermaid[\s\S]*?```/g);
  
  // 直接渲染新接收到的内容，禁用平滑输出选项
  messageContent.value = renderMarkdown(content, { 
    smoothOutput: false // 禁用平滑输出选项，避免动画效果
  });
  
  // 设置代码块交互
  nextTick(() => {
    setupCodeBlockInteractions();
  });
  
  // 如果消息完成或包含完整代码块，处理代码块渲染
  if ((isComplete || hasCompleteCodeBlocks) && !messageCompleted.value) {
    // 直接处理代码块，不使用延迟
    processPendingCodeBlocks();
    
    // 如果包含Mermaid图表和消息已完成，直接触发图表渲染
    if (hasMermaidBlocks && isComplete) {
      renderMermaidDiagrams();
    }
    
    // 只有完全完成的消息才标记为已完成
    if (isComplete) {
      messageCompleted.value = false;
    }
  }
};

// 处理消息更新
watch(() => props.message.content, (newContent) => {
  if (newContent) {
    updateContentDisplay(newContent)
  }
}, { immediate: true })

// 修改格式化内容计算属性，使用messageContent而不是直接使用props.message.content
const formatContent = computed(() => {
  // 使用messageContent代替直接使用props.message.content
  return messageContent.value || '';
});

// 格式化思考内容
const formatThinkingContent = computed(() => {
  if (!props.message.reasoningContent) return '';
  return renderMarkdown(props.message.reasoningContent);
})

// 格式化时间
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// 格式化响应时间
const formatResponseTime = (ms) => {
  if (!ms) return '';
  if (ms < 1000) {
    return `${Math.round(ms)}ms`
  } else {
    return `${(ms / 1000).toFixed(2)}s`
  }
}

// 消息是否已完成 - 计算属性
const isMessageComplete = computed(() => {
  return !props.message.loading && props.message.content && props.message.completed
})

// 高亮代码块并添加复制功能
const setupCodeBlockInteractions = () => {
  if (!messageText.value) return;

  // 防止频繁处理，使用requestAnimationFrame延迟处理
  window.cancelAnimationFrame(window._codeRenderFrame);
  window._codeRenderFrame = window.requestAnimationFrame(() => {
    // 添加复制功能处理
    const copyButtons = messageText.value.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
      // 移除旧的事件监听器以避免重复绑定
      button.removeEventListener('click', handleCopyClick);
      button.addEventListener('click', handleCopyClick);
    });
    
    // 添加运行HTML代码块功能
    const runButtons = messageText.value.querySelectorAll('.run-btn');
    runButtons.forEach(button => {
      // 移除旧的事件监听器以避免重复绑定
      button.removeEventListener('click', handleRunClick);
      button.addEventListener('click', handleRunClick);
    });
    
    // 高亮代码块 - 经过优化的代码高亮处理
    const codeBlocks = messageText.value.querySelectorAll('.code-block code:not(.hljs)');
    if (codeBlocks.length > 0) {
      // 限制同时处理的代码块数量
      const processCodeBlocks = (blocks, startIndex = 0, batchSize = 3) => {
        const endIndex = Math.min(startIndex + batchSize, blocks.length);
        
        // 处理当前批次
        for (let i = startIndex; i < endIndex; i++) {
          const block = blocks[i];
          if (!block.classList.contains('hljs')) {
            try {
              hljs.highlightElement(block);
            } catch (e) {
              console.error('代码高亮失败:', e);
            }
          }
        }
        
        // 如果还有剩余批次，安排下一帧处理
        if (endIndex < blocks.length) {
          window.requestAnimationFrame(() => {
            processCodeBlocks(blocks, endIndex, batchSize);
          });
        }
      };
      
      // 开始批量处理
      processCodeBlocks(Array.from(codeBlocks));
    }
    
    // 处理mermaid图表
    renderMermaidDiagrams();
  });
};

// 处理复制按钮点击
const handleCopyClick = (e) => {
          e.stopPropagation();
          e.preventDefault();
          
  const button = e.currentTarget;
          const codeBlock = button.closest('.code-block');
          if (codeBlock) {
            const codeElement = codeBlock.querySelector('code');
            if (codeElement) {
              const text = codeElement.textContent || '';
              navigator.clipboard.writeText(text)
                .then(() => {
                  // 显示复制成功提示
                  const originalInnerHTML = button.innerHTML;
                  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
                  button.style.color = '#10b981';
                  
                  setTimeout(() => {
                    button.innerHTML = originalInnerHTML;
                    button.style.color = '';
                  }, 1500);
                  
                  ElMessage({
                    message: '代码已复制到剪贴板',
                    type: 'success',
                    offset: 60,
                    duration: 1500
                  });
                })
                .catch(err => {
                  console.error('复制失败:', err);
                  ElMessage.error('复制失败，请手动选择并复制代码');
                });
            }
          }
};
      
// 处理运行按钮点击
const handleRunClick = (e) => {
  e.stopPropagation();
  e.preventDefault();
  console.log('Run button clicked');
  
  const button = e.currentTarget;
  const codeBlock = button.closest('.code-block');
  if (codeBlock) {
    const codeElement = codeBlock.querySelector('code');
    if (codeElement) {
      const htmlCode = codeElement.textContent || '';
      console.log('Opening code modal with HTML code');
      openCodeModal(htmlCode);
    }
    }
};

// 监视DOM更新来确保代码块交互设置
onUpdated(() => {
  // 使用requestAnimationFrame代替setTimeout防止过度频繁触发
  window.cancelAnimationFrame(window._codeSetupFrame);
  window._codeSetupFrame = window.requestAnimationFrame(() => {
    if (messageText.value) {
      setupCodeBlockInteractions();
    }
  });
});

// 确保组件挂载时也设置代码块交互
onMounted(() => {
  nextTick(() => {
    if (messageText.value) {
      setupCodeBlockInteractions();
    }
  });
});

// 监视formatContent变化，确保内容改变时重新处理代码块
watch(() => formatContent.value, () => {
  // 给DOM一点时间渲染
  nextTick(() => {
    if (messageText.value) {
      setupCodeBlockInteractions();
    }
  });
});

// 监听消息的completed属性变化
watch(() => props.message.completed, (isCompleted) => {
  if (isCompleted) {
    // 消息完成后，标记为已完成状态，停止所有动画
    messageCompleted.value = false;
  }
});

// 组件卸载时清理定时器
onUnmounted(() => {
  // No timers to clean up
});
</script>

<style lang="scss" scoped>
.message-container {
  display: flex;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  
  // Desktop styles - make messages more centered
  @media (min-width: 769px) {
    width: 90%;
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
  
  // User message styling
  &.role-user {
    justify-content: end;
    .message-content {
      align-items: flex-end;
    }
    .message-bubble {
      background:linear-gradient(244deg, #e74c3c, #f39c12, #2c7a65);
      color: white;
      border-radius: 16px 16px 4px 16px; 
      box-shadow: 0 4px 12px rgba(231, 76, 60, 0.25);
      max-width: 100%;
      
      [data-theme="dark"] & {
        background: linear-gradient(135deg, #c0392b, #d35400, #1e8449);
        box-shadow: 0 4px 12px rgba(192, 57, 43, 0.3);
      }
      
      @media (max-width: 768px) {
        border-radius: 16px 16px 4px 16px;
      }
    }
    .avatar {
      margin-left: 10px;
      @media (max-width: 768px) {
        margin-left: 8px;
      }
    }
  }
  
  // AI消息靠左
  &.role-assistant {
    justify-content: start;
    .message-bubble {
      background-color: white;
      color: #333;
      border-radius: 16px 16px 16px 4px;
      //box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
     // border: 1px solid #f0f0f0;
      
      @media (max-width: 768px) {
        border-radius: 16px 16px 16px 4px;
      }
      
      /* Dark mode styling */
      [data-theme="dark"] & {
        background-color: #2d2d33;
        color: #e0e0e0;
        border: 1px solid #383838;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
    }
    .avatar {
      margin-right: 10px;
      @media (max-width: 768px) {
        margin-right: 8px;
      }
    }
  }
  
  // 正在重新生成时的样式
  &.regenerating {
    opacity: 0.7;
  }
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0; // 防止头像被压缩

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  &.assistant-avatar {
    background-color: transparent; // AI头像背景色
  color: white;
    font-size: 20px;
    
    svg {
      width: 35px;
      height: 35px;
  }
  }

  &.user-avatar {
    background-color: transparent; // 用户头像背景色
    color: #555;
    
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
    }
  }
}

.message-content {
        display: flex;
  flex-direction: column;
  max-width: 80%; // 限制消息内容最大宽度，避免过长

  // For desktop, make the content slightly narrower for better readability
  @media (min-width: 769px) {
    max-width: 70%;
  }

  // 移动端消息内容占满可用空间
  @media (max-width: 768px) {
    max-width: calc(100% - 40px); // 减去头像和一些间距
  }
}

.message-header {
          display: flex;
          align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;

  [data-theme="dark"] & {
    color: #aaa;
  }

  .message-role {
    font-weight: 600;
    margin-right: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    
    .role-user & {
      color: #4285f4;
    }
    
    .role-assistant & {
      color: #34a853;
    }
    
    [data-theme="dark"] .role-user & {
      color: #5c9dff;
    }
    
    [data-theme="dark"] .role-assistant & {
      color: #4caf50;
    }
  }
  
  .message-time {
    opacity: 0.8;
      }
    }

.thinking-bubble {
  padding: 10px 14px;
  border-radius: 12px;
  background-color: rgb(148 152 158 / 5%);
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #444;
  border: 1px solid rgba(66, 133, 244, 0.1);
  width: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &.thinking-active {
    animation: pulseThinking 1.5s infinite alternate;
  }
  
  // &:hover {
  //   transform: translateY(-2px);
  //   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  //   background-color: rgba(54, 55, 56, 0.08);
  // }

  [data-theme="dark"] & {
    background-color: rgba(92, 157, 255, 0.08);
    border-color: rgba(92, 157, 255, 0.15);
    color: #ccc;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      background-color: rgba(92, 157, 255, 0.12);
    }
  }
  
  .thinking-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: default;
    
    .thinking-icon {
      margin-right: 8px;
      
      .el-icon {
        color: black;
        animation: pulseThinking 1.5s infinite alternate;
        
        [data-theme="dark"] & {
          color: #5c9dff;
      }
    }
    }
    
    .thinking-title {
      flex-grow: 1;
      display: flex;
      align-items: center;
      font-weight: 600;
      color: black;
      
      [data-theme="dark"] & {
        color: #c3c9d1;
    }
    }
    
    .toggle-thinking-btn {
      padding: 0 4px;
      font-size: 0.9rem;
      color: black;
      transition: all 0.2s ease;
      border-radius: 4px;
      
      &:hover {
        background-color: rgba(66, 133, 244, 0.1);
        transform: translateY(-1px);
      }
      
      [data-theme="dark"] & {
        color: #5c9dff;
    
        &:hover {
          background-color: rgba(92, 157, 255, 0.15);
    }
      }
    }
  }

  .thinking-content {
    margin-top: 8px;
    padding-top: 8px;
    font-style: italic;
    border-top: 1px dashed rgba(66, 133, 244, 0.2);
    white-space: pre-wrap;
    word-break: break-all;
    //max-height: 150px;
    overflow-y: auto;
    font-size: 0.8rem;
    line-height: 1.6;
    scrollbar-width: thin;
    color: #555;
    transition: all 0.1s ease;
    
    &::-webkit-scrollbar {
      width: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: rgba(66, 133, 244, 0.2);
      border-radius: 4px;
    }
    
    [data-theme="dark"] & {
      border-top-color: rgba(92, 157, 255, 0.2);
      color: #bbb;
      
      &::-webkit-scrollbar-thumb {
        background-color: rgba(92, 157, 255, 0.2);
      }
    }
  }
}

.message-bubble {
  padding: 0.7rem 1rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  position: relative;

  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
  }

  .message-text {
    font-size: 0.95rem;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
    
    :deep(pre.code-block) {
      margin: 0.8rem 0;
      border-radius: 10px;
      font-size: 0.85em;
      overflow: hidden;
      max-width: 100%;
      background-color: #f8f9fa;
      border: 1px solid #e3e3e3;
      transition: box-shadow 0.3s;
      height: auto; /* 确保高度自适应内容 */
      
      &:hover {
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      }

      [data-theme="dark"] & {
        background-color: #1e1e1e;
        border: 1px solid #3a3a3a;
        
        &:hover {
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        }
      }

      @media (max-width: 768px) {
        font-size: 0.8em;
        margin: 0.6rem 0;
      }
        
        .code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(44, 122, 101, 0.1));
        font-size: 0.9em;
        color: #4a4a4a;
        border-bottom: 1px solid rgba(0,0,0,0.05);
        font-family: 'Fira Code', 'JetBrains Mono', monospace;

        [data-theme="dark"] & {
          background: linear-gradient(135deg, rgba(211, 84, 0, 0.15), rgba(30, 132, 73, 0.15));
          color: #c5c5c5;
          border-bottom-color: rgba(255,255,255,0.1);
        }
        .code-lang {
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #e74c3c;
            
            [data-theme="dark"] & {
              color: #ff6b6b;
            }
        }
      }
      .code-actions {
        display: flex;
        gap: 8px;
      }
      .copy-btn, .run-btn {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        opacity: 0.7;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
        
        &:hover { 
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.05);
          
          [data-theme="dark"] & {
            background-color: rgba(255, 255, 255, 0.1);
          }
        }
      }
      code {
        padding: 12px !important;
        display: block;
        overflow-x: auto;
        font-family: "Roboto Mono","Courier New",'Fira Code', 'JetBrains Mono', monospace;
        margin: 0;
        background-color: inherit;
        color: #333;
        line-height: 1.6;
        scrollbar-width: none;
        font-weight: 500;
        white-space: pre; /* 保持代码格式 */
        
        [data-theme="dark"] & {
          color: #e0e0e0;
        }
      }
    }
      
    :deep(p) {
      margin-bottom: 0.5em;
      &:last-child {
        margin-bottom: 0;
        }
    }
    :deep(ul), :deep(ol) {
      margin: 0.5em 0 0.5em 1.5em;
      padding-left: 1em;
        }
    :deep(li) {
      margin-bottom: 0.25em;
        }
      }
    }

.message-actions {
  display: flex;
  align-items: center;
  margin-top: 0.3rem;
  opacity: 0;
  transition: opacity 0.15s;
  
  .message-container:hover & {
    opacity: 1;
  }

  .action-button {
    color: #615f5f;
    padding: 2px 4px;
    min-height: auto;
    background-color: transparent;
    [data-theme="dark"] & {
      color: #888;
      &:hover { color: #bbb; }
    }
    &:hover {
      color: #555;
    }
    .el-icon {
      font-size: 14px;
    }
  }
  }
  
.message-loading {
  display: flex;
  align-items: center;
  justify-content: start;
  padding: 0.8rem 0;
  min-height: 40px; /* 确保最小高度 */
  
  .loading-circle {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top: 3px solid #333;
    border-radius: 50%;
    animation: circle-spin 1s linear infinite!important;
    
    [data-theme="dark"] & {
      border-color: rgba(255, 255, 255, 0.1);
      border-top-color: #fff;
    }
  }
  
  .loading-text {
    font-size: 0.9rem;
    color: #555;
    display: flex; /* 使用flex布局 */
    align-items: center; /* 垂直居中 */
    height: 20px; /* 固定高度 */
    line-height: 20px; /* 行高与高度一致 */
    white-space: nowrap; /* 防止换行 */
    
    [data-theme="dark"] & {
      color: #bbb;
    }
  }
}

@keyframes circle-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes spinner-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes loading-dots {
  0%, 20% { content: "."; }
  40%, 60% { content: ".."; }
  80%, 100% { content: "..."; }
}

/* 删除旧的thinking-dots样式，使用新的实现 */
.thinking-dots {
  display: inline-flex;
  width: 20px; /* 固定宽度 */
  justify-content: center;
  
  .dot {
    opacity: 0;
    animation: dot-fade 1.5s infinite;
    width: 5px;
    text-align: center;
  }
  
  .dot-1 {
    animation-delay: 0s;
  }
  
  .dot-2 {
    animation-delay: 0.3s;
  }
  
  .dot-3 {
    animation-delay: 0.6s;
  }
}

@keyframes dot-fade {
  0%, 20% { opacity: 0; }
  40% { opacity: 0.4; }
  60% { opacity: 0.7; }
  80%, 100% { opacity: 1; }
}

/* 删除旧的thinking-dots动画 */
// ... existing code ...

.message-editing {
  .editing-actions {
    margin-top: 8px;
    display: flex;
    justify-content: end;
    gap: 8px;
  }
}

.token-count {
    position: absolute;
    bottom: 4px;
    right: 8px;
    font-size: 0.65rem;
    color: rgba(255,255,255,0.8);
    background-color: rgba(0,0,0,0.25);
    padding: 2px 6px;
    border-radius: 4px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
    
    [data-theme="dark"] &.role-assistant & {
        color: rgba(0,0,0,0.6);
        background-color: rgba(255,255,255,0.2);
    }
    .message-container.role-user & {
        color: rgba(255,255,255,0.9);
        background-color: rgba(0,0,0,0.3);
    }
}

:deep(table) {
  margin: 1em 0;
  font-size: 0.9em;
  font-family: sans-serif;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  border: 1px solid #dddddd;
  overflow: auto;
  scrollbar-width: thin;
  width: auto;
  max-width: 100%;
}

:deep(.table-container) {
  overflow-x: auto;
  max-width: 100%;
  margin: 1.5rem 0;
  border-radius: 6px;
  display: block;
}

:deep(thead tr) {
  // Softer gradient for table headers
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.7), rgba(243, 156, 18, 0.7), rgba(44, 122, 101, 0.7));
  color: #ffffff;
  text-align: left;
}

:deep(th) {
  position: relative;
  padding: 12px 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

:deep(th:nth-child(3n+1)) {
  background-color: rgba(231, 76, 60, 0.2);
}

:deep(th:nth-child(3n+2)) {
  background-color: rgba(243, 156, 18, 0.2);
}

:deep(th:nth-child(3n+3)) {
  background-color: rgba(44, 122, 101, 0.2);
}

:deep(th:last-child) {
  border-right: none;
}

:deep(td) {
  padding: 12px 15px;
  border-right: 1px solid #dddddd;
}

:deep(td:last-child) {
  border-right: none;
}

:deep(tbody tr) {
  border-bottom: 1px solid #dddddd;
}

:deep(tbody tr:nth-of-type(even)) {
  background-color: #f8f8f8;
}

:deep(tbody tr:hover) {
  background-color: #f1f1f1;
}

:deep(tbody tr:last-of-type) {
  border-bottom: 2px solid #2c7a65;
}

[data-theme="dark"] {
  :deep(table) {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    border: 1px solid #444;
  }
  
  :deep(thead tr) {
    // Softer gradient for dark mode table headers
    background: linear-gradient(135deg, rgba(192, 57, 43, 0.6), rgba(211, 84, 0, 0.6), rgba(30, 132, 73, 0.6));
    color: #e0e0e0;
  }
  
  :deep(th) {
    border-right: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  :deep(th:nth-child(3n+1)) {
    background-color: rgba(192, 57, 43, 0.2);
  }
  
  :deep(th:nth-child(3n+2)) {
    background-color: rgba(211, 84, 0, 0.2);
  }
  
  :deep(th:nth-child(3n+3)) {
    background-color: rgba(30, 132, 73, 0.2);
  }
  
  :deep(th:last-child) {
    border-right: none;
  }
  
  :deep(td) {
    border-right: 1px solid #444;
  }
  
  :deep(td:last-child) {
    border-right: none;
  }
  
  :deep(tbody tr) {
    border-bottom: 1px solid #444;
  }
  
  :deep(tbody tr:nth-of-type(even)) {
    background-color: #2a2a2a;
  }
  
  :deep(tbody tr:hover) {
    background-color: #333333;
  }
  
  :deep(td), :deep(th) {
    color: #e0e0e0;
  }
}

:deep(.code-block) {
  margin: 1rem 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--code-bg-color);
  border: 1px solid var(--border-color);
  position: relative;
  // 移除可能导致渲染抖动的属性
   
  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: rgba(0,0,0,0.1);
    border-bottom: 1px solid var(--border-color);
    margin-top: -20px;
    
    .code-lang {
      font-size: 0.8rem;
      color: var(--text-color-secondary);
    }
    
    .code-actions {
      display: flex;
      gap: 0.5rem;
      
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.2rem;
        color: var(--text-color-secondary);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background-color: rgba(255,255,255,0.1);
          color: var(--text-color-primary);
        }
      }
    }
  }
  
  code {
    display: block;
    padding: 1rem;
    overflow-x: auto;
    font-family: 'Fira Code', monospace;
    font-size: 0.9rem;
    line-height: 1.5;
  }
}

.code-modal {
  display: none;
  position: fixed;
  z-index: 2000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
  
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 0;
    border: 1px solid #888;
    width: 85%;
    max-width: 800px;
    height: 80vh;
    max-height: 600px;
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    [data-theme="dark"] & {
      background-color: #202123;
      border-color: #444;
    }
  }
  
  .modal-header {
    padding: 10px 10px;
    background-color: #171818e8;
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dee2e6;
    
    h3 {
      margin: 0;
      font-size: 1.2em;
    }
    
    .modal-actions {
      display: flex;
      gap: 10px;
    }
    
    .close-btn, .fullscreen-btn {
      color: #fff;
      font-size: 28px;
      font-weight: bold;
      cursor: pointer;
      line-height: 1;
      
      &:hover, &:focus {
        color: #eee;
        text-decoration: none;
      }
    }
  }
  
  .modal-body {
    flex: 1;
    padding: 0;
    position: relative;
    display: flex;
    flex-direction: column;
  }
  
  #code-sandbox {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    background: #ffffff;
    
    [data-theme="dark"] & {
      background: #333;
    }
  }
  
  #status-bar {
    padding: 8px 15px;
    font-size: 0.9em;
    min-height: 1.5em;
    background-color: #f1f3f5;
    border-top: 1px solid #dee2e6;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 150px;
    overflow-y: auto;
    color: #333;
    
    [data-theme="dark"] & {
      background-color: #2a2a2a;
      border-color: #444;
      color: #ddd;
    }
    
    .status-running {
      color: #007bff;
    }
    
    .status-success {
      color: #28a745;
    }
    
    .status-error {
      color: #dc3545;
      font-weight: bold;
    }
    
    .status-timeout {
      color: #fd7e14;
      font-weight: bold;
    }
    
    .log-message {
      margin-left: 10px;
      font-family: monospace;
      font-size: 0.9em;
      display: block;
      margin-top: 3px;
    }
  }
  
  &.fullscreen .modal-content {
    width: 100% !important;
    height: 100% !important;
    max-width: none;
    max-height: none;
    border-radius: 0;
  }
}

:deep(.code-block-animate) {
  // 移除动画效果
}

:deep(.table-animate) {
  // 移除动画效果
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.typing-effect {
  position: relative;
  display: inline-block;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1.2em;
  background-color: currentColor;
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform-origin: center;
  will-change: opacity, transform;
}

@keyframes blink {
  0%, 100% { 
    opacity: 1;
    transform: scaleY(1);
  }
  40% { 
    opacity: 0.7;
    transform: scaleY(0.95);
  }
  50% { 
    opacity: 0.5;
    transform: scaleY(0.9);
  }
  60% { 
    opacity: 0.7;
    transform: scaleY(0.95);
  }
}

@keyframes thinkingDots {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

/* 加载动画样式 */
.loading-spinner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  .spinner {
    animation: rotate 2s linear infinite;
    width: 20px;
    height: 20px;
    
    .path {
      stroke: #333;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
      
      [data-theme="dark"] & {
        stroke: #fff;
      }
    }
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

@keyframes pulseThinking {
  0% {
    box-shadow: 0 2px 8px rgba(66, 133, 244, 0.1);
    border-color: rgba(66, 133, 244, 0.1);
  }
  100% {
    box-shadow: 0 2px 12px rgba(66, 133, 244, 0.3);
    border-color: rgba(66, 133, 244, 0.3);
  }
}

/* Inline code styles */
:deep(p code), :deep(li code), :deep(h1 code), :deep(h2 code), :deep(h3 code), :deep(h4 code), :deep(h5 code), :deep(h6 code) {
  font-family: 'Fira Code', 'JetBrains Mono', 'Courier New', monospace;
  background-color: rgba(243, 156, 18, 0.1);
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: 500;
  color: #d35400;
  white-space: nowrap;
  
  [data-theme="dark"] & {
    background-color: rgba(44, 122, 101, 0.2);
    color: #2ecc71;
  }
}

// 添加针对平滑渲染的样式
:deep(.pre-sized) {
  opacity: 1; // 始终显示，不使用过渡效果
  
  &.code-visible {
    opacity: 1;
  }
}

:deep(.mermaid-wrapper) { // Targeting the wrapper for Mermaid diagram specific styles
  .mermaid-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    // Applying similar gradient as code block headers
    background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(44, 122, 101, 0.1));
    font-size: 0.9em;
    color: #4a4a4a;
    border-bottom: 1px solid rgba(0,0,0,0.05);
    border-top-left-radius: 8px; // Round corners for the header
    border-top-right-radius: 8px;

    [data-theme="dark"] & {
      background: linear-gradient(135deg, rgba(211, 84, 0, 0.15), rgba(30, 132, 73, 0.15));
      color: #c5c5c5;
      border-bottom-color: rgba(255,255,255,0.1);
    }

    .mermaid-label {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #e74c3c; // Red for mermaid label
      [data-theme="dark"] & {
         color: #ff6b6b; // Lighter red for dark mode
      }
    }

    .copy-btn {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      opacity: 0.7;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
      
      &:hover { 
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
        
        [data-theme="dark"] & {
          background-color: rgba(255, 255, 255, 0.1);
        }
      }
    }
  }
  .mermaid-container {
    border: 1px solid rgba(0,0,0,0.05);
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    overflow: hidden; // Ensure content respects border radius

    [data-theme="dark"] & {
       border-color: rgba(255,255,255,0.1);
    }
    .mermaid {
      padding: 10px; // Add some padding around the diagram itself
      background-color: #fdfdfd; // Slightly off-white background for the diagram area
       min-height: 100px!important; // Ensure it has some default height

      [data-theme="dark"] & {
        background-color: #232425; // Darker background for diagram area in dark mode
      }
    }
  }
}

/* Enhanced loading spinner styles */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 14px;
  margin-left: auto;
  
  .loading-spinner {
    width: 24px;
    height: 24px;
    animation: rotate 1.4s linear infinite;
    
    .path {
      stroke: #4284f5;
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0;
      animation: dash 1.4s ease-in-out infinite;
    }
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 添加优化的引用块样式和新增的Markdown增强样式 */
:deep(blockquote) {
  margin: 1.5rem 0;
  padding: 1rem 1.2rem;
  border-left: 4px solid #ccc;
  background-color: #f8f8f8;
  border-radius: 0 8px 8px 0;
  color: #555;
  position: relative;
  font-size: 0.95em;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  [data-theme="dark"] & {
    background-color: #2d2d33;
    border-left-color: #666;
    color: #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  /* 通用样式 */
  p {
    margin: 0 0 0.5rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  /* 信息引用样式 */
  &.info {
    border-left-color: #42a5f5;
    background-color: rgba(66, 165, 245, 0.1);
    
    &::before {
      content: "ℹ️";
      display: inline-block;
      margin-right: 8px;
      font-size: 1.1em;
    }
    
    [data-theme="dark"] & {
      background-color: rgba(66, 165, 245, 0.15);
      border-left-color: #5c9dff;
    }
  }
  
  /* 警告引用样式 */
  &.warning {
    border-left-color: #f39c12;
    background-color: rgba(243, 156, 18, 0.1);
    
    &::before {
      content: "⚠️";
      display: inline-block;
      margin-right: 8px;
      font-size: 1.1em;
    }
    
    [data-theme="dark"] & {
      background-color: rgba(243, 156, 18, 0.15);
      border-left-color: #f5b041;
    }
  }
  
  /* 错误引用样式 */
  &.error {
    border-left-color: #e74c3c;
    background-color: rgba(231, 76, 60, 0.1);
    
    &::before {
      content: "❌";
      display: inline-block;
      margin-right: 8px;
      font-size: 1.1em;
    }
    
    [data-theme="dark"] & {
      background-color: rgba(231, 76, 60, 0.15);
      border-left-color: #ff6b6b;
    }
  }
}

/* 添加新的键盘快捷键样式 */
:deep(kbd) {
  background-color: #f8f9fa;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0,0,0,.12), 0 2px 0 0 rgba(255,255,255,.7) inset;
  color: #333;
  display: inline-block;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.85em;
  font-weight: 600;
  line-height: 1;
  padding: 2px 5px;
  margin: 0 2px;
  white-space: nowrap;
  letter-spacing: 0.1px;
  
  [data-theme="dark"] & {
    background-color: #2d2d33;
    border-color: #444;
    color: #e0e0e0;
    box-shadow: 0 1px 1px rgba(0,0,0,.3), 0 2px 0 0 rgba(255,255,255,.1) inset;
  }
}

/* 添加新的高亮文本样式 */
:deep(mark) {
  background: linear-gradient(120deg, rgba(243, 156, 18, 0.2), rgba(44, 122, 101, 0.2));
  padding: 2px 5px;
  border-radius: 3px;
  color: inherit;
  
  [data-theme="dark"] & {
    background: linear-gradient(120deg, rgba(211, 84, 0, 0.2), rgba(30, 132, 73, 0.2));
  }
}

/* 添加定义列表样式 */
:deep(dl) {
  margin: 1rem 0;
  padding: 0;
  
  dt {
    font-weight: 700;
    color: #4285f4;
    margin-top: 0.8rem;
    font-size: 1em;
    
    [data-theme="dark"] & {
      color: #5c9dff;
    }
  }
  
  dd {
    margin-left: 1rem;
    padding-left: 0.8rem;
    border-left: 2px solid rgba(66, 133, 244, 0.2);
    padding-bottom: 0.5rem;
    
    [data-theme="dark"] & {
      border-left-color: rgba(92, 157, 255, 0.2);
    }
  }
}

/* 缩略引用块 (折叠/展开) */
:deep(.details-wrapper) {
  margin: 1rem 0;
  border: 1px solid rgba(66, 133, 244, 0.2);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  [data-theme="dark"] & {
    border-color: rgba(92, 157, 255, 0.2);
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
  
  .details-summary {
    padding: 12px 16px;
    background-color: rgba(66, 133, 244, 0.05);
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(66, 133, 244, 0.1);
    }
    
    &::before {
      content: "▶";
      display: inline-block;
      font-size: 0.8em;
      margin-right: 8px;
      transform: rotate(0);
      transition: transform 0.3s;
    }
    
    &.open::before {
      transform: rotate(90deg);
    }
    
    [data-theme="dark"] & {
      background-color: rgba(92, 157, 255, 0.08);
      
      &:hover {
        background-color: rgba(92, 157, 255, 0.12);
      }
    }
  }
  
  .details-content {
    padding: 0 16px;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s, padding 0.5s;
    
    &.open {
      max-height: 1000px;
      padding: 16px;
    }
  }
}

/* 美化角标样式 */
:deep(sup), :deep(sub) {
  font-size: 0.75em;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

:deep(sup) {
  top: -0.5em;
  
  a {
    color: #4285f4;
    text-decoration: none;
    padding: 0 2px;
    border-radius: 3px;
    
    &:hover {
      background-color: rgba(66, 133, 244, 0.1);
    }
    
    [data-theme="dark"] & {
      color: #5c9dff;
      
      &:hover {
        background-color: rgba(92, 157, 255, 0.15);
      }
    }
  }
}

:deep(sub) {
  bottom: -0.25em;
}

/* 新增自定义水平分割线样式 */
:deep(hr) {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(66, 133, 244, 0), rgba(66, 133, 244, 0.75), rgba(66, 133, 244, 0));
  margin: 1.5rem 0;
  
  [data-theme="dark"] & {
    background-image: linear-gradient(to right, rgba(92, 157, 255, 0), rgba(92, 157, 255, 0.75), rgba(92, 157, 255, 0));
  }
}

/* 添加文件树样式 */
:deep(.file-tree) {
  font-family: 'Roboto Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 1rem 0;
  padding: 10px;
  background-color: rgba(66, 133, 244, 0.03);
  border-radius: 6px;
  border: 1px solid rgba(66, 133, 244, 0.1);
  overflow-x: auto;
  
  [data-theme="dark"] & {
    background-color: rgba(92, 157, 255, 0.05);
    border-color: rgba(92, 157, 255, 0.2);
  }
  
  .tree-item {
    position: relative;
    padding-left: 20px;
    white-space: nowrap;
    
    &::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 0;
      border-left: 1px dotted rgba(66, 133, 244, 0.5);
      height: 100%;
      
      [data-theme="dark"] & {
        border-left-color: rgba(92, 157, 255, 0.5);
      }
    }
    
    &:last-child::before {
      height: 50%;
    }
    
    .tree-label::before {
      content: '';
      position: absolute;
      left: 8px;
      top: 50%;
      width: 12px;
      border-bottom: 1px dotted rgba(66, 133, 244, 0.5);
      
      [data-theme="dark"] & {
        border-bottom-color: rgba(92, 157, 255, 0.5);
      }
    }
    
    &.folder .tree-label {
      font-weight: 600;
      color: #fbbc05;
      
      [data-theme="dark"] & {
        color: #ffc107;
      }
    }
    
    &.file .tree-label {
      color: #34a853;
      
      [data-theme="dark"] & {
        color: #4caf50;
      }
    }
  }
}

.message-bubble {
  // ... existing code ...
  
  .message-text {
    // ... existing code ...
    
    // 添加用户消息文本样式
    .user-message-text {
      white-space: pre-wrap;
      word-break: break-word;
      line-height: 1.5;
      font-family: var(--font-family);
    }
  }
  
  // ... existing code ...
}

/* 消息统计信息 */
.message-stats {
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  padding-top: 4px;
  font-size: 10px;
  color: #999;
  opacity: 0.8;
  text-align: left;
  font-family: 'Roboto Mono', monospace, system-ui;
  letter-spacing: -0.3px;
  
  .stat-item {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    padding: 0 2px;
  }
}

/* 扩展Markdown样式 - 流程图/思维导图/甘特图 */
:deep(.flowchart-wrapper),
:deep(.mindmap-wrapper),
:deep(.gantt-wrapper) {
  margin: 1.5rem 0;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  border: 1px solid #e0e0e0;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  [data-theme="dark"] & {
    background-color: #2a2a2a;
    border-color: #444;
  }
  
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    
    [data-theme="dark"] & {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
  }
  
  .mermaid {
    display: flex;
    justify-content: center;
    min-height: 100px;
    width: 100%;
    
    svg {
      max-width: 100%;
    }
  }
  
  .flowchart-hint,
  .mindmap-hint,
  .gantt-hint {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 5;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    
    [data-theme="dark"] & {
      background-color: rgba(42, 42, 42, 0.9);
    }
    
    &.hidden {
      opacity: 0;
      visibility: hidden;
    }
    
    .flowchart-hint-icon,
    .mindmap-hint-icon,
    .gantt-hint-icon {
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .flowchart-hint-text,
    .mindmap-hint-text,
    .gantt-hint-text {
      font-size: 14px;
      color: #666;
      
      [data-theme="dark"] & {
        color: #aaa;
      }
    }
  }
}

/* 高亮样式 */
:deep(mark) {
  background-color: rgba(255, 255, 0, 0.3);
  padding: 2px 4px;
  border-radius: 3px;
  
  [data-theme="dark"] & {
    background-color: rgba(255, 255, 0, 0.2);
    color: #f0f0f0;
  }
}

/* 脚注样式 */
:deep(.footnote-ref) {
  font-size: 80%;
  vertical-align: super;
  line-height: 0;
  
  a {
    color: #4284f5;
    text-decoration: none;
    padding: 0 2px;
    
    &:hover {
      text-decoration: underline;
    }
    
    [data-theme="dark"] & {
      color: #5c9dff;
    }
  }
}

:deep(.footnotes) {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eaeaea;
  font-size: 0.9rem;
  
  [data-theme="dark"] & {
    border-top-color: #444;
  }
  
  ol {
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
    
    p {
      display: inline;
    }
    
    .footnote-backref {
      margin-left: 5px;
      color: #888;
      
      &:hover {
        color: #4284f5;
      }
      
      [data-theme="dark"] & {
        color: #aaa;
        
        &:hover {
          color: #5c9dff;
        }
      }
    }
  }
}

/* 键盘快捷键样式增强 */
:deep(kbd) {
  background-color: #f7f7f7;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  color: #333;
  display: inline-block;
  font-family: monospace;
  font-size: 0.85em;
  line-height: 1;
  padding: 2px 4px;
  margin: 0 2px;
  
  [data-theme="dark"] & {
    background-color: #333;
    border-color: #555;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
    color: #eee;
  }
}

/* 文件树样式增强 */
:deep(.file-tree) {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #4284f5;
  font-family: monospace;
  
  [data-theme="dark"] & {
    background-color: #2a2a2a;
    border-left-color: #5c9dff;
  }
  
  .tree-item {
    margin: 4px 0;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
      
      [data-theme="dark"] & {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
    
    .tree-label {
      cursor: default;
      display: flex;
      align-items: center;
      
      &::before {
        content: '';
        display: inline-block;
        width: 2px;
        height: 100%;
        margin-right: 8px;
        background-color: #ddd;
        
        [data-theme="dark"] & {
          background-color: #555;
        }
      }
    }
    
    &.folder .tree-label {
      font-weight: 600;
      color: #e74c3c;
      
      [data-theme="dark"] & {
        color: #ff6b6b;
      }
    }
    
    &.file .tree-label {
      color: #333;
      
      [data-theme="dark"] & {
        color: #ddd;
      }
    }
  }
}

/* 详情块样式增强 */
:deep(.details-wrapper) {
  margin: 1.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  overflow: hidden;
  
  [data-theme="dark"] & {
    background-color: #2d2d33;
    border-color: #444;
  }
  
  .details-summary {
    padding: 10px 15px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
    position: relative;
    
    [data-theme="dark"] & {
      background-color: #333;
    }
    
    &:hover {
      background-color: #eaeaea;
      
      [data-theme="dark"] & {
        background-color: #3a3a3a;
      }
    }
    
    &::after {
      content: '▼';
      font-size: 10px;
      margin-left: auto;
      transition: transform 0.2s ease;
    }
    
    &.open {
      border-bottom-color: #e0e0e0;
      
      [data-theme="dark"] & {
        border-bottom-color: #444;
      }
      
      &::after {
        transform: rotate(180deg);
      }
    }
  }
  
  .details-content {
    padding: 0;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease, padding 0.3s ease;
    
    &.open {
      padding: 15px;
      max-height: 500px;
      overflow-y: auto;
    }
  }
}

// ... existing code ...

/* 增强图片样式 - 点击放大效果 */
:deep(.enhanced-image-container) {
  margin: 1rem 0;
  position: relative;
  display: inline-block;
  max-width: 100%;
  
  img {
    max-width: 100%;
    height: auto;
    border-radius: 6px;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.1);
    
    [data-theme="dark"] & {
      border-color: rgba(255, 255, 255, 0.1);
    }
    
    &:hover {
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      
      [data-theme="dark"] & {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
    }
  }
  
  .enhanced-image-caption {
    font-size: 0.85rem;
    color: #666;
    text-align: center;
    margin-top: 0.5rem;
    font-style: italic;
    
    [data-theme="dark"] & {
      color: #aaa;
    }
  }
}

/* 移除旧的全屏模态框样式，改由JavaScript动态添加内联样式 */

// ... existing code ...
</style>

