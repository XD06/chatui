import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'

// Load environment variables
const isProduction = process.env.NODE_ENV === 'production'
const isVercel = process.env.VERCEL === '1'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 启用 Gzip 和 Brotli 压缩，但在Vercel上禁用以加快构建
    isProduction && !isVercel && viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // 10KB
      deleteOriginFile: false, // Don't delete original files
    }),
    isProduction && !isVercel && viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false, // Don't delete original files
    }),
    // 仅在需要时启用包分析
    process.env.ANALYZE && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  
  // 设置scss的api类型为modern-compiler
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables.scss" as *;`,
      }
    },
    // CSS代码拆分
    modules: {
      scopeBehaviour: 'local'
    }
  },
  
  // 配置依赖优化选项
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia', 'element-plus', 'vue-demi'],
  },
  
  // 路径别名
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-demi': resolve(__dirname, 'node_modules/vue-demi/lib/index.mjs'),
    }
  },
  
  // 构建优化
  build: {
    // 在Vercel上使用更快的构建设置
    minify: isVercel ? 'esbuild' : 'terser',
    terserOptions: isVercel ? undefined : {
      compress: {
        drop_console: isProduction,
        drop_debugger: isProduction,
        pure_funcs: isProduction ? ['console.log', 'console.info'] : []
      },
      format: {
        comments: false
      }
    },
    
    // 设置chunk大小警告阈值
    chunkSizeWarningLimit: 2000,
    
    // 启用代码分割和CSS提取
    cssCodeSplit: true,
    
    // 配置资源URL加载策略
    assetsInlineLimit: 4096, // 4KB以下内联
    
    // 禁用源映射以减小文件大小
    sourcemap: false,
    
    // 分包处理
    rollupOptions: {
      output: {
        // 提升异步包的加载速度
        manualChunks: {
          'vendor-core': ['vue', 'vue-router', 'pinia'],
          'vendor-ui': ['element-plus', '@element-plus/icons-vue'],
          'vendor-markdown': ['highlight.js', 'markdown-it']
        },
        
        // 静态资源分类打包
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
            return 'assets/img/[name]-[hash][extname]'
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
            return 'assets/fonts/[name]-[hash][extname]'
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]'
          }
          return `assets/other/[name]-[hash][extname]`
        }
      }
    },
    
    // 生成manifest
    manifest: true,
  },
  
  // 开发服务器配置
  server: {
    port: 3000,
    open: true,
    cors: true,
    strictPort: false,
    
    // 添加gzip压缩
    compress: true,
    
    // HMR改进
    hmr: {
      overlay: true,
      clientPort: 3000
    }
  },
  
  // 预览配置，优化Netlify/Vercel部署
  preview: {
    port: 5000,
    strictPort: false,
    cors: true,
    host: true
  },
  
  // 确保Vercel能正确构建Vue应用
  base: '/'
})
