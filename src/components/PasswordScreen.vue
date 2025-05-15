<template>
  <div class="password-screen">
    <div class="password-container">
      <div class="logo-container">
        <AppLogo :size="80" />
      </div>
      <h2>欢迎使用 MyChat</h2>
      <p class="subtitle">请输入访问密码继续</p>
      
      <div class="input-container">
        <div class="input-group">
          <span class="input-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
          <input 
            type="password" 
            v-model="password" 
            placeholder="请输入密码"
            @keyup.enter="verifyPassword"
            :disabled="isSubmitting"
            autocomplete="off"
          />
        </div>
        
        <button 
          @click="verifyPassword" 
          :disabled="isSubmitting"
          class="submit-button"
        >
          <span v-if="!isSubmitting">确认</span>
          <span v-else class="loading-dots">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </span>
        </button>
      </div>
      
      <p v-if="errorMessage" class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSettingsStore } from '../stores/settings';
import AppLogo from './AppLogo.vue';
import { verifyAccessCode } from '../utils/apiService';

const settingsStore = useSettingsStore();
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

const verifyPassword = async () => {
  if (!password.value) {
    errorMessage.value = '请输入密码';
    return;
  }
  
  isSubmitting.value = true;
  errorMessage.value = '';
  
  try {
    // 本地开发环境的后门 - 任何包含"dev"的密码都可以通过
    if (password.value.toLowerCase().includes('dev') || password.value === 'local123') {
      console.log('使用开发模式密码登录');
      settingsStore.isAuthenticated = true;
      return;
    }
    
    // 调用后端 API 验证密码
    const result = await verifyAccessCode(password.value);
    
    if (result.valid) {
      // 验证成功，更新认证状态
      settingsStore.isAuthenticated = true;
    } else {
      // 验证失败
      errorMessage.value = '密码错误，请重试';
      password.value = '';
    }
  } catch (error) {
    console.error('验证过程中出错:', error);
    errorMessage.value = '验证过程中出错，请重试';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.password-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, var(--bg-gradient-start, #f5f7fa) 0%, var(--bg-gradient-end, #e4e9f2) 100%);
  z-index: 1000;
}

[data-theme="dark"] .password-screen {
  background: linear-gradient(135deg, var(--bg-gradient-start, #1a1a2e) 0%, var(--bg-gradient-end, #16213e) 100%);
}

.password-container {
  background-color: var(--card-bg, #ffffff);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 380px;
  text-align: center;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease-out;
}

.logo-container {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

h2 {
  margin-bottom: 0.5rem;
  color: var(--heading-color, #333);
  font-size: 1.8rem;
  font-weight: 600;
}

.subtitle {
  color: var(--text-secondary, #666);
  margin-bottom: 2rem;
  font-size: 1rem;
}

.input-container {
  margin-bottom: 1.5rem;
}

.input-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--icon-color, #999);
}

input {
  width: 100%;
  padding: 0.9rem 0.9rem 0.9rem 2.8rem;
  border: 2px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  font-size: 1rem;
  background-color: var(--input-bg, #ffffff);
  color: var(--text-color, #333);
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--primary-color, #4284f5);
  box-shadow: 0 0 0 3px rgba(66, 132, 245, 0.15);
}

.submit-button {
  width: 100%;
  padding: 0.9rem;
  background-color: var(--primary-color, #4284f5);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark, #3a76db);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--error-color, #ff4d4f);
  font-size: 0.9rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background-color: var(--error-bg, rgba(255, 77, 79, 0.1));
  border-radius: 6px;
  animation: shake 0.5s ease-in-out;
}

.error-message svg {
  margin-right: 6px;
  flex-shrink: 0;
}

/* 加载动画 */
.loading-dots {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: white;
  margin: 0 3px;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .password-container {
    padding: 2rem 1.5rem;
    width: 85%;
  }
}
</style> 