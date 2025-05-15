<template>
  <!-- 聊天输入容器 -->
  <div class="chat-input-container">
    <!-- 移动端风格的简洁输入框 -->
    <div class="mobile-input-wrapper" v-if="isMobileView">
      <button class="input-icon-btn mic-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
          <line x1="12" y1="19" x2="12" y2="23"></line>
          <line x1="8" y1="23" x2="16" y2="23"></line>
        </svg>
      </button>
      <input 
        v-model="messageText"
        class="mobile-input"
        type="text"
        :placeholder="placeholder"
        @keydown.enter.exact.prevent="handleSend"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        autocapitalize="off"
      />
      <!-- 添加删除按钮 -->
      <button 
        class="input-icon-btn delete-btn" 
        @click="handleClear"
        @touchend.prevent="handleClearTouch"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
      <button 
        class="input-icon-btn send-btn" 
        @click="handleSend"
        @touchend.prevent="handleSendTouch"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
    
    <!-- 桌面端输入框和工具栏 -->
    <div v-else class="desktop-input-container">
      <!-- 明确分隔的工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <div class="toolbar-btn role-btn" @click.stop="toggleRolePrompt" title="快速选择AI角色">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE1klEQVR4nO2be4hVRRjAf1u6JqvpRpa4PU0r1JCwcv/wAT2IMNGCTNBKiiQyKSrKCsR/tgeUZLHGYhBBD4oUxEdK4CMVNXpuTzHD3PCPSsvaWNPyxgffhcMwc87cc+ece8zzg4Hde2a++ea7c+b7Zua7UFJSUpINg4GrgDuAp4GVwDbgc2AfcAj4W8sh/ewzrSN1O4C5KkNkFZ5BwPXAs8DHwL9AJWARA3UBtwGtFISBqtAa4FjgAceVf4DtwPxGzY5xwKvAXzkO2lV6gRXA2DwGfg2wATjhoViffkui3BPALKAdGAWcp9O4n5ZW/WyU1pmlbVaojD6P/kSn9cDVWQy8DXg3YeAyLbcADwMTgeaA/TerYR4BtmpfcYZ4BxgRqvN5wJGYDmVVvx8YRn6cAywAvojR63fgrhCdVRzlfWASjWcysDFGz7qpGGUPcC3F4zrVLXMDDKC4DMjDAC7O1EVqp7qmP4Bu4BngAmrnQg2qulXWceCw/v98jMyGGOBm4GCCS3wMaPLoT+os8nB9YpSZKfWtiUqCwAcjYe9+YJ3OAltk2JVghCb1/Wa7T4BbgbOBs4D7gJ91HzG5kQa4U/3uB8BU49n5wHuW9vJKuHjOUv9loL+lrgRPa4FvjZgjNwNcBvR4+NoXLTIk0jO53VLvlQTZpwPLgLs99E1NxSHwHmC4R/vTgE2GDDGcSY9RZ2cN0eQMD31TUwkgcITu+asyDiQY4LeUniOUvpkIvEkHeUD/rvV5oQ1wMbAU+EpjgF79+wV9lpY0cnM3wEJ1Ry5/Lc8eSNFvWrm5G2BBgqJHdbdYK2nlNuQVuEinZXdkqlZDVnmWljRyC7sI5kVpAMoZQPkKUK4BlIsgpRegdIMEoNdwK3IJGkXuBltozL2kHMVFGWTo+meIjvYZQkcbz0fqtfYV5MflwG7t29QlqqvoXjc7DKHTLHWW6EyRWyQfllgCFvnMh3nal63+JEPmLgKw3BD6kmM6VmfKawmvhG3wPkZoUdnVb1b6NHnckPcmAZhpCP1Bj7lMpkfqfA2MqXHwcUYYozKrdaQvGxsMWZI/UDdDLEfcckRtY02kjvlK+AzeZoTqlK8+kz5sDNctctx6lZo3DMEfOc73R3re5actfZaFz2XgbwjIBIsy93oqErK41oihelESrZvmECYW8/067EhCiC6IPgPyNZhr4UMXZjM3wIxX6ma0ZXpvd9zaTK/x2/Qxgmvha7dkjDxFRiy2KNZJ4ximx+hRffZmeYXfT/OATCOIYfLmDGCzoYfcU96YdcfnAj9ZjPAo+SGv3WqLDpJPkAsTHIlTHZ45APV+8ystfW/SGZobUxyJkq+rkkmY7Xxo1TQ5s2235g3kzg265TQV2q2JjyENMB743tJur+ctdabZo79YFJM4YXYAAzRpTG+bbV9qEmfDuRT4zuG/33Zkd/sYoE3zEW1yt2oEWBiGGJuhaOmxuKc4A8hi9lBMhmpn4FTcYDSp4q4N0SrgkhgDSPtb9Arc1v6I/gCj8IwFPnUM4qgjGWqaZoO5QuG1mnh10tCsGWFxmd0+RRbYOZzEjAc+TDHw45pXmGcWeqbIbu5Hj4Gf0N8miGf539GiB5e2uEGO3d4CruQUYDDwJPCrnuR0FCWgyZuBRfXnJSWcGvwH9Aa6pQMH/okAAAAASUVORK5CYII=" alt="anonymous-mask">
          </div>

          <!-- 这里可以添加更多的工具按钮 -->
           <div class = "toolbar-btn"><!--预留生图模式-->
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2ZTYiNURjHf75G8r2QJjQmMwuzmRQSCiVKkg2WmpLP2KEUhowFG5nE2JndbDS7WUmaZLJSKIQwpSiaMYxxm5mjU8+p0+m99573686Zen/1dO993/Px/M/7Puc851woKCgoCJ1GoAsYBMYBlbONS1/3pO9U7AZGauC0KmO/gF1pRn4qnVeWiIYkAroCcF6J3U0iYDAAx5XY5yQCahGwytO0L7FRgVls8nDiD3ARWAPUyeclYHQ6CNDObyrT12YPEVMuQI98JdpDF6BfF8N14DfQYV1rCl2AfucNI9YiZZg7nZ5Ah4i4Zl1rDl2Anm0qcSV0AaMy20SxBfhbSwE6AM8DrcByYAfw0FNEuwSsjokmGflqzmcq4Aewvkydyzk8OZWlgG8y6pU4G6qAr0CLdX8mcAf4Duxx6p4BJkMS8EWmOcMsoNu6/w/Y79Q/BkxEPMHjwFpgBbAX6M9bwEdnbzoH6InooAQccto4bKXlH4DVEf3MBh7kJeAtsMq6VldlttHOtjntHAReASsr9DUD6MxawGug3vo9D+jzGCn92hyNGGW7nV7ZZa1zRNzOUsAy6/t84FGMgNMBfDqizQXAY6vcT2CjU+ZGVgIMi2IEmm0DTgK3GHgaUW4Y2OqRViRiCfAsgfP9ItxuZ6DKZmen0/e5tAKWAs8TOP8EWOi8ii886o0B+xwfTlrrSWxeJnC+T4LUUC+TgW/9sQgRJ0REbOI63yubEoOeft8laKcEHHB8actbQI8scAZ9FPg+gfPKWk/0IpgK34OtbkktDM2SeqiUNgEcSSPA52jxviR1hhZJ+lRGNgmcSiqg2uFup6yehlbJTLNyXlki3JjwolFODaIavemU3SAbHZWDDTspTeo/OK46ZfQ+dygn54eAbaSkQc7nPwEXnHvbc/gTpAS8AW45mXBBQUEB4fEfLQH7e+z+yuEAAAAASUVORK5CYII=" alt="image">
      </div>
      <div class = "toolbar-btn">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAADi0lEQVR4nO2aO2gVQRSGv4j4SMT4yLUQfBQ2wYCFFr4KUVARI/iCBEFFiWB8FRaKICIJiCgoWIgSjKnEVGpQEIkJFgaNLxBtVIIoiVpo1PiKxpWBE7kMs7sze2dvUtwfptmdc2a/e3Zmzpy9UFBBBeVTZcA64CjQDLQCD6S1y7V6YL30HVYqAWqBO8AfILBsf4EOsS0dSoBxQB3w0eHhw1qvRKo03xAbgbceAPTWA1TnA2AMcC4FAL01ySubiiYCdz0/8GOZK6Z794GMbwi1wjxJ4ZdfBMwBWkLuP/cJM0pWJN8QA8CUrHG2Ap8N/e4BxT5Azqc0Dy4ZxioH3hj6NuYKsTwlCBXhCSFjzgBeGWyqkkIUhzi0bT9khctux4FKYETM2BXAV81fd9J95kiOv/oHclO1wafaNJ00Gng3xCBKNw0ZgFNUNnuYBz5Ayg35204XBz6WWxVRH2rR/KpN2ToZ7PcAcsMTSKVh/7E6AqxI+OBfss4el4FpFmONtNyQv2ljqfNMrOoN+VCXBUgb7joLTLXo166NpY4PsbqoGZ0EZlrAJAFRNi9lE4zSCW0sFfFYXdeMdsv1OJikIMr2NTArot9+bSwVoVh1akabsu5Nj9jtcwEZPFRVhPTboo310Mb5I81IZaXZsnnNwlomAkS195LW61qdBETfQw4a+kRFJheQAPgEzDeMecA1+s2a41Mh/ZJExgYkkHPJ4ggYq8lepzm9FdHXFcYWJAD6gKWGMfdI3SxWGzSHP2W39wHjAhIA34FVhjGjnue/JksakO1wTYyN7ZxxBQmAX7Y7uUkdmrOrFjYrUwIJgN9J6127DM7mxdgsSREkkHR+mytIqRxish2pdDpKC1MGCaQGpmrFTtKTR9W2x8ytPymDBAKjUhanqPRoTlQ6PTvCpiEFkE5gh6FNyrUA0BWR4KnKyxXPIH2uDx2mJoPz7ogET2kBcDgBSCPwwmB3yAdIiRSUdedqMagBikLsMo4gZ8TXXoNdj1R2clZGCsqm0LeGRMcF5FjWtfEhNWDnpTdMZVJQDltJFNBa+YbiAmJ6bU4bbJ9FRN9ZxfIeR03OfgFusAAxZbjIYqKnSUFI3pWTqmTCu+4BLt86rhnsb5OCSiXl700JZFmIj7lpwAwC1UoFcMAjSBHw1ODjAnn8w0CdnOLatD8MuH4WqNE24n22Z5HhprFyQq2yrEoWVBCe9Q+0MIxCOXC1GgAAAABJRU5ErkJggg==" alt="internet">
      </div>
           <div class= "toolbar-btn">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="23" height="23" viewBox="0 0 64 64"
style="fill:#FAB005;">
<path d="M 5 8 L 5 51 C 5 53.209 6.791 55 9 55 L 53.398438 55 C 55.445437 55 57.162953 53.455922 57.376953 51.419922 L 61 17 L 53 17 L 53 13 L 25 13 L 20 8 L 5 8 z M 56 21 L 53 51 L 11 51 L 14.042969 28.943359 L 30.224609 28.363281 L 33.355469 21.552734 L 56 21 z"></path>
</svg></div>
        </div>
        <div class="toolbar-right">
          <!-- 右侧工具按钮 -->
        </div>
      </div>

    <!-- 输入框和按钮的组合 -->
    <div class="input-wrapper">
        <!-- 预览区域 - 只在有选择的文件时显示 -->
        <div class="preview-list" v-if="selectedFiles.length">
          <div v-for="(file, index) in selectedFiles" :key="index" class="preview-item">
            <!-- 图片预览 -->
            <img v-if="isImage(file)" :src="getPreviewUrl(file)" class="preview-image"/>
            <!-- 文件名预览 -->
            <div v-else class="file-preview">
              <el-icon><Document /></el-icon>
              <span>{{ file.name }}</span>
            </div>
            <!-- 删除按钮 -->
            <el-button 
              class="delete-btn" 
              type="danger" 
              :icon="Delete" 
              circle
              @click="removeFile(index)"
            />
        </div>
      </div>

      <div class="input-control-area">
        <el-input
          v-model="messageText"
          type="textarea"
          :rows="2"
          :autosize="{ minRows: 2, maxRows: 5 }"
          :placeholder="placeholder"
          resize="none"
          @keydown.enter.exact.prevent="handleSend"
          @keydown.enter.shift.exact="newline"
          @input="adjustHeight"
          ref="inputRef"
        />
        
        <div class="button-group">
            <!-- 修改上传按钮直接触发文件选择 -->
          <el-tooltip content="上传文件" placement="top">
              <div class="upload-button-wrapper">
                <el-upload
                  ref="uploadRef"
                  :action="null"
                  :auto-upload="false"
                  :on-change="handleFileChange"
                  :show-file-list="false"
                  multiple
                >
            <el-button
              circle
              :icon="Upload"
            />
                </el-upload>
              </div>
          </el-tooltip>
          
          <el-tooltip content="清空对话" placement="top">
            <el-button
              circle
              type="danger"
              :icon="Delete"
              @click="handleClear"
            />
          </el-tooltip>
          
          <!-- 添加优化提示词按钮 -->
          <el-tooltip content="优化提示词" placement="top">
            <el-button
              circle
              type="info"
              :class="{ 
                'is-loading': isOptimizing, 
                'optimize-btn-pulse': shouldPulseOptimizeBtn && !isOptimizing 
              }"
              @click="handleOptimizePrompt"
            >
              <el-icon><MagicStick /></el-icon>
            </el-button>
          </el-tooltip>
          
          <el-button
            class="send-button"
            :class="{ 'pause-button': isGenerating }"
            type="primary"
            @click="isGenerating ? handlePause() : handleSend()"
          >
            <template #icon>
              <el-icon>
                <component :is="isGenerating ? 'VideoPause' : 'Position'"></component>
              </el-icon>
            </template>
            {{ isGenerating ? '暂停' : '发送' }}
          </el-button>
        </div>
      </div>
    </div>
    <!-- Token计数器 -->
      <div class="token-counter" v-if="!isMobileView">
      已使用 Token: {{ tokenCount.total }} (提示: {{ tokenCount.prompt }}, 回复: {{ tokenCount.completion }})
      <el-tooltip content="Token 计算基于本地算法，可能与实际使用略有差异" placement="top">
        <el-icon class="info-icon"><InfoFilled /></el-icon>
      </el-tooltip>
      </div>
    </div>
    
    <!-- 角色选择浮层，像三点菜单一样实现 -->
    <transition name="fade">
      <div class="role-popup-container" v-if="showRolePrompt">
        <div class="role-overlay" @click="toggleRolePrompt"></div>
        <div class="role-popup" ref="rolePopup">
          <div class="role-prompt-header">
            <h4>选择AI角色</h4>
            <el-button type="text" @click="toggleRolePrompt">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
          
          <div class="role-categories">
            <div 
              v-for="(category, index) in roleCategories" 
              :key="index"
              class="role-category"
              :class="{ active: activeCategoryIndex === index }"
              @click="activeCategoryIndex = index"
            >
              {{ category.name }}
            </div>
          </div>
          
          <div class="role-list">
            <div 
              v-for="(role, index) in activeCategory.roles" 
              :key="index"
              class="role-item"
              @click="selectRole(role)"
            >
              <div class="role-icon" :style="{ backgroundColor: role.color }">
                {{ role.icon || role.name.charAt(0) }}
              </div>
              <div class="role-info">
                <div class="role-name">{{ role.name }}</div>
                <div class="role-desc">{{ role.description }}</div>
              </div>
              <!-- 编辑按钮 - 只显示在用户创建的角色上 -->
              <el-button 
                v-if="role.isUserCreated" 
                type="text" 
                class="edit-role-btn"
                @click.stop="editRole($event, role)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <!-- 删除按钮 - 只显示在用户创建的角色上 -->
              <el-button 
                v-if="role.isUserCreated" 
                type="text" 
                class="delete-role-btn"
                @click.stop="deleteRole($event, role)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- 自定义角色编辑器 -->
    <el-dialog
      v-model="showCustomRoleEditor"
      title="自定义系统提示词"
      width="90%"
      max-width="550px"
      class="custom-role-dialog"
    >
      <el-form :model="customRoleForm" label-position="top">
        <el-form-item label="角色名称">
          <el-input v-model="customRoleForm.name" placeholder="例如: 旅游规划师" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="customRoleForm.description" placeholder="简短描述这个角色的功能" />
        </el-form-item>
        <el-form-item label="系统提示词">
          <el-input
            v-model="customRoleForm.prompt"
            type="textarea"
            :autosize="{ minRows: 5, maxRows: 10 }"
            placeholder="在这里输入详细的系统提示词，指导AI如何回答你的问题..."
          />
          <div class="prompt-tips">
            系统提示词将指导AI如何回应你的问题。<br>
            例如: "你是一位旅游规划专家，帮助用户制定详细的旅行计划，包括景点、交通和预算。"
          </div>
        </el-form-item>
        <el-form-item label="颜色标签">
          <el-color-picker v-model="customRoleForm.color" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCustomRoleEditor = false">取消</el-button>
          <el-button type="primary" @click="saveCustomRole">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Delete, Position, Upload, Plus, Document, InfoFilled, VideoPause, Close, Edit, MagicStick } from '@element-plus/icons-vue'
import { Avatar } from '@element-plus/icons-vue'
import { useChatStore } from '../stores/chat'
import { useSettingsStore } from '../stores/settings'
import { ElMessageBox, ElMessage } from 'element-plus'
import { messageHandler } from '../utils/messageHandler'
import { checkBackendAvailability } from '../utils/apiService'
import { promptTemplates } from '../config/promptTemplates'

// 定义组件的属性
const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  availableRoles: {
    type: Array,
    default: () => []
  }
})

// 定义组件的事件
const emit = defineEmits(['send', 'clear', 'role-selected', 'pause'])

// 使用聊天存储
const chatStore = useChatStore()
// 使用设置存储
const settingsStore = useSettingsStore()
// 消息文本的响应式引用
const messageText = ref('')
// 是否正在生成消息的状态
const isGenerating = ref(false)
// 是否正在优化提示词的状态
const isOptimizing = ref(false)
// 存储原始消息，以便在需要时恢复
const originalMessage = ref('')

// 监听loading属性变化
watch(() => props.loading, (newValue) => {
  isGenerating.value = newValue
})

// 检测是否为移动端视图
const isMobileView = ref(window.innerWidth <= 768)

// 监听窗口大小变化来改变移动端视图状态
const handleResize = () => {
  isMobileView.value = window.innerWidth <= 768
}

// 组件挂载时添加窗口大小变化监听器
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize() // 初始化检查
  loadCustomRoles() // 加载自定义角色
})

// 组件销毁前移除监听器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 输入框的占位符
const placeholder = computed(() => {
  return isMobileView.value ? '输入聊天内容...' : `输入消息，按Enter发送\nShift + Enter 换行`;
});

// 计算属性，用于获取聊天存储中的Token计数
const tokenCount = computed(() => chatStore.tokenCount)

// 监听输入框内容变化，实时计算token
const currentInputTokens = computed(() => {
  return messageText.value ? messageHandler.countTokens(messageText.value) : 0
})

const showUpload = ref(false)
const selectedFiles = ref([])

// 角色选择功能
const showRolePrompt = ref(false)
const rolePopup = ref(null)
const activeCategoryIndex = ref(0)

// 使用promptTemplates中的模板替换硬编码提示词
const roleCategories = ref([
  {
    name: '通用',
    roles: [
      { name: '通用助手', description: '一个通用的AI助手', prompt: promptTemplates.aiassistant, color: '#4285F4' },
      { name: '绘画助手', description: '使用请帮我画一幅XX的画的格式', prompt: promptTemplates.Picturer, color: '#DB4437' },
      { name: '编程助手', description: '提供高质量代码和技术解决方案', prompt: promptTemplates.programmer, color: '#F4B400' },
      { name: '自定义', description: '创建自定义系统提示词', prompt: '', color: '#34A853', isCustom: true }
    ]
  },
  {
    name: '专业领域',
    roles: [
      { name: '数据分析师', description: '数据洞察和可视化分析', prompt: promptTemplates.dataAnalyst, color: '#0F9D58' },
      { name: '产品经理', description: '产品规划和用户体验设计', prompt: promptTemplates.productManager, color: '#AB47BC' },
      { name: '商业策略顾问', description: '商业分析和战略规划', prompt: promptTemplates.businessStrategist, color: '#FF7043' },
      { name: '市场营销专家', description: '营销策略和品牌建设', prompt: promptTemplates.marketingExpert, color: '#00ACC1' }
    ]
  },
  {
    name: '教育与发展',
    roles: [
      { name: '教育导师', description: '学习方法和知识传授', prompt: promptTemplates.educationMentor, color: '#00B8D4' },
      { name: '面试教练', description: '面试准备和职业发展', prompt: promptTemplates.interviewCoach, color: '#E65100' },
      { name: '领导力教练', description: '领导力提升和团队管理', prompt: promptTemplates.leadershipCoach, color: '#311B92' },
      { name: '语言学习顾问', description: '语言学习策略和方法', prompt: promptTemplates.languageLearningAdvisor, color: '#9C27B0' }
    ]
  },
  {
    name: '技术与创新',
    roles: [
      { name: '科技趋势分析师', description: '前沿技术评估和预测', prompt: promptTemplates.techTrendAnalyst, color: '#FF5722' },
      { name: 'AI伦理专家', description: 'AI技术伦理与治理', prompt: promptTemplates.aiEthicsExpert, color: '#3F51B5' },
      { name: '创意思维顾问', description: '创新思考和问题解决', prompt: promptTemplates.creativityConsultant, color: '#FFC107' },
      { name: '情感专家', description: '情感咨询和建议', prompt: promptTemplates.emotionalExpert, color: '#FF5722' },
    ]
  },
  {
    name: '健康与生活',
    roles: [
      { name: '健康顾问', description: '健康生活方式指导', prompt: promptTemplates.healthAdvisor, color: '#4CAF50' },
      { name: '心理健康顾问', description: '心理健康教育和支持', prompt: promptTemplates.psychologyConsultant, color: '#EC407A' },
      { name: '旅行规划师', description: '旅行计划和目的地建议', prompt: promptTemplates.travelPlanner, color: '#039BE5' },
      { name: '财务顾问', description: '个人财务规划和管理', prompt: promptTemplates.financialAdvisor, color: '#8D6E63' }
    ]
  }
])

const activeCategory = computed(() => roleCategories.value[activeCategoryIndex.value])

// 新增：自定义角色相关状态
const showCustomRoleEditor = ref(false)
const customRoleForm = ref({
  name: '自定义角色',
  description: '我的自定义提示词',
  prompt: '',
  color: '#34A853'
})
const editingRole = ref(null)

// 切换角色提示面板
const toggleRolePrompt = () => {
  showRolePrompt.value = !showRolePrompt.value
}

// 修改：选择角色函数，处理自定义角色
const selectRole = (role) => {
  if (role && role.isCustom) {
    // 如果是自定义角色，打开编辑器
    customRoleForm.value = {
      name: '自定义角色',
      description: '我的自定义提示词',
      prompt: '',
      color: '#34A853'
    }
    editingRole.value = null
    showCustomRoleEditor.value = true
    return
  }
  
  if (role && role.prompt) {
    showRolePrompt.value = false // 选择后关闭角色面板
    ElMessage.success(`已选择角色: ${role.name}`)
    // 触发角色选择事件，传递角色对象
    emit('role-selected', role)
  }
}

// 新增：编辑现有角色
const editRole = (event, role) => {
  // 阻止冒泡，避免触发selectRole
  event.stopPropagation()
  
  customRoleForm.value = {
    name: role.name,
    description: role.description,
    prompt: role.prompt,
    color: role.color
  }
  editingRole.value = role
  showCustomRoleEditor.value = true
}

// 新增：删除角色
const deleteRole = (event, role) => {
  // 阻止冒泡，避免触发selectRole
  event.stopPropagation()
  
  ElMessageBox.confirm(
    `确定要删除角色 "${role.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 用户确认删除
    if (role.id && settingsStore.deleteCustomRole(role.id)) {
      // 更新UI中的自定义角色列表
      const customCategoryIndex = roleCategories.value.findIndex(cat => cat.name === '自定义')
      if (customCategoryIndex !== -1) {
        roleCategories.value[customCategoryIndex].roles = [...settingsStore.customRoles]
        
        // 如果删除后没有自定义角色了，切换到第一个分类
        if (settingsStore.customRoles.length === 0) {
          activeCategoryIndex.value = 0
        }
      }
      
      ElMessage.success('角色已删除')
    } else {
      ElMessage.error('删除失败，角色未找到')
    }
  }).catch(() => {
    // 用户取消删除，不执行任何操作
  })
}

// 加载自定义角色列表
const loadCustomRoles = () => {
  // 检查是否已有自定义角色分类
  let customCategoryIndex = roleCategories.value.findIndex(cat => cat.name === '自定义')
  
  // 如果没有自定义分类但有自定义角色，创建分类
  if (customCategoryIndex === -1 && settingsStore.customRoles && settingsStore.customRoles.length > 0) {
    roleCategories.value.push({
      name: '自定义',
      roles: []
    })
    customCategoryIndex = roleCategories.value.length - 1
  }
  
  // 如果有自定义分类，加载存储中的自定义角色
  if (customCategoryIndex !== -1) {
    roleCategories.value[customCategoryIndex].roles = settingsStore.customRoles
  }
}

// 保存自定义角色
const saveCustomRole = () => {
  if (!customRoleForm.value.prompt.trim()) {
    ElMessage.warning('系统提示词不能为空')
    return
  }
  
  const roleData = {
    name: customRoleForm.value.name || '自定义角色',
    description: customRoleForm.value.description || '自定义提示词',
    prompt: customRoleForm.value.prompt,
    color: customRoleForm.value.color || '#34A853',
    isUserCreated: true
  }
  
  let newRole
  
  // 如果是编辑现有角色
  if (editingRole.value && editingRole.value.id) {
    // 更新存储中的角色
    settingsStore.updateCustomRole(editingRole.value.id, roleData)
    newRole = settingsStore.customRoles.find(r => r.id === editingRole.value.id)
  } else {
    // 添加新角色到存储
    newRole = settingsStore.addCustomRole(roleData)
  }
  
  // 确保自定义角色分类存在
  let customCategoryIndex = roleCategories.value.findIndex(cat => cat.name === '自定义')
  if (customCategoryIndex === -1) {
    roleCategories.value.push({
      name: '自定义',
      roles: []
    })
    customCategoryIndex = roleCategories.value.length - 1
  }
  
  // 更新UI中的角色列表
  roleCategories.value[customCategoryIndex].roles = [...settingsStore.customRoles]
  
  // 关闭编辑器并提示成功
  showCustomRoleEditor.value = false
  ElMessage.success(editingRole.value ? '角色已更新' : '自定义角色已创建')
  
  // 切换到自定义分类
  activeCategoryIndex.value = customCategoryIndex
  
  // 如果是新创建的角色，立即选中它
  if (!editingRole.value) {
    selectRole(newRole)
  }
  
  editingRole.value = null
}

// 修改 handleFileChange 函数以在选择文件后显示预览
const handleFileChange = (file) => {
  selectedFiles.value.push(file.raw)
  // 如果需要，可以在这里添加文件预览的逻辑
}

// 移除文件
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

// 判断是否为图片文件
const isImage = (file) => {
  return file.type.startsWith('image/')
}

// 获取预览URL
const getPreviewUrl = (file) => {
  return URL.createObjectURL(file)
}

// 处理暂停生成
const handlePause = () => {
  console.log('按钮事件: 暂停生成');
  try {
    emit('pause');
    isGenerating.value = false;
    ElMessage.info('已暂停生成回复');
  } catch (error) {
    console.error('暂停生成失败:', error);
    ElMessage.error('暂停生成失败');
    isGenerating.value = false; // 确保状态重置
  }
}

// 处理发送消息 (通用)
const handleSend = async () => {
  console.log('[ChatInput] handleSend called, message:', messageText.value ? messageText.value.substring(0, 20) + '...' : '(empty)');
  
  // 检查消息是否为空
  if (messageText.value.trim() === '' && selectedFiles.value.length === 0) {
    console.log('[ChatInput] handleSend aborted: empty message and no files');
    return;
  }
  
  // 如果已经在生成中，显示通知
  if (isGenerating.value) {
    console.log('[ChatInput] handleSend: already generating, show notification');
    ElMessage.info('正在生成回复，请稍候...');
    return;
  }
  
  try {
    // 处理文件上传
    const fileContents = await Promise.all(
      selectedFiles.value.map(async (file) => {
        if (isImage(file)) {
          return await convertImageToBase64(file)
        } else {
          return await readFileContent(file)
        }
      })
    )

    // 组合消息内容
    let content = messageText.value
    if (fileContents.length > 0) {
      content = content + '\n' + fileContents.join('\n')
    }

    console.log('[ChatInput] Emitting send event with content');
    emit('send', content)
    isGenerating.value = true
    messageText.value = ''
    selectedFiles.value = []
    showUpload.value = false
  } catch (error) {
    console.error('[ChatInput] Send failed:', error)
    ElMessage.error('发送失败，请重试')
  }
}

// 将图片转换为base64
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(`![${file.name}](${e.target.result})`)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// 读取文件内容
const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(`\`\`\`\n${e.target.result}\n\`\`\``)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

// 处理换行的函数
const newline = (e) => {
  messageText.value += '\n'
  // 可以在这里添加代码以保持光标可见
}

// 处理清空对话的函数
const handleClear = () => {
  console.log('Clear button clicked');
  ElMessageBox.confirm('确定要清空当前对话记录吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    console.log('Emitting clear event');
    emit('clear');
  }).catch(() => {
    // 用户取消，不执行任何操作
    console.log('Clear cancelled');
  });
};

// 处理移动端发送按钮的 touchstart 事件
const handleSendTouch = (event) => {
    // 阻止事件冒泡和默认行为，防止触发 click
    event.stopPropagation();
    event.preventDefault();
    handleSend(); // 调用通用的发送逻辑
}

// 处理移动端清空按钮的 touchstart 事件
const handleClearTouch = (event) => {
    // 阻止事件冒泡和默认行为，防止触发 click
    event.stopPropagation();
    event.preventDefault();
    handleClear(); // 调用通用的清空逻辑
}

// 输入框自适应高度
const inputRef = ref(null)
const adjustHeight = () => {
  if (inputRef.value) {
    // 这里可以根据需要调整高度逻辑，暂时留空
  }
}

// 新增状态变量用于控制优化按钮的跳动闪烁
const shouldPulseOptimizeBtn = ref(false);
let pulseTimeoutId = null;

// 监听输入框内容变化，当用户输入内容时触发闪烁效果
watch(messageText, (newVal, oldVal) => {
  // 只有当输入内容有实际变化且不为空时才闪烁
  if (newVal !== oldVal && newVal.trim() && !isOptimizing.value) {
    shouldPulseOptimizeBtn.value = true;
    
    // 清除上一个倒计时
    if (pulseTimeoutId) {
      clearTimeout(pulseTimeoutId);
    }
    
    // 5秒后停止闪烁
    pulseTimeoutId = setTimeout(() => {
      shouldPulseOptimizeBtn.value = false;
    }, 5000);
  }
  
  // 如果输入框为空，停止闪烁
  if (!newVal.trim()) {
    shouldPulseOptimizeBtn.value = false;
  }
});

// 优化处理优化提示词函数的反馈
const handleOptimizePrompt = async () => {
  // 检查消息是否为空
  if (!messageText.value.trim()) {
    ElMessage.warning('请先输入消息内容');
    return;
  }
  
  // 如果已经在生成中或优化中，显示通知
  if (isGenerating.value || isOptimizing.value) {
    ElMessage.info('正在处理中，请稍候...');
    return;
  }
  
  // 显示加载中通知
  let loadingMessageInstance = null;
  
  try {
    // 设置优化中状态
    isOptimizing.value = true;
    shouldPulseOptimizeBtn.value = false; // 优化时停止闪烁
    
    // 显示加载中通知 - 使用变量存储实例而不是常量
    loadingMessageInstance = ElMessage({
      type: 'info',
      message: '正在优化提示词，请稍候...',
      duration: 0,
      showClose: true
    });
    
    // 保存原始消息
    originalMessage.value = messageText.value;
    
    // 使用提示词模板而不是硬编码的提示词
    const optimizePrompt = `优化下面的内容，使其成为更清晰、更具体，以便获得更好回答的提示词(不要添加解释,不要用markdown包裹)：\n\n${messageText.value}`;
    
    // 获取API密钥和端点 - 优先使用settingsStore中的值
    const apiKey = settingsStore.apiKey;
    const apiEndpoint = settingsStore.apiEndpoint;
    
    // 判断是否使用自定义API
    const useCustomApi = settingsStore.userCustomizedAPI;
    
    console.log('优化提示词 - 设置:', {
      userCustomizedAPI: useCustomApi,
      apiKey: apiKey ? '已设置' : '未设置',
      apiEndpoint: apiEndpoint
    });
    
    // 调用API优化提示词 - 传递userCustomizedAPI参数
    const response = await messageHandler.optimizePrompt(
      optimizePrompt,
      apiKey,
      apiEndpoint,
      {
        model: settingsStore.model,
        temperature: 0.7,
        max_tokens: 2000
      },
      useCustomApi // 传递自定义API标志
    );
    
    // 更新输入框内容为优化后的提示词
    if (response && response.content) {
      messageText.value = response.content.trim();
      
      // 确保在显示成功消息前关闭加载消息
      if (loadingMessageInstance) {
        loadingMessageInstance.close();
        loadingMessageInstance = null;
      }
      
      // 显示成功消息
      ElMessage.success({
        message: '提示词已优化',
        duration: 1500
      });
    } else {
      throw new Error('优化失败，未收到有效响应');
    }
    
  } catch (error) {
    console.error('优化提示词失败:', error);
    
    // 确保在显示错误消息前关闭加载消息
    if (loadingMessageInstance) {
      loadingMessageInstance.close();
      loadingMessageInstance = null;
    }
    
    ElMessage.error(`优化失败: ${error.message || '未知错误'}`);
    // 恢复原始消息
    messageText.value = originalMessage.value;
  } finally {
    // 确保加载消息被关闭
    if (loadingMessageInstance) {
      loadingMessageInstance.close();
    }
    // 清除优化中状态
    isOptimizing.value = false;
  }
}

// 在组件卸载时清除所有计时器
onUnmounted(() => {
  if (pulseTimeoutId) {
    clearTimeout(pulseTimeoutId);
    pulseTimeoutId = null;
  }
});
</script>

<style lang="scss" scoped>
// 移动端输入框样式
.mobile-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--chat-input-bg, #f5f5f7);
  border-radius: 24px;
  padding: 8px 16px;
  margin: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  
  /* Fix for iOS and Android devices */
  &:active, &:focus-within {
    background-color: var(--chat-input-bg, #f5f5f7) !important;
    outline: none !important;
  }
  
  .mobile-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 16px;
    padding: 8px 12px;
    outline: none;
    color: var(--text-color, #333);
    
    &::placeholder {
      color: var(--placeholder-color, #888);
      font-size: 15px;
    }
    
    /* Fix for white box on focus in mobile */
    &:focus {
      outline: none;
      background-color: transparent !important;
      box-shadow: none !important;
      -webkit-appearance: none;
      -webkit-tap-highlight-color: transparent;
    }
  }
  
  .input-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--icon-color, #666);
    padding: 8px;
    transition: color 0.2s;
    /* Enhanced touch target for mobile */
    min-width: 44px;
    min-height: 44px;
    position: relative;
    
    /* Active state feedback for touch */
    &:active {
      transform: scale(0.95);
    }
    
    &:hover {
      color: var(--icon-hover-color, #333);
    }
    
    &.send-btn {
      color: var(--primary-color, #1890ff);
      
      &:hover {
        color: var(--primary-hover-color, #40a9ff);
      }
      
      &:active {
        color: var(--primary-active-color, #096dd9);
      }
    }
    
    &.delete-btn {
      color: var(--danger-color, #ff4d4f);
      
      &:hover {
        color: var(--danger-hover-color, #ff7875);
      }
      
      &:active {
        color: var(--danger-active-color, #d9363e);
      }
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
}

// 聊天输入容器的样式
.chat-input-container {
  background-color: transparent;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  margin-top: auto;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;

  // 移动端优化
  @media (max-width: 768px) {
    padding: 8px 0;
    position: sticky;
    bottom: 0;
    background-color: var(--bg-color, #ffffff);
    z-index: 100;
    
    /* Prevent white box on tap in mobile browsers */
    &:active, &:focus-within {
      -webkit-tap-highlight-color: transparent;
      outline: none;
    }
    
    /* Fix for iOS auto-zoom on input focus */
    input, textarea {
      font-size: 16px; /* Prevent iOS zoom on focus */
      -webkit-appearance: none;
    }
  }
}

// 桌面端容器
.desktop-input-container {
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

// 全新的工具栏样式
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 35px;
  padding: 0 16px;
  margin-bottom: 10px;
  background-color: transparent;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #eaeaea;
  
  .toolbar-left, .toolbar-right {
  display: flex;
  align-items: center;
    gap: 30px;
  }
  
  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #ebebeb;
    }
    
    img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      display: block;
    }
  }
  
  .role-btn {
  background-color: transparent;
    
    &:hover {
      background-color: #e0e8f0;
    }
  }
}

// 输入区与按钮的容器
.input-wrapper {
  position: relative;
  border-radius: 12px;
  background-color: var(--chat-input-bg, #ffffff);
        display: flex;
        flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    box-shadow: none;
    border-radius: 12px;
    margin-bottom: 0;
  }
}

// 输入控制区域
.input-control-area {
  display: flex;
  align-items: flex-end;
  width: 100%;
  background-color: var(--chat-input-bg, #f0f2f5);
  border: 1px solid var(--border-color, #e0e0e6);
  border-radius: 8px;
  padding: 4px 8px;
  box-sizing: border-box;
  overflow: hidden;
  transition: all 0.3s ease;


  @media (max-width: 768px) {
    border-radius: 16px;
    margin-bottom: 5px;
    padding: 0;
    background-color: var(--chat-input-bg, #ffffff);
    border: 1px solid var(--border-color, #dcdfe6);
  }

  :deep(.el-textarea__inner) {
    resize: none;
    padding: 10px 12px;
    border: none !important;
    background-color: transparent !important;
    box-shadow: none !important;
    font-size: 0.95rem;
    line-height: 1.5;
    min-height: calc(0.95rem * 1.5 + 20px);
    max-height: 150px;
    color: var(--text-color, #333);
    transition: all 0.3s ease;
    scrollbar-width: none;
    &::placeholder {
      color: var(--placeholder-color, #888);
    }

    @media (max-width: 768px) {
      padding: 10px 12px;
      min-height: 50px;
      font-size: 0.9rem;
    }
  }
}

// 按钮组样式
.button-group {
  display: flex;
        align-items: center;
  gap: 8px;
  margin-left: 8px;
  padding-bottom: 5px;

  .el-button {
    &.is-circle {
      background-color: var(--button-icon-bg, #e9e9eb);
      border-color: var(--button-icon-bg, #e9e9eb);
      color: var(--button-icon-color, #606266);
      margin: 0px;
  transition: all 0.3s ease;
      
      &:hover {
        background-color: var(--button-icon-hover-bg, #dcdfe6);
        border-color: var(--button-icon-hover-bg, #dcdfe6);
      }
    }
  }

  @media (max-width: 768px) {
    position: absolute;
    right: 0;
    bottom: 5px;
    padding-right: 8px;
    gap: 4px;
    margin-left: 0;
    padding-bottom: 0;
    
    .el-button {
      padding: 6px !important;
      font-size: 12px !important;
      height: auto !important;
        .el-icon {
        font-size: 16px !important;
      }
      span:not(.el-icon) {
        display: none;
      }
    }
  }
}

// 发送按钮特定样式
.send-button {
  padding: 8px 12px;
  background-color: var(--primary-color, #007bff);
  border-color: var(--primary-color, #007bff);
  color: white;
  border-radius: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-hover-color, #0056b3);
    border-color: var(--primary-hover-color, #0056b3);
  }
  
  &.pause-button {
    background-color: #f56c6c;
    border-color: #f56c6c;
    &:hover {
      background-color: #f78989;
      border-color: #f78989;
    }
  }

  @media (max-width: 768px) {
    padding: 8px !important;
    min-width: 32px !important;

    span:not(.el-icon) {
      display: none;
    }
    background-color: var(--el-color-primary);
    border-color: var(--el-color-primary);
    &:hover {
      background-color: var(--el-color-primary-light-3);
      border-color: var(--el-color-primary-light-3);
    }
  }
}

// Token计数器样式
.token-counter {
  font-size: 0.75rem;
  color: var(--text-secondary, #888);
  text-align: right;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  transition: all 0.3s ease;
  gap: 4px;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    margin-top: 2px;
    opacity: 0.7;
  }
  
  .info-icon {
    cursor: help;
    font-size: 14px;
  }
}

// 角色选择浮层
.role-popup-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    align-items: flex-end;
}

.role-popup {
    background-color: var(--popup-bg, #ffffff);
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    width: 450px;
    max-width: 80vw;
    max-height: 70vh;
    overflow-y: auto;
    z-index: 2;
    transition: all 0.3s ease;
    
    @media (max-width: 768px) {
      width: 100%;
      max-width: 100%;
      max-height: 80vh;
      border-radius: 16px 16px 0 0;
    }
  }
}

// 角色分类与列表
  .role-categories {
    display: flex;
  overflow-x: auto;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid var(--border-color, #eaeaea);
  scrollbar-width: thin;
    
    .role-category {
      padding: 6px 12px;
    border-radius: 16px;
      cursor: pointer;
    white-space: nowrap;
    background-color: var(--category-bg, #f5f5f7);
    color: var(--text-color, #333);
    transition: all 0.3s ease;
      
      &.active {
      background-color: var(--primary-color, #1890ff);
      color: white;
      }
    }
  }
  
  .role-list {
  padding: 10px;
    
    .role-item {
      display: flex;
      align-items: center;
    gap: 10px;
    padding: 10px;
      border-radius: 8px;
      cursor: pointer;
    transition: background-color 0.2s;
      
      &:hover {
      background-color: var(--item-hover-bg, #f5f5f7);
      }
      
      .role-icon {
        width: 40px;
        height: 40px;
      border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
      font-weight: bold;
      }
      
      .role-info {
        flex: 1;
        
        .role-name {
          font-weight: 500;
        color: var(--text-color, #333);
        }
        
        .role-desc {
        font-size: 0.8rem;
        color: var(--text-secondary, #888);
      }
    }
  }
}

// 角色提示弹窗标题
.role-prompt-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color, #eaeaea);
  
  h4 {
    margin: 0;
    font-size: 16px;
    color: var(--text-color, #333);
    text-align: center;
    flex:1;
  }
}

// 淡入淡出动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 暗色模式
[data-theme="dark"] {
  .toolbar {
    background-color: #2d2d30;
    border-color: #3e3e41;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    
    .toolbar-btn {
      background-color: #3a3a3c;
      
      &:hover {
        background-color: #4a4a4c;
      }
    }
    
    .role-btn {
      background-color: #383840;
      
      &:hover {
        background-color: #464652;
      }
    }
  }
  
  .mobile-input-wrapper {
    background-color: var(--dark-input-bg, #2c2c2e);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    
    .mobile-input {
      color: var(--dark-text-color, #e0e0e0);
      
      &::placeholder {
        color: var(--dark-placeholder-color, #888);
      }
    }
    
    .input-icon-btn {
      color: var(--dark-icon-color, #aaa);
        
        &:hover {
        color: var(--dark-icon-hover-color, #ccc);
      }
      
      &.send-btn {
        color: var(--primary-color, #1890ff);
        
        &:hover {
          color: var(--primary-hover-color, #40a9ff);
        }
      }
      
      &.delete-btn {
        color: var(--dark-danger-color, #ff4d4f);
        
        &:hover {
          color: var(--dark-danger-hover-color, #ff7875);
        }
      }
    }
  }

  .input-wrapper {
    background-color: var(--dark-input-bg, #2d2d33);
  }
  
  .input-control-area {
    background-color: var(--dark-input-bg, #2c2c2e);
    border-color: var(--dark-border-color, #3c3c3e);

    
    :deep(.el-textarea__inner) {
      color: var(--dark-text-color, #e0e0e0);
      //scrollbar-width: none;
      
      &::placeholder {
        color: var(--dark-placeholder-color, #777);
      }
    }
  }
  
  .button-group {
    .el-button {
      background-color: var(--dark-button-bg, #353740);
      border-color: var(--dark-button-border, #424450);
      color: var(--dark-button-color, #aaa);
      
      &:hover {
        background-color: var(--dark-button-hover-bg, #424450);
        color: var(--dark-button-hover-color, #ddd);
      }
    }
  }
  
  .token-counter {
    color: var(--dark-text-secondary, #777);
  }
  
  .upload-area {
    background-color: var(--dark-input-bg, #2d2d33);
    border-color: var(--dark-border-color, #424450);
  }
  
  .role-popup {
    background-color: var(--dark-popup-bg, #202123);
    border-color: var(--dark-border-color, #353740);
  }
  
  .role-categories {
    border-color: var(--dark-border-color, #353740);
    
    .role-category {
      background-color: var(--dark-category-bg, #353740);
      color: var(--dark-text-color, #ddd);
      
      &.active {
        background-color: var(--primary-color, #1890ff);
        color: white;
      }
    }
  }
  
  .role-list {
    .role-item {
      &:hover {
        background-color: var(--dark-item-hover-bg, #353740);
      }
      
      .role-info {
        .role-name {
          color: var(--dark-text-color, #ddd);
        }
        
        .role-desc {
          color: var(--dark-text-secondary, #888);
        }
      }
    }
  }
  
  .role-prompt-header {
    border-color: var(--dark-border-color, #353740);
    
    h4 {
      color: var(--dark-text-color, #ddd);
    }
  }
}

// 文件预览列表样式
.preview-list {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid #eaeaea;
  
  [data-theme="dark"] & {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: #3e3e41;
  }
  
  .preview-item {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #eaeaea;
    background-color: #fff;
    
    [data-theme="dark"] & {
      border-color: #3e3e41;
      background-color: #2d2d30;
    }
    
    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .file-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      padding: 10px;
      text-align: center;
      
      .el-icon {
        font-size: 24px;
        margin-bottom: 5px;
        color: #909399;
      }
      
      span {
        font-size: 0.8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 90%;
      }
    }
    
    .delete-btn {
      position: absolute;
      top: 5px;
      right: 5px;
      padding: 4px;
      font-size: 12px;
      background-color: rgba(255, 255, 255, 0.8);
      border: none;
      
      &:hover {
        background-color: #f56c6c;
        color: white;
      }
      
      [data-theme="dark"] & {
        background-color: rgba(45, 45, 48, 0.8);
        
        &:hover {
          background-color: #f56c6c;
        }
      }
    }
  }
}

// 上传按钮包装器样式
.upload-button-wrapper {
  display: inline-block;
  
  :deep(.el-upload) {
    display: block;
  }
}

/* 自定义角色编辑器样式 */
.custom-role-dialog {
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .prompt-tips {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
    line-height: 1.4;
  }
}

/* 角色项编辑按钮 */
.role-item {
  position: relative;
  
  .edit-role-btn {
    position: absolute;
    right: 8px;
    top: 8px;
    padding: 4px;
    color: #909399;
    opacity: 0.6;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
  
  .delete-role-btn {
    position: absolute;
    right: 8px;
    top: 36px;
    padding: 4px;
    color: #F56C6C;
    opacity: 0.6;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
      background-color: rgba(245, 108, 108, 0.1);
    }
  }
}

/* 优化按钮的炫彩动画效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.7);
    transform: scale(1);
    filter: brightness(1);
  }
  25% {
    box-shadow: 0 0 10px 3px rgba(64, 158, 255, 0.6), 0 0 20px 6px rgba(120, 200, 255, 0.4);
    transform: scale(1.03);
    filter: brightness(1.1) hue-rotate(10deg);
  }
  50% {
    box-shadow: 0 0 15px 5px rgba(64, 158, 255, 0.4), 0 0 25px 10px rgba(140, 220, 255, 0.2);
    transform: scale(1.05);
    filter: brightness(1.2) hue-rotate(20deg);
  }
  75% {
    box-shadow: 0 0 10px 3px rgba(64, 158, 255, 0.6), 0 0 20px 6px rgba(120, 200, 255, 0.4);
    transform: scale(1.03);
    filter: brightness(1.1) hue-rotate(10deg);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
    transform: scale(1);
    filter: brightness(1);
  }
}

.optimize-btn-pulse {
  position: relative;
  animation: pulse 2s infinite;
  overflow: visible;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
    z-index: -1;
    opacity: 0.6;
    animation: rotate 3s linear infinite, fade 2s infinite alternate;
  }
  
  &:hover {
    animation: none;
    
    &::before {
      animation: none;
      opacity: 0;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fade {
  0% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.7;
  }
}

/* 暗黑模式下的动画颜色 */
[data-theme="dark"] .optimize-btn-pulse {
  animation-name: pulse-dark;
  
  &::before {
    background: linear-gradient(45deg, #00c6fb, #a139ff, #ff7e84);
    opacity: 0.7;
  }
}

@keyframes pulse-dark {
  0% {
    box-shadow: 0 0 0 0 rgba(84, 178, 255, 0.7);
    transform: scale(1);
    filter: brightness(1);
  }
  25% {
    box-shadow: 0 0 10px 5px rgba(84, 178, 255, 0.6), 0 0 20px 10px rgba(130, 210, 255, 0.4);
    transform: scale(1.03);
    filter: brightness(1.2) hue-rotate(15deg);
  }
  50% {
    box-shadow: 0 0 15px 7px rgba(84, 178, 255, 0.4), 0 0 25px 15px rgba(150, 230, 255, 0.2);
    transform: scale(1.05);
    filter: brightness(1.3) hue-rotate(30deg);
  }
  75% {
    box-shadow: 0 0 10px 5px rgba(84, 178, 255, 0.6), 0 0 20px 10px rgba(130, 210, 255, 0.4);
    transform: scale(1.03);
    filter: brightness(1.2) hue-rotate(15deg);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(84, 178, 255, 0);
    transform: scale(1);
    filter: brightness(1);
  }
}
</style>
