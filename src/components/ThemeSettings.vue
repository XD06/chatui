<template>
  <div class="theme-settings-container">
    <!-- Theme settings button fixed to the side of the screen -->
    <div 
      class="theme-settings-toggle"
      @click="toggleThemePanel"
      :class="{ 'active': isThemePanelOpen }"
    >
      <el-icon><Brush /></el-icon>
    </div>

    <!-- Theme settings panel -->
    <transition name="theme-panel">
      <div v-if="isThemePanelOpen" class="theme-settings-panel">
        <div class="panel-header">
          <h3>主题设置</h3>
          <el-button type="text" @click="toggleThemePanel">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>

        <div class="panel-content">
          <div class="setting-section">
            <h4>主题模式</h4>
            <div class="theme-toggle-container">
              <div 
                class="theme-option" 
                :class="{ 'active': !settingsStore.isDarkMode }"
                @click="setThemeMode(false)"
              >
                <el-icon><Sunny /></el-icon>
                <span>明亮</span>
              </div>
              <div 
                class="theme-option" 
                :class="{ 'active': settingsStore.isDarkMode }"
                @click="setThemeMode(true)"
              >
                <el-icon><Moon /></el-icon>
                <span>暗黑</span>
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h4>聊天消息样式</h4>
            
            <div class="setting-field">
              <div class="setting-label">用户消息渐变</div>
              <div class="gradient-color-pickers">
                <el-color-picker 
                  v-model="userMessageGradient[0]" 
                  show-alpha 
                  @change="applyUserMessageGradient" 
                />
                <el-color-picker 
                  v-model="userMessageGradient[1]" 
                  show-alpha 
                  @change="applyUserMessageGradient" 
                />
                <el-color-picker 
                  v-model="userMessageGradient[2]" 
                  show-alpha 
                  @change="applyUserMessageGradient" 
                />
              </div>
            </div>
            
            <div class="setting-field">
              <div class="setting-label">聊天字体大小</div>
              <el-slider 
                v-model="fontSize" 
                :min="12" 
                :max="20" 
                :step="1"
                @change="applyFontSize"
              />
            </div>
            
            <div class="setting-field">
              <div class="setting-label">字体选择</div>
              <el-select 
                v-model="fontFamily" 
                placeholder="选择字体" 
                style="width: 100%"
                @change="applyFontFamily"
              >
                <el-option 
                  v-for="font in fontOptions" 
                  :key="font.value" 
                  :label="font.label" 
                  :value="font.value"
                  :style="{ fontFamily: font.value }"
                />
              </el-select>
            </div>
            
            <div class="setting-field" v-if="fontFamily === 'custom'">
              <div class="setting-label">自定义字体</div>
              <el-input 
                v-model="customFontFamily" 
                placeholder="输入字体名称，用逗号分隔多个字体"
                @change="applyCustomFontFamily"
              >
                <template #append>
                  <el-button @click="applyCustomFontFamily">应用</el-button>
                </template>
              </el-input>
              <div class="setting-hint">
                例如: 'Microsoft YaHei', 'PingFang SC', sans-serif
              </div>
            </div>
          </div>

          <div class="setting-section">
            <h4>保存与重置</h4>
            <div class="action-buttons">
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
              <el-button @click="resetSettings">恢复默认</el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay to close panel when clicking outside -->
    <div 
      v-if="isThemePanelOpen" 
      class="theme-overlay" 
      @click="toggleThemePanel"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSettingsStore } from '../stores/theme'
import { useSettingsStore as useMainSettingsStore } from '../stores/settings'
import { ElMessage } from 'element-plus'
import { Brush, Close, Moon, Sunny } from '@element-plus/icons-vue'

// Theme settings store
const settingsStore = useSettingsStore()
// Main settings store (for dark mode)
const mainSettingsStore = useMainSettingsStore()

// Sync dark mode between stores
const syncDarkMode = () => {
  settingsStore.isDarkMode = mainSettingsStore.isDarkMode
}

// Panel state
const isThemePanelOpen = ref(false)

// Chat settings
const userMessageGradient = ref(['#e74c3c', '#f39c12', '#2c7a65'])  // Default user message gradient colors
const fontSize = ref(16)  // Default font size
const fontFamily = ref('default')
const customFontFamily = ref('')

// Font options
const fontOptions = [
  { label: '默认字体', value: 'default' },
  { label: '微软雅黑', value: '\'Microsoft YaHei\', sans-serif' },
  { label: '苹方', value: '\'PingFang SC\', sans-serif' },
  { label: '宋体', value: '\'SimSun\', serif' },
  { label: '黑体', value: '\'SimHei\', sans-serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Roboto', value: 'Roboto, sans-serif' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: '自定义字体', value: 'custom' }
]

// Toggle theme panel
const toggleThemePanel = () => {
  isThemePanelOpen.value = !isThemePanelOpen.value
}

// Set theme mode (light/dark)
const setThemeMode = (isDark) => {
  // Update both stores
  mainSettingsStore.isDarkMode = isDark
  settingsStore.isDarkMode = isDark
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
}

// Apply user message gradient
const applyUserMessageGradient = () => {
  const gradientString = `linear-gradient(244deg, ${userMessageGradient.value.join(', ')})`
  document.documentElement.style.setProperty('--user-message-gradient', gradientString, 'important')
  
  // Save to store
  settingsStore.updateTheme({
    userMessageGradient: [...userMessageGradient.value]
  })
}

// Apply font size
const applyFontSize = () => {
  document.documentElement.style.setProperty('--chat-font-size', `${fontSize.value}px`, 'important')
  
  // Save to store
  settingsStore.updateTheme({
    fontSize: fontSize.value
  })
}

// Apply font family
const applyFontFamily = () => {
  if (fontFamily.value === 'custom') {
    // 如果选择了自定义字体，不立即应用，等待用户输入
    return
  }
  
  const fontToApply = fontFamily.value === 'default' 
    ? '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif'
    : fontFamily.value
  
  document.documentElement.style.setProperty('--font-family', fontToApply, 'important')
  
  // Save to store
  settingsStore.updateTheme({
    fontFamily: fontFamily.value,
    appliedFontFamily: fontToApply
  })
}

// Apply custom font family
const applyCustomFontFamily = () => {
  if (!customFontFamily.value) return
  
  document.documentElement.style.setProperty('--font-family', customFontFamily.value, 'important')
  
  // Save to store
  settingsStore.updateTheme({
    fontFamily: 'custom',
    customFontFamily: customFontFamily.value,
    appliedFontFamily: customFontFamily.value
  })
}

// Save all current settings
const saveSettings = () => {
  // Save other settings
  applyUserMessageGradient()
  applyFontSize()
  
  // Save font settings
  if (fontFamily.value === 'custom') {
    applyCustomFontFamily()
  } else {
    applyFontFamily()
  }
  
  ElMessage.success('主题设置已保存')
}

// Reset all settings to default
const resetSettings = () => {
  // Reset to default values
  userMessageGradient.value = ['#e74c3c', '#f39c12', '#2c7a65']
  fontSize.value = 16
  fontFamily.value = 'default'
  customFontFamily.value = ''
  
  // Clear CSS变量
  document.documentElement.style.removeProperty('--user-message-gradient')
  document.documentElement.style.removeProperty('--chat-font-size')
  document.documentElement.style.removeProperty('--font-family')
  
  // Reset settings in store
  settingsStore.resetTheme()
  
  ElMessage.success('已恢复默认主题设置')
}

// Load settings on component mount
onMounted(() => {
  // Sync dark mode from main settings
  syncDarkMode()
  
  // Load settings from store
  const themeSettings = settingsStore.theme
  
  if (themeSettings) {
    // Load and apply user message gradient
    if (themeSettings.userMessageGradient) {
      userMessageGradient.value = themeSettings.userMessageGradient
      applyUserMessageGradient()
    }
    
    // Load and apply font size
    if (themeSettings.fontSize) {
      fontSize.value = themeSettings.fontSize
      applyFontSize()
    }
    
    // Load and apply font family
    if (themeSettings.fontFamily) {
      fontFamily.value = themeSettings.fontFamily
      
      if (fontFamily.value === 'custom' && themeSettings.customFontFamily) {
        customFontFamily.value = themeSettings.customFontFamily
        applyCustomFontFamily()
      } else {
        applyFontFamily()
      }
    }
  }
})

// Watch for changes in main settings store dark mode
watch(() => mainSettingsStore.isDarkMode, (newValue) => {
  if (settingsStore.isDarkMode !== newValue) {
    settingsStore.isDarkMode = newValue
  }
})

// Watch for changes in theme store dark mode
watch(() => settingsStore.isDarkMode, (newValue) => {
  if (mainSettingsStore.isDarkMode !== newValue) {
    mainSettingsStore.isDarkMode = newValue
    document.documentElement.setAttribute('data-theme', newValue ? 'dark' : 'light')
  }
})
</script>

<style lang="scss" scoped>
.theme-settings-container {
  position: relative;
  z-index: 1000;
}

.theme-settings-toggle {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, #e74c3c, #f39c12, #2c7a65);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 1001;
  
  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &.active {
    background: #fff;
    color: #333;
    border: 2px solid #e74c3c;
    
    [data-theme="dark"] & {
      background: #333;
      color: #fff;
    }
  }
  
  .el-icon {
    font-size: 24px;
  }
  
  // Mobile responsive styles
  @media (max-width: 768px) {
    width: 42px;
    height: 42px;
    right: 15px;
    
    .el-icon {
      font-size: 20px;
    }
  }
}

.theme-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(2px);
}

.theme-settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 340px;
  background-color: white;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow-y: auto;
  
  [data-theme="dark"] & {
    background-color: #2d2d33;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  }
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
    
    [data-theme="dark"] & {
      border-bottom-color: #444;
    }
    
    h3 {
      margin: 0;
      font-size: 18px;
      color: #333;
      
      [data-theme="dark"] & {
        color: #fff;
      }
    }
  }
  
  .panel-content {
    padding: 15px 20px;
  }
  
  // Mobile responsive styles
  @media (max-width: 768px) {
    width: 85%;
    max-width: 320px;
  }
}

.setting-section {
  margin-bottom: 25px;
  
  h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
    
    [data-theme="dark"] & {
      color: #eee;
      border-bottom-color: #444;
    }
  }
}

.setting-field {
  margin-bottom: 15px;
  
  .setting-label {
    font-size: 14px;
    margin-bottom: 8px;
    color: #555;
    
    [data-theme="dark"] & {
      color: #bbb;
    }
  }
  
  .setting-hint {
    font-size: 12px;
    margin-top: 6px;
    color: #888;
    font-style: italic;
    
    [data-theme="dark"] & {
      color: #999;
    }
  }
}

.theme-toggle-container {
  display: flex;
  gap: 10px;
  
  .theme-option {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    [data-theme="dark"] & {
      background-color: #3a3a3a;
    }
    
    .el-icon {
      font-size: 24px;
      color: #555;
      
      [data-theme="dark"] & {
        color: #aaa;
      }
    }
    
    span {
      font-size: 14px;
      color: #555;
      
      [data-theme="dark"] & {
        color: #aaa;
      }
    }
    
    &:hover {
      background-color: #ebebeb;
      
      [data-theme="dark"] & {
        background-color: #444;
      }
    }
    
    &.active {
      background-color: #e6f7ff;
      border: 1px solid #1890ff;
      
      .el-icon, span {
        color: #1890ff;
      }
      
      [data-theme="dark"] & {
        background-color: #111a2c;
        border-color: #177ddc;
        
        .el-icon, span {
          color: #177ddc;
        }
      }
    }
  }
}

.gradient-color-pickers {
  display: flex;
  gap: 10px;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* Transitions */
.theme-panel-enter-active,
.theme-panel-leave-active {
  transition: transform 0.3s ease;
}

.theme-panel-enter-from,
.theme-panel-leave-to {
  transform: translateX(100%);
}
</style> 