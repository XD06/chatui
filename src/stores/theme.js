import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('theme', {
  // State
  state: () => ({
    isDarkMode: false,
    theme: {
      userMessageGradient: ['#e74c3c', '#f39c12', '#2c7a65'],
      fontSize: 16,
      fontFamily: 'default',
      customFontFamily: '',
      appliedFontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }
  }),

  // Actions
  actions: {
    updateTheme(newSettings) {
      this.theme = {
        ...this.theme,
        ...newSettings
      }
      
      // 持久化到 localStorage
      this.saveThemeToLocalStorage()
    },
    
    resetTheme() {
      this.theme = {
        userMessageGradient: ['#e74c3c', '#f39c12', '#2c7a65'],
        fontSize: 16,
        fontFamily: 'default',
        customFontFamily: '',
        appliedFontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }
      
      // 持久化到 localStorage
      this.saveThemeToLocalStorage()
    },
    
    saveThemeToLocalStorage() {
      localStorage.setItem('app-theme-settings', JSON.stringify(this.theme))
    },
    
    loadThemeFromLocalStorage() {
      const savedTheme = localStorage.getItem('app-theme-settings')
      if (savedTheme) {
        try {
          const parsedTheme = JSON.parse(savedTheme)
          this.theme = {
            ...this.theme,
            ...parsedTheme
          }
        } catch (e) {
          console.error('加载主题设置失败:', e)
        }
      }
    }
  },

  // Persist settings to localStorage
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'theme-settings',
        storage: localStorage
      }
    ]
  }
}) 