<template>
  <div id="app" :class="{ 'app-loaded': isAppLoaded }">
    <!-- Loading Screen - Will be visible immediately with inline critical styles -->
    <div class="loading-screen" v-if="!isAppLoaded || !resourcesLoaded">
      <div class="loading-content">
        <div class="loading-logo">
          <AppLogo :size="120" color="#000000" />
        </div>
        <h1 class="loading-title">MyChat</h1>
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p class="loading-message">{{ loadingMessage }}</p>
      </div>
    </div>

    <!-- Password Screen - Shown after loading but before authentication -->
    <PasswordScreen v-if="isAppLoaded && resourcesLoaded && !settingsStore.isAuthenticated && authRequired" />

    <!-- Main App Content - Only shown when both app and resources are loaded and authenticated -->
    <router-view v-if="isAppLoaded && resourcesLoaded && (settingsStore.isAuthenticated || !authRequired)" />
    
    <!-- Migration Helper - Will show if old history format is detected -->
    <MigrationHelper v-if="isAppLoaded && resourcesLoaded && (settingsStore.isAuthenticated || !authRequired)" />
    
    <!-- Theme Settings Component -->
    <ThemeSettings v-if="isAppLoaded && resourcesLoaded" />
    
    <!-- 滚动到底部按钮 - 更新为箭头图标 -->
    <!-- <div 
      class="scroll-to-bottom-btn" 
      v-show="showScrollButton" 
      @click="scrollToBottom"
      @touchstart="scrollToBottom"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.41 8.59L12 13.17L16.59 8.59L18 10L12 16L6 10L7.41 8.59Z" fill="white"/>
        <path d="M7.41 15.59L12 20.17L16.59 15.59L18 17L12 23L6 17L7.41 15.59Z" fill="white"/>
      </svg>
    </div> -->
    
    <!-- 暗黑模式切换按钮 -->
   
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, nextTick, watch } from 'vue'
import { useSettingsStore } from './stores/settings'
import AppLogo from './components/AppLogo.vue'
import MigrationHelper from './components/MigrationHelper.vue'
import PasswordScreen from './components/PasswordScreen.vue'
import ThemeSettings from './components/ThemeSettings.vue'
import './assets/mobileFixStyles.css' // Import mobile fixes CSS
import { checkAuthRequired } from './utils/apiService'

const settingsStore = useSettingsStore()
const isAppLoaded = ref(false)
const resourcesLoaded = ref(false)
const loadingMessage = ref('初始化应用...')
const showScrollButton = ref(false)
const isDarkMode = ref(false)
let scrolling = false
let scrollTimeout
let resourceLoadTimeout
const authRequired = ref(false)

// 更新密码所需检查函数
const checkPasswordRequired = async () => {
  try {
    loadingMessage.value = '检查服务器配置...'
    const { authRequired: needsAuth } = await checkAuthRequired()
    authRequired.value = needsAuth
    console.log('服务器密码验证需求:', needsAuth ? '需要' : '不需要')
  } catch (error) {
    console.error('检查密码需求时出错:', error)
    // 安全起见，默认需要密码
    authRequired.value = true
  }
}

// 监听应用加载状态，移除body上的loading类
watch([isAppLoaded, resourcesLoaded], ([appLoaded, resLoaded]) => {
  if (appLoaded && resLoaded) {
    // 只有当两个加载状态都完成时才移除loading类
    document.body.classList.remove('loading')
    console.log('应用和资源加载完成，显示主界面')
  }
})

// 初始化时获取当前主题状态并立即显示加载动画
onBeforeMount(() => {
  console.log('应用初始化开始，添加loading类')
  // 立即添加loading类到body确保加载动画立即显示
  document.body.classList.add('loading')
  
  // 设置主题以确保加载屏幕使用正确的主题
  isDarkMode.value = settingsStore.isDarkMode
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  
  // 创建应用加载超时保障机制
  resourceLoadTimeout = setTimeout(() => {
    if (!resourcesLoaded.value) {
      console.warn('资源加载超时，强制显示主界面')
      resourcesLoaded.value = true
    }
  }, 5000) // 5秒超时保障
})

// 切换主题模式
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'light')
  settingsStore.isDarkMode = isDarkMode.value
}

// 优化的资源预加载函数
const preloadCriticalResources = async () => {
  try {
    loadingMessage.value = '加载核心资源...'
    
    // 预加载关键图片资源
    const preloadImages = [
      '/favicon.ico',
      // Add other critical images here
    ]
    
    // 并行加载所有图片
    await Promise.all(preloadImages.map(src => {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = resolve // 即使加载失败也继续
        img.src = src
      })
    }))
    
    // 一旦核心资源加载完成，更新消息
    loadingMessage.value = '准备界面...'
    
    return true
  } catch (error) {
    console.error('预加载资源时出错:', error)
    return false
  }
}

// 优化的应用初始化流程，确保首先显示加载界面
const initApp = async () => {
  try {
    // 确保加载动画至少显示1秒，以避免闪烁
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 1000))
    
    // 并行预加载关键资源
    const preloadResult = preloadCriticalResources()
    
    // 等待最小加载时间
    await minimumLoadingTime
    
    // 检查是否需要密码验证
    await checkPasswordRequired()
    
    // 标记应用核心已加载
    isAppLoaded.value = true
    
    // 等待资源预加载完成
    loadingMessage.value = '加载资源中...'
    await preloadResult
    
    // 延迟一小段时间使过渡更平滑
    setTimeout(() => {
      // 标记所有资源已加载
      resourcesLoaded.value = true
      
      // 清除保障超时
      if (resourceLoadTimeout) {
        clearTimeout(resourceLoadTimeout)
        resourceLoadTimeout = null
      }
      
      // 初始化滚动相关功能
      setTimeout(() => {
        showScrollButton.value = true
      }, 1000)
    }, 400)
  } catch (error) {
    console.error('应用初始化错误:', error)
    // 即使出错也显示应用
    isAppLoaded.value = true
    resourcesLoaded.value = true
    
    // 清除保障超时
    if (resourceLoadTimeout) {
      clearTimeout(resourceLoadTimeout)
      resourceLoadTimeout = null
    }
  }
}

// 检查是否需要显示滚动按钮
const checkScrollPosition = () => {
  // 标记正在滚动
  scrolling = true
  
  // 清除之前的计时器
  clearTimeout(scrollTimeout)
  
  // 设置新的计时器，滚动停止后才检查位置
  scrollTimeout = setTimeout(() => {
    scrolling = false
    updateScrollButtonVisibility()
  }, 150)
  
  // 如果正在滚动，隐藏按钮
  showScrollButton.value = false
}

// 更新滚动按钮可见性
const updateScrollButtonVisibility = () => {
  // 如果正在滚动，不更新
  if (scrolling) return
  
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = document.documentElement.clientHeight
  
  // 计算距离底部的距离
  const distanceToBottom = scrollHeight - scrollTop - clientHeight
  
  // 测试期间始终显示按钮
  showScrollButton.value = true
  console.log('滚动按钮状态:', showScrollButton.value, '距离底部:', distanceToBottom)
}

// 滚动到页面底部
const scrollToBottom = () => {
  console.log('滚动到底部按钮被点击')
  const scrollHeight = document.documentElement.scrollHeight
  
  // 使用平滑滚动
  window.scrollTo({
    top: scrollHeight,
    behavior: 'smooth'
  })
  
  // 点击后立即隐藏按钮
  showScrollButton.value = false
}

// 在mounted时初始化应用
onMounted(() => {
  console.log('应用组件已挂载，开始初始化流程')
  // 开始初始化
  initApp()
  
  // 监听滚动事件
  window.addEventListener('scroll', checkScrollPosition, { passive: true })
  
  // 初始检查滚动位置
  updateScrollButtonVisibility()
  
  // 添加全局触摸事件处理以防止不需要的行为
  document.addEventListener('touchstart', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // 允许输入框的默认行为
      return;
    }
    
    // 帮助防止在各种移动浏览器中的潜在高亮问题
    if (e.target.classList.contains('mobile-input') ||
        e.target.closest('.mobile-input-wrapper')) {
      e.preventDefault();
    }
  }, { passive: false });
})
</script>

<style lang="scss">
#app {
  font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: transparent !important; /* 确保不覆盖body背景 */
  
  [data-theme="dark"] & {
    background-color: transparent !important; /* 确保不覆盖body背景 */
  }
}

/* Global fix for mobile input highlight issues */
* {
  -webkit-tap-highlight-color: transparent;
}

// 优先加载的关键样式，确保加载动画立即显示
body.loading {
  overflow: hidden;
  margin: 0;
  padding: 0;
  
  /* 确保加载动画页面全屏 - 关键样式 */
  #app {
    visibility: visible !important;
    
    .loading-screen {
      display: flex !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
  }
}

// Optimized Loading Screen Styles
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: inherit; // Use inherited background
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity 0.5s ease;
  will-change: opacity, visibility; // 优化渲染性能
  
  /* Add gradient background for more visual appeal */
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  
  [data-theme="dark"] & {
    background: linear-gradient(135deg, #121212 0%, #1e1e2e 100%);
  }
  
  .loading-content {
    text-align: center;
    max-width: 90%;
    transform: scale(1);
    animation: pulseLoad 2s infinite ease-in-out;
  }
  
  .loading-logo {
    margin-bottom: 20px;
    animation: floatLogo 2s infinite ease-in-out;
    will-change: transform;
    transform: translateZ(0); // Hardware acceleration
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.1));
    
    [data-theme="dark"] & {
      filter: drop-shadow(0 5px 15px rgba(255, 255, 255, 0.1)) brightness(0) invert(1);
    }
  }
  
  .loading-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #333333;
    margin-bottom: 20px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    [data-theme="dark"] & {
      color: #f0f0f0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }
  
  .loading-spinner {
    margin: 20px auto;
    width: 40px;
    height: 40px;
    position: relative;
    
    .spinner {
      width: 100%;
      height: 100%;
      border: 3px solid rgba(0, 0, 0, 0.05);
      border-radius: 50%;
      border-top-color: #000000;
      border-left-color: #000000;
      animation: spinnerAnimation 1.2s linear infinite;
      will-change: transform;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      
      [data-theme="dark"] & {
        border-color: rgba(255, 255, 255, 0.05);
        border-top-color: #000000;
        border-left-color: #000000;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }
    }
  }
  
  .loading-message {
    font-size: 1rem;
    color: #666666;
    margin-top: 20px;
    position: relative;
    font-weight: 500;
    letter-spacing: 0.5px;
    animation: fadeMessage 2s infinite alternate;
    
    [data-theme="dark"] & {
      color: #aaaaaa;
    }
  }
}

// 优化的app加载过渡效果
.app-loaded .loading-screen {
  opacity: 0;
  pointer-events: none;
  visibility: hidden; // 完全隐藏元素
  transition: opacity 0.8s ease, visibility 0.8s ease; // 延长过渡时间
}

// 增强的动画
@keyframes spinnerAnimation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes floatLogo {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.05); }
}

@keyframes pulseLoad {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes fadeMessage {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

// 滚动到底部按钮样式 - 完全重新设计
.scroll-to-bottom-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 55px;
  height: 55px;
  border-radius: 50%;
  background-color: #4284f5;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1999; 
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;
  opacity: 0.95;
  border: 2px solid rgba(255, 255, 255, 0.6);
  
  &:hover {
    transform: translateY(-3px);
    opacity: 1;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  }
  
  &:active {
    transform: translateY(0);
    opacity: 0.9;
  }
  
  svg {
    width: 30px;
    height: 30px;
    // 添加轻微的上下弹跳动画
    animation: bounce 2s ease infinite;
  }
  
  // 深色模式下的样式
  [data-theme="dark"] & {
    background-color: #4284f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
    }
  }
  
  // 移动端样式优化
  @media (max-width: 768px) {
    bottom: 25px;
    right: 25px;
    width: 50px;
    height: 50px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
}

// 主题切换按钮样式
.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 34px;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15));
  
  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    width: 50px;
    height: 28px;
  }
}

// 添加动画
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60% {
    transform: translateY(-2px);
  }
}
</style>

