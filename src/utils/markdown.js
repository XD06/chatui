import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import mermaidPlugin from './mermaid-plugin'
import taskLists from 'markdown-it-task-lists'
import { registerAllExtensions } from './markdownExtensions.js'

// 创建 markdown-it 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (str, lang) {
    // 对于mermaid代码块跳过高亮，由mermaid插件处理
    if (lang === 'mermaid') {
      return str;
    }
    
    if (lang && hljs.getLanguage(lang)) {
      try {
        // 使用预处理机制，避免代码块突然出现导致的卡顿
        // 统计代码行数，但不设置固定高度
        const lines = str.split('\n');
        const lineCount = lines.length;

        // 移除内联样式预设高度，让代码块自适应内容
        const preClass = `code-block`;
        
        // 延迟高亮处理，先显示原始代码
        const highlighted = hljs.highlight(str, { 
          language: lang, 
          ignoreIllegals: true 
        }).value;
        
        // 添加语言标识和复制按钮，保持与ChatMessage.vue一致
        // 为HTML代码块添加运行按钮
        const isHtml = lang.toLowerCase() === 'html';
        let headerContent = `<span class="code-lang">${lang}</span>
          <div class="code-actions">`;
        
        // 只为HTML代码块添加运行按钮
        if (isHtml) {
          headerContent += `
            <button class="run-btn" title="在沙盒中运行代码">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>`;
        }
        
        // 所有代码块都有复制按钮
        headerContent += `
            <button class="copy-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
          </div>`;
        
        // 添加 data-line-count 属性，用于进一步优化渲染，但不设置min-height
        return `<pre class="${preClass}" data-lang="${lang}" data-line-count="${lineCount}">
          <div class="code-header">
            ${headerContent}
          </div>
          <code>${highlighted}</code>
        </pre>`;
      } catch (__) {}
    }
    
    // 无法识别语言时，使用相同的结构以保持一致性
    const lines = str.split('\n');
    const lineCount = lines.length;
    
    return `<pre class="code-block" data-lang="plaintext" data-line-count="${lineCount}">
      <div class="code-header">
        <span class="code-lang">plaintext</span>
        <div class="code-actions">
        <button class="copy-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        </div>
      </div>
      <code>${md.utils.escapeHtml(str)}</code>
    </pre>`;
  }
})

// 添加任务列表支持
md.use(taskLists, {
  enabled: true,
  label: true,
  labelAfter: true
})

// 添加Mermaid支持
md.use(mermaidPlugin)

// 注册所有自定义扩展
registerAllExtensions(md)

// 自定义引用块渲染器来支持不同类型的提示
const defaultRender = md.renderer.rules.blockquote_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.blockquote_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const nextToken = tokens[idx + 1];
  
  // 检查是否包含特殊标记
  if (nextToken && nextToken.type === 'paragraph_open' && tokens[idx + 2] && tokens[idx + 2].type === 'inline') {
    const content = tokens[idx + 2].content;
    
    // 先清理内容，去除前后空格
    const trimmedContent = content.trim();
    
    // 增强的正则表达式，更灵活地匹配各种格式
    // 1. 可选的感叹号前缀
    // 2. 类型标识符 (info|warning|error)
    // 3. 可选的冒号（中英文都支持）
    // 4. 剩余所有内容作为实际内容
    const match = trimmedContent.match(/^\s*!?\s*(info|warning|error)\s*[:：]?\s*([\s\S]*)/i);
    
    if (match) {
      const type = match[1].toLowerCase();
      // 确保内容不为空
      const actualContent = match[2] ? match[2].trim() : '';
      
      // 调试信息，可在生产环境移除
      console.log('提示框类型:', type, '原始内容:', JSON.stringify(trimmedContent), '处理后:', JSON.stringify(actualContent));
      
      // 更新内容
      tokens[idx + 2].content = actualContent;
      token.attrJoin('class', type);
    }
  }
  
  return defaultRender(tokens, idx, options, env, self);
};

// 自定义图片渲染器来添加点击放大功能
const defaultImageRender = md.renderer.rules.image || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};

md.renderer.rules.image = function(tokens, idx, options, env, self) {
  const token = tokens[idx];
  const src = token.attrGet('src') || '';
  const alt = token.content || '';
  const title = token.attrGet('title') || alt;
  
  // 使用简化的结构，确保生成正确的HTML
  return `<div class="enhanced-image-container">
    <img src="${src}" alt="${alt}" title="${title}" style="max-width:100%;cursor:zoom-in;" />
    ${title ? `<div class="enhanced-image-caption">${title}</div>` : ''}
  </div>`;
};

// 在document加载完成后添加全局事件处理器
if (typeof window !== 'undefined') {
  console.log('开始初始化图片查看功能');
  
  // 确保只初始化一次
  if (!window._imageViewerInitialized) {
    window._imageViewerInitialized = true;
    
    // 创建模态框元素
    const createModal = () => {
      console.log('创建图片查看模态框');
      const modal = document.createElement('div');
      modal.id = 'enhanced-image-modal';
      modal.style.cssText = 'display:none;position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;background-color:rgba(0,0,0,0.9);align-items:center;justify-content:center;';
      modal.innerHTML = `
        <span id="enhanced-image-close" style="position:absolute;top:20px;right:30px;color:white;font-size:40px;font-weight:bold;cursor:pointer;z-index:10000;">&times;</span>
        <div style="position:relative;max-width:90%;max-height:90%;">
          <div id="enhanced-image-loading" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);color:white;font-size:18px;text-align:center;display:none;">
            正在加载中<span class="loading-dots" style="display:inline-block;width:30px;">
              <span class="dot dot1" style="animation:dotPulse 1.5s infinite .0s;display:inline-block;opacity:0;">.</span>
              <span class="dot dot2" style="animation:dotPulse 1.5s infinite .3s;display:inline-block;opacity:0;">.</span>
              <span class="dot dot3" style="animation:dotPulse 1.5s infinite .6s;display:inline-block;opacity:0;">.</span>
            </span>
            <div id="loading-progress-container" style="width:200px;height:8px;background:rgba(255,255,255,0.2);border-radius:4px;margin:15px auto 0;overflow:hidden;">
              <div id="loading-progress-bar" style="width:0%;height:100%;background:linear-gradient(90deg,#42a5f5,#64b5f6);border-radius:4px;transition:width 0.3s;"></div>
            </div>
            <div id="loading-progress-text" style="margin-top:8px;font-size:14px;opacity:0.8;">准备加载...</div>
          </div>
          <div id="enhanced-image-error" style="position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);color:white;font-size:18px;text-align:center;display:none;">
            <div style="color:#ff6b6b;margin-bottom:10px;">❌ 图片加载失败</div>
            <div id="enhanced-image-error-message" style="font-size:14px;opacity:0.8;">请检查图片链接是否可访问</div>
            <button id="retry-image-button" style="margin-top:15px;padding:8px 16px;background:#4284f5;color:white;border:none;border-radius:4px;cursor:pointer;font-size:14px;">重试加载</button>
          </div>
          <div class="img-container" style="position:relative;overflow:hidden;max-width:100%;max-height:80vh;border-radius:6px;">
            <img id="enhanced-image-content" src="" alt="" style="max-width:100%;max-height:80vh;object-fit:contain;border-radius:6px;box-shadow:0 5px 30px rgba(0,0,0,0.3);display:block;margin:0 auto;opacity:0;transition:all 0.3s ease;transform-origin:center center;" />
          </div>
          <div id="enhanced-image-caption" style="color:white;text-align:center;padding:10px;max-width:90%;margin:10px auto 0;"></div>
          <div id="image-controls" style="display:flex;justify-content:center;gap:12px;margin-top:15px;display:none;">
            <button id="zoom-in-btn" class="img-control-btn" style="background:rgba(255,255,255,0.2);color:white;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all 0.2s;">+</button>
            <button id="zoom-out-btn" class="img-control-btn" style="background:rgba(255,255,255,0.2);color:white;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:18px;transition:all 0.2s;">-</button>
            <button id="rotate-btn" class="img-control-btn" style="background:rgba(255,255,255,0.2);color:white;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
            </button>
            <button id="reset-btn" class="img-control-btn" style="background:rgba(255,255,255,0.2);color:white;border:none;width:36px;height:36px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM8 12h8"/></svg>
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      // 添加动画样式
      const style = document.createElement('style');
      style.innerHTML = `
        @keyframes dotPulse {
          0% { opacity: 0; }
          20% { opacity: 0; }
          50% { opacity: 1; }
          80% { opacity: 0; }
          100% { opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        
        .img-control-btn:hover {
          background: rgba(255,255,255,0.3) !important;
        }
      `;
      document.head.appendChild(style);
      
      // 关闭按钮事件
      const closeBtn = document.getElementById('enhanced-image-close');
      closeBtn.addEventListener('click', () => {
        console.log('关闭图片查看器');
        modal.style.display = 'none';
        document.body.style.overflow = '';
      });
      
      // 点击背景关闭
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          console.log('点击背景关闭图片查看器');
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
      
      // ESC键关闭
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          console.log('按ESC键关闭图片查看器');
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
      
      // 重试按钮事件
      const retryButton = document.getElementById('retry-image-button');
      retryButton.addEventListener('click', (e) => {
        e.stopPropagation();
        // 重试逻辑由外部处理
        if (window._currentImageToLoad) {
          console.log('重试加载图片:', window._currentImageToLoad);
          loadImageToModal(window._currentImageToLoad);
        }
      });
      
      // 图片控制按钮
      const modalImg = document.getElementById('enhanced-image-content');
      const zoomInBtn = document.getElementById('zoom-in-btn');
      const zoomOutBtn = document.getElementById('zoom-out-btn');
      const rotateBtn = document.getElementById('rotate-btn');
      const resetBtn = document.getElementById('reset-btn');
      const controls = document.getElementById('image-controls');
      
      // 初始化图片变换状态
      let scale = 1;
      let rotation = 0;
      
      // 放大按钮
      zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.min(scale + 0.25, 3); // 最大放大3倍
        updateImageTransform();
      });
      
      // 缩小按钮
      zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = Math.max(scale - 0.25, 0.5); // 最小缩小到0.5倍
        updateImageTransform();
      });
      
      // 旋转按钮
      rotateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        rotation = (rotation + 90) % 360;
        updateImageTransform();
      });
      
      // 重置按钮
      resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        scale = 1;
        rotation = 0;
        updateImageTransform();
      });
      
      // 更新图片变换
      function updateImageTransform() {
        modalImg.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
      }
      
      // 阻止图片点击冒泡
      modalImg.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      // 图片滚轮缩放
      modalImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
          // 放大
          scale = Math.min(scale + 0.1, 3);
        } else {
          // 缩小
          scale = Math.max(scale - 0.1, 0.5);
        }
        updateImageTransform();
      });
      
      return modal;
    };
    
    // 立即创建模态框
    const modal = createModal();
    
    // 图片加载函数，单独抽取以便复用
    const loadImageToModal = (imgElement) => {
      const modal = document.getElementById('enhanced-image-modal');
      const modalImg = document.getElementById('enhanced-image-content');
      const modalCaption = document.getElementById('enhanced-image-caption');
      const loadingElement = document.getElementById('enhanced-image-loading');
      const errorElement = document.getElementById('enhanced-image-error');
      const progressBar = document.getElementById('loading-progress-bar');
      const progressText = document.getElementById('loading-progress-text');
      const errorMessage = document.getElementById('enhanced-image-error-message');
      const controls = document.getElementById('image-controls');
      
      // 保存当前加载的图片，用于重试功能
      window._currentImageToLoad = imgElement;
      
      // 重置状态
      modalImg.style.opacity = '0';
      modalImg.src = '';
      modalImg.style.transform = 'scale(1) rotate(0deg)';
      loadingElement.style.display = 'block';
      errorElement.style.display = 'none';
      controls.style.display = 'none';
      modalCaption.textContent = imgElement.title || imgElement.alt || '';
      progressBar.style.width = '0%';
      progressText.textContent = '准备加载...';
      
      // 显示模态框
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // 防止背景滚动
      console.log('开始加载图片...');
      
      // 使用fetch和blob处理进度
      fetch(imgElement.src)
        .then(response => {
          if (!response.ok) {
            throw new Error(`状态码 ${response.status}: ${response.statusText}`);
          }
          
          const contentLength = response.headers.get('content-length');
          const total = contentLength ? parseInt(contentLength, 10) : 0;
          let loaded = 0;
          
          // 创建响应流读取器
          const reader = response.body.getReader();
          
          // 处理下载进度
          return new Promise((resolve, reject) => {
            function read() {
              reader.read().then(({ done, value }) => {
                if (done) {
                  return resolve(new Response(new Blob(chunks)));
                }
                
                chunks.push(value);
                loaded += value.length;
                
                // 更新进度条
                if (total > 0) {
                  const percent = Math.round((loaded / total) * 100);
                  progressBar.style.width = `${percent}%`;
                  progressText.textContent = `${percent}% (${formatBytes(loaded)}/${formatBytes(total)})`;
                } else {
                  // 如果无法获取总大小，显示已加载字节数
                  progressBar.style.width = '100%';
                  progressBar.style.animation = 'shimmer 2s infinite linear';
                  progressBar.style.backgroundImage = 'linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2), rgba(255,255,255,0.1))';
                  progressBar.style.backgroundSize = '200px 100%';
                  progressText.textContent = `已加载 ${formatBytes(loaded)}`;
                }
                
                read();
              }).catch(reject);
            }
            
            const chunks = [];
            read();
          });
        })
        .then(response => response.blob())
        .then(blob => {
          // 创建blob URL并显示图片
          const url = URL.createObjectURL(blob);
          modalImg.onload = function() {
            loadingElement.style.display = 'none';
            modalImg.style.opacity = '1';
            controls.style.display = 'flex'; // 显示控制按钮
            
            // 检查图片尺寸
            const naturalWidth = modalImg.naturalWidth;
            const naturalHeight = modalImg.naturalHeight;
            
            // 如果图片很大，添加提示
            if (naturalWidth > 1000 || naturalHeight > 1000) {
              modalCaption.innerHTML = `
                ${modalCaption.textContent} 
                <div style="margin-top:5px;font-size:12px;opacity:0.7;">
                  (图片尺寸: ${naturalWidth} × ${naturalHeight}px，可使用下方按钮或鼠标滚轮缩放)
                </div>
              `;
            }
            
            // 内存清理
            URL.revokeObjectURL(url);
          };
          modalImg.src = url;
        })
        .catch(error => {
          console.error('图片加载失败:', error);
          loadingElement.style.display = 'none';
          errorElement.style.display = 'block';
          errorMessage.textContent = `错误: ${error.message || '未知错误'}`;
        });
      
      // 处理加载时间过长
      const loadingTimeout = setTimeout(() => {
        if (loadingElement.style.display !== 'none') {
          console.log('图片加载时间过长');
          progressText.textContent = '加载时间较长，请耐心等待...';
        }
      }, 8000);
    };
    
    // 格式化字节数为可读格式
    const formatBytes = (bytes, decimals = 1) => {
      if (bytes === 0) return '0 B';
      
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    };
    
    // 全局图片点击处理函数
    const handleImageClick = (e) => {
      // 检查点击的是否为图片元素
      if (e.target.tagName === 'IMG' && e.target.closest('.enhanced-image-container')) {
        console.log('检测到图片点击:', e.target.src);
        e.preventDefault();
        e.stopPropagation();
        
        // 使用统一的图片加载函数
        loadImageToModal(e.target);
      }
    };
    
    // 使用事件委托监听整个文档的点击事件
    document.body.addEventListener('click', handleImageClick);
    
    console.log('图片查看功能初始化完成');
    
    // 导出到window对象，方便调试
    window.debugImageViewer = {
      showModal: (imgSrc) => {
        const modalImg = document.getElementById('enhanced-image-content');
        const modalCaption = document.getElementById('enhanced-image-caption');
        modalImg.src = imgSrc || '';
        modalCaption.textContent = '测试图片';
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      },
      getStatus: () => {
        return {
          modalExists: !!document.getElementById('enhanced-image-modal'),
          isEventBound: true
        };
      }
    };
  }
}

// 直接处理数学公式
function renderMathFormulas(html) {
  // 创建占位符数组
  const mathBlocks = [];
  
  // 标记代码块，防止处理代码块内的数学公式
  const codeBlocks = [];
  html = html.replace(/<pre class="code-block.*?"[\s\S]*?<\/pre>/g, (match) => {
    const placeholder = `CODE_BLOCK_${codeBlocks.length}`;
    codeBlocks.push({ placeholder, content: match });
    return placeholder;
  });
  
  // 标记Mermaid图表，防止处理图表内的符号
  const mermaidBlocks = [];
  html = html.replace(/<div class="mermaid-wrapper">[\s\S]*?<\/div>/g, (match) => {
    const placeholder = `MERMAID_BLOCK_${mermaidBlocks.length}`;
    mermaidBlocks.push({ placeholder, content: match });
    return placeholder;
  });
  
  // 处理块级公式 $$ ... $$ 或 [ ... ]
  html = html.replace(/\$\$([\s\S]*?)\$\$|\[([\s\S]*?)\]/g, (match, formula1, formula2) => {
    const formula = formula1 || formula2;
    if (!formula || formula.trim() === '') return match;
    
    // 检查是否有明显的数学公式特征
    if (formula.includes('\\') || 
        formula.match(/[\^_{}]/) || 
        formula.match(/[+\-*=<>]/) || 
        formula.match(/\\[a-zA-Z]/) ||
        formula.match(/\$/) ||
        formula.match(/\{.*\}/) ||
        formula.match(/\\frac/) ||
        formula.match(/\\sum/) ||
        formula.match(/\\int/)) {
      try {
        // 生成唯一占位符
        const placeholder = `MATH_BLOCK_${mathBlocks.length}`;
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: true,
          throwOnError: false,
          errorColor: '#FF0000',
          output: 'html',
          trust: true
        });
        mathBlocks.push({ placeholder, rendered });
        return placeholder;
      } catch (error) {
        console.error('KaTeX display error:', error);
        // 提供优雅的错误显示而不是保留原始文本
        const placeholder = `MATH_BLOCK_ERROR_${mathBlocks.length}`;
        const errorMessage = `<div class="katex-error">公式渲染错误: ${error.message}</div>`;
        mathBlocks.push({ placeholder, rendered: errorMessage });
        return placeholder;
      }
    }
    
    return match;
  });
  
  // 处理行内公式 $ ... $ 或 (...) - 需要更严格的检测
  html = html.replace(/\$(.*?)\$|\((.*?)\)/g, (match, formula1, formula2) => {
    const formula = formula1 || formula2;
    if (!formula || formula.trim() === '') return match;
    
    // 跳过明显不是公式的情况
    if (formula.includes(' ') && !formula.match(/[\^_{}\\]/) && !formula.match(/[+\-*=<>]/)) {
      return match;
    }
    
    // 检测是否有数学公式特征
    if (formula.includes('\\') || 
        formula.match(/[\^_{}]/) || 
        formula.match(/\\[a-zA-Z]/) ||
        formula.match(/\{.*\}/) ||
        formula.match(/\\frac/) ||
        formula.match(/\\alpha/) ||
        formula.match(/\\beta/) ||
        formula.match(/\\gamma/) ||
        formula.match(/\\delta/)) {
      try {
        // 生成唯一占位符
        const placeholder = `MATH_INLINE_${mathBlocks.length}`;
        const rendered = katex.renderToString(formula.trim(), {
          displayMode: false,
          throwOnError: false,
          errorColor: '#FF0000',
          output: 'html',
          trust: true
        });
        mathBlocks.push({ placeholder, rendered });
        return placeholder;
      } catch (error) {
        console.error('KaTeX inline error:', error);
        // 提供更优雅的错误显示
        const placeholder = `MATH_INLINE_ERROR_${mathBlocks.length}`;
        const errorMessage = `<span class="katex-inline-error">${formula}</span>`;
        mathBlocks.push({ placeholder, rendered: errorMessage });
        return placeholder;
      }
    }
    
    return match;
  });
  
  // 替换占位符为渲染后的公式
  mathBlocks.forEach(block => {
    const isError = block.placeholder.includes('ERROR');
    
    // 不对错误块应用额外包装，直接使用错误消息
    if (isError) {
      html = html.replace(block.placeholder, block.rendered);
      return;
    }
    
    // 为行内公式添加特殊样式类
    if (block.placeholder.startsWith('MATH_INLINE')) {
      // 确保渲染结果有类名 katex-inline
      if (!block.rendered.includes('class="katex-inline"')) {
        // 在katex的外层包一个span，添加katex-inline类
        block.rendered = `<span class="katex-inline">${block.rendered}</span>`;
      }
    }
    
    // 为块级公式添加特殊样式类
    if (block.placeholder.startsWith('MATH_BLOCK')) {
      // 确保渲染结果有类名 katex-display
      if (!block.rendered.includes('class="katex-display"')) {
        // 在katex的外层包一个div，添加katex-display类
        block.rendered = `<div class="katex-display">${block.rendered}</div>`;
      }
    }
    
    html = html.replace(block.placeholder, block.rendered);
  });
  
  // 恢复Mermaid图表
  mermaidBlocks.forEach(block => {
    html = html.replace(block.placeholder, block.content);
  });
  
  // 恢复代码块
  codeBlocks.forEach(block => {
    html = html.replace(block.placeholder, block.content);
  });
  
  return html;
}

// 优化的渲染函数，支持更流畅的输出
export const renderMarkdown = (content, options = {}) => {
  if (!content) return '';
  
  // 使用提供的自定义渲染器（如果指定）
  const renderer = options.useCustomRenderer && options.md ? options.md : md;
  
  try {
    // 检查是否需要延迟渲染代码块
    const smoothOutput = options.smoothOutput !== false;
    
    // 首次渲染 - 将 markdown 转换为 HTML
    let html = renderer.render(content);
  
    // 处理数学公式
  html = renderMathFormulas(html);
  
    // 标记代码块，添加初始隐藏状态以避免布局变化
    if (smoothOutput) {
      const codeBlockRegex = /<pre class="code-block.*?".*?>([\s\S]*?)<\/pre>/g;
      html = html.replace(codeBlockRegex, (match, innerContent) => {
        // 为代码块添加渐进渲染标记
        return match.replace('<pre', '<pre data-render="pending"');
      });
    }
  
  return html;
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return `<div class="markdown-error">Error rendering content: ${error.message}</div>`;
  }
}

// 添加一个新函数用于延迟处理代码块
export const processPendingCodeBlocks = () => {
  // 查找所有待处理的代码块
  const pendingBlocks = document.querySelectorAll('pre[data-render="pending"]');
  
  if (pendingBlocks.length === 0) return;
  
  // 立即处理所有代码块，不使用动画或批处理
  pendingBlocks.forEach(block => {
    block.removeAttribute('data-render');
    block.classList.add('code-visible');
  });
};

// 导出处理函数以便在需要时调用
export default {
  md,
  renderMarkdown,
  processPendingCodeBlocks
};
