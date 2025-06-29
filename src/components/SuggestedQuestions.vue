<template>
  <div class="suggested-questions" v-if="questions && questions.length">
    <div 
      v-for="(question, index) in questions" 
      :key="index" 
      class="question-item"
      @click="handleClick(question)"
    >
      {{ question }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  questions: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['select']);

const handleClick = (question) => {
  emit('select', question);
};
</script>

<style scoped>
/* 根容器：为建议问题设置基本布局 */
.suggested-questions-container {
  margin: 8px 0 16px 0;
  width: 100%;
  padding-left: 60px; /* 与消息气泡对齐，留出头像空间 */
  max-width: 90%;
}

/* 问题容器：显示为弹性布局，可以自动换行 */
.suggested-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 8px;
  width: 100%;
}

/* 当SuggestedQuestions组件在message-content内部时的特殊样式 */
:global(.suggested-questions-inside) {
  margin-top: 16px;
  margin-left: 0;
  margin-right: 0;
  width: 100%;
}

.question-item {
  background-color: rgba(66, 133, 244, 0.1);
  color: #4285f4;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
  border: 1px solid rgba(66, 133, 244, 0.2);
  user-select: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-bottom: 4px;
}

.question-item:hover {
  background-color: rgba(115, 117, 120, 0.2);
  transform: translateY(-1px);
}

.question-item:active {
  transform: translateY(0);
  background-color: rgba(66, 133, 244, 0.3);
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .question-item {
    background-color: rgba(157, 158, 160, 0.15);
    color:rgb(56, 56, 58);
    border-color: rgba(100, 160, 255, 0.25);
  }
  
  .question-item:hover {
    background-color: rgba(100, 160, 255, 0.25);
  }
  
  .question-item:active {
    background-color: rgba(100, 160, 255, 0.35);
  }
}

/* 移动端优化 */
@media (max-width: 768px) {
  .suggested-questions {
    margin-top: 10px;
    padding-left: 0;
    justify-content: flex-start;
    width: 100%;
    padding-left: 16px;
    max-width: 95%;
  }
  
  .question-pill {
    padding: 6px 12px;
    font-size: 13px;
    margin-bottom: 6px;
  }
}
</style>
