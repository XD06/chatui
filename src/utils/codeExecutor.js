/**
 * Code Executor Utility
 * Provides functionality to execute HTML code in a sandboxed iframe
 */

// Timeout duration for code execution (in milliseconds)
const EXECUTION_TIMEOUT_MS = 8000;

const MIN_MODAL_WIDTH_PX = 400;
const MAX_MODAL_WIDTH_PERCENT = 90;
const MIN_MODAL_HEIGHT_PX = 300;
const MAX_MODAL_HEIGHT_PERCENT = 90;

let executionTimeoutId = null;
let currentConsoleLogs = [];
let messageListener = null;
// 存储当前显示的代码
let currentDisplayedCode = '';

/**
 * 显示代码编辑器
 */
function showCodeEditor() {
  try {
    const editorContainer = document.getElementById('code-editor-container');
    const codeEditor = document.getElementById('code-editor');
    const lineNumbers = document.getElementById('line-numbers');
    const languageSelect = document.getElementById('editor-language-select');
    const iframe = document.getElementById('code-sandbox');
    
    if (editorContainer && codeEditor && iframe) {
      // 获取当前展示的代码（从iframe中提取）
      let codeContent = '';
      try {
        // 尝试从iframe中获取源码
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        // 将代码填充到编辑器中
        codeContent = currentDisplayedCode || iframeDoc.documentElement.outerHTML;
      } catch (error) {
        codeContent = currentDisplayedCode || '<!-- 无法获取代码 -->';
        console.error('从iframe获取代码失败:', error);
      }
      
      // 填充代码内容
      codeEditor.textContent = codeContent;
      
      // 显示编辑器
      editorContainer.style.display = 'flex';
      
      // 设置默认语言为HTML
      languageSelect.value = 'html';
      
      // 应用语法高亮和更新行号
      applyCodeHighlighting(codeEditor, lineNumbers, 'html');
      
      // 聚焦编辑器
      codeEditor.focus();
      
      // 更新状态指示器
      updateStatusIndicator('正在编辑代码', 'running');
    }
  } catch (error) {
    console.error('打开代码编辑器失败:', error);
  }
}

/**
 * 隐藏代码编辑器
 */
function hideCodeEditor() {
  try {
    const editorContainer = document.getElementById('code-editor-container');
    if (editorContainer) {
      editorContainer.style.display = 'none';
    }
  } catch (error) {
    console.error('隐藏代码编辑器失败:', error);
  }
}

// 防抖函数 - 避免频繁触发高亮更新
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// 保存当前光标位置的状态
let lastCursorState = {
  text: '',
  selectionStart: 0,
  selectionEnd: 0,
  cursorLine: 0,
  cursorColumn: 0
};

/**
 * 应用代码高亮和行号
 * @param {HTMLElement} codeEditor - 代码编辑器元素
 * @param {HTMLElement} lineNumbers - 行号容器元素
 * @param {string} language - 编程语言
 */
function applyCodeHighlighting(codeEditor, lineNumbers, language) {
  if (!codeEditor || !lineNumbers) return;
  
  try {
    // 获取代码内容
    const code = codeEditor.textContent;
    
    // 如果内容没有变化，不执行高亮以避免不必要的光标重置
    if (lastCursorState.text === code) {
      return;
    }
    
    // 获取当前光标位置和选区
    const cursorInfo = getCurrentCursorInfo(codeEditor);
    
    // 保存当前状态为lastCursorState
    lastCursorState = {
      text: code,
      selectionStart: cursorInfo.selectionStart,
      selectionEnd: cursorInfo.selectionEnd,
      cursorLine: cursorInfo.cursorLine,
      cursorColumn: cursorInfo.cursorColumn
    };
    
    // 处理行号
    const codeLines = code.split('\n');
    const lineCount = codeLines.length;
    
    // 只有当行数变化时才更新行号
    if (lineNumbers.childElementCount !== lineCount) {
      // 清空当前行号
      lineNumbers.innerHTML = '';
      
      // 生成新的行号
      for (let i = 1; i <= lineCount; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
      }
    }
    
    // 应用语法高亮
    if (typeof window.hljs !== 'undefined') {
      try {
        // 使用highlight.js高亮代码
        const highlightedCode = window.hljs.highlight(code, {
          language: language || 'html'
        }).value;
        
        // 检查内容是否有变化，避免不必要的DOM操作
        if (codeEditor.innerHTML !== highlightedCode) {
          // 更新高亮代码
          codeEditor.innerHTML = highlightedCode;
          
          // 恢复光标位置
          restoreCursorPosition(codeEditor, cursorInfo);
        }
      } catch (e) {
        console.error('高亮代码失败:', e);
      }
    } else {
      console.warn('highlight.js 不可用，无法应用语法高亮');
    }
  } catch (error) {
    console.error('渲染代码编辑器失败:', error);
  }
}

/**
 * 获取当前光标位置信息
 * @param {HTMLElement} editor - 编辑器元素
 * @returns {Object} 光标位置信息
 */
function getCurrentCursorInfo(editor) {
  const selection = window.getSelection();
  const result = {
    selectionStart: 0,
    selectionEnd: 0,
    cursorLine: 0,
    cursorColumn: 0,
    selection: selection
  };
  
  if (!selection.rangeCount) return result;
  
  const range = selection.getRangeAt(0);
  
  // 检查范围是否与编辑器相交
  if (!range.intersectsNode(editor)) return result;
  
  // 计算选区开始和结束的偏移量
  const editorContent = editor.textContent;
  const fullRange = document.createRange();
  fullRange.selectNodeContents(editor);
  
  // 尝试确定选区的开始位置
  try {
    // 创建一个范围从编辑器开始到当前选区开始
    const startRange = document.createRange();
    startRange.setStart(fullRange.startContainer, fullRange.startOffset);
    startRange.setEnd(range.startContainer, range.startOffset);
    
    // 获取这个范围的文本，其长度就是选区开始位置
    result.selectionStart = startRange.toString().length;
    
    // 如果存在选区（不仅仅是光标），计算结束位置
    if (!selection.isCollapsed) {
      const endRange = document.createRange();
      endRange.setStart(fullRange.startContainer, fullRange.startOffset);
      endRange.setEnd(range.endContainer, range.endOffset);
      result.selectionEnd = endRange.toString().length;
    } else {
      result.selectionEnd = result.selectionStart;
    }
    
    // 计算行和列
    const textBeforeCursor = editorContent.substring(0, result.selectionStart);
    const lines = textBeforeCursor.split('\n');
    result.cursorLine = lines.length - 1;
    result.cursorColumn = lines[lines.length - 1].length;
  } catch (e) {
    console.error('计算光标位置失败:', e);
  }
  
  return result;
}

/**
 * 恢复光标位置
 * @param {HTMLElement} editor - 编辑器元素
 * @param {Object} cursorInfo - 光标位置信息
 */
function restoreCursorPosition(editor, cursorInfo) {
  try {
    const editorContent = editor.textContent;
    const targetOffset = Math.min(cursorInfo.selectionStart, editorContent.length);
    
    // 找到目标位置的文本节点和偏移量
    const nodeAndOffset = findNodeAndOffsetForPosition(editor, targetOffset);
    
    if (nodeAndOffset) {
      const selection = window.getSelection();
      const range = document.createRange();
      
      // 设置范围开始位置
      range.setStart(nodeAndOffset.node, nodeAndOffset.offset);
      
      // 如果是选区而不仅仅是光标位置，设置结束位置
      if (cursorInfo.selectionEnd !== cursorInfo.selectionStart) {
        const endNodeAndOffset = findNodeAndOffsetForPosition(
          editor, 
          Math.min(cursorInfo.selectionEnd, editorContent.length)
        );
        if (endNodeAndOffset) {
          range.setEnd(endNodeAndOffset.node, endNodeAndOffset.offset);
        } else {
          range.collapse(true); // 如果找不到结束位置，折叠为光标
        }
      } else {
        range.collapse(true); // 仅光标位置，折叠范围
      }
      
      // 应用选区
      selection.removeAllRanges();
      selection.addRange(range);
      
      // 确保编辑器获得焦点
      editor.focus();
      
      // 滚动到光标位置
      const cursorRect = range.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      
      if (cursorRect.top < editorRect.top || cursorRect.bottom > editorRect.bottom) {
        editor.scrollTop = editor.scrollTop + (cursorRect.top - editorRect.top);
      }
    }
  } catch (e) {
    console.error('恢复光标位置失败:', e);
  }
}

/**
 * 在指定的编辑器中找到给定文本位置对应的节点和偏移量
 * @param {Node} root - 根节点
 * @param {number} targetOffset - 目标文本偏移量
 * @returns {Object|null} 包含节点和偏移量的对象，或null
 */
function findNodeAndOffsetForPosition(root, targetOffset) {
  // 递归函数来遍历DOM树
  function traverse(node, currentOffset) {
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeLength = node.textContent.length;
      if (currentOffset + nodeLength >= targetOffset) {
        return {
          node: node,
          offset: targetOffset - currentOffset
        };
      }
      return currentOffset + nodeLength;
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      let offset = currentOffset;
      for (let i = 0; i < node.childNodes.length; i++) {
        const childResult = traverse(node.childNodes[i], offset);
        if (typeof childResult === 'object') {
          return childResult;
        }
        offset = childResult;
      }
      return offset;
    }
    
    return currentOffset;
  }
  
  const result = traverse(root, 0);
  return typeof result === 'object' ? result : null;
}

// 创建一个防抖版本的高亮应用函数
const debouncedApplyHighlighting = debounce((editor, lineNumbers, language) => {
  applyCodeHighlighting(editor, lineNumbers, language);
}, 150); // 150ms的防抖延迟

/**
 * 运行编辑后的代码
 */
function runEditedCode() {
  const codeEditor = document.getElementById('code-editor');
  const editedCode = codeEditor.textContent;
  
  // 验证代码是否为空
  if (!editedCode || editedCode.trim() === '') {
    updateStatusIndicator('编辑器中没有代码', 'error');
    return;
  }
  
  // 执行编辑后的代码
  try {
    // 隐藏编辑器
    hideCodeEditor();
    
    // 更新状态指示器
    updateStatusIndicator('正在执行代码...', 'running');
    
    // 验证和修复代码
    const processedCode = validateAndFixCode(editedCode);
    
    // 保存当前显示的代码
    currentDisplayedCode = processedCode;
    
    // 执行代码
    executeCode(processedCode);
  } catch (error) {
    console.error('运行编辑后代码失败:', error);
    updateStatusIndicator('运行失败: ' + (error.message || '未知错误'), 'error');
  }
}

/**
 * 验证并修复简单的代码问题
 * @param {string} code - 原始代码
 * @returns {string} - 处理后的代码
 */
function validateAndFixCode(code) {
  try {
    // 检查是否缺失 HTML 基本结构
    let processedCode = code.trim();
    
    // 检查是否只有片段名而没有完整 HTML 结构
    const hasHtmlTag = /<html[^>]*>/i.test(processedCode);
    const hasBodyTag = /<body[^>]*>/i.test(processedCode);
    const hasHeadTag = /<head[^>]*>/i.test(processedCode);
    
    // 如果缺失基本 HTML 结构，添加它们
    if (!hasHtmlTag) {
      if (!hasBodyTag) {
        // 如果既没有 html 也没有 body，则可能只是 HTML 片段
        processedCode = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Code Preview</title>\n</head>\n<body>\n${processedCode}\n</body>\n</html>`;
      } else {
        // 有 body 标签但没有 html
        processedCode = `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Code Preview</title>\n</head>\n${processedCode}`;
      }
    } else if (!hasHeadTag) {
      // 有 html 标签但没有 head
      processedCode = processedCode.replace(/<html[^>]*>/i, '$&\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Code Preview</title>\n</head>');
    }
    
    // 确保有正确的 DOCTYPE
    if (!processedCode.includes('<!DOCTYPE')) {
      processedCode = '<!DOCTYPE html>\n' + processedCode;
    }
    
    return processedCode;
  } catch (error) {
    console.warn('代码验证中出现错误:', error);
    // 如果验证过程出错，返回原始代码
    return code;
  }
}

/**
 * Initialize the code execution modal if it doesn't exist
 * @returns {HTMLElement} The modal container element
 */
function initializeModal() {
  try {
    let modalContainer = document.getElementById('code-execution-modal');
    console.log('Modal container before init:', modalContainer);
    if (!modalContainer) {
      console.log('Creating new modal container');
      modalContainer = document.createElement('div');
      modalContainer.id = 'code-execution-modal';
      modalContainer.className = 'code-modal';
      document.body.appendChild(modalContainer);
      
      // Create modal content - 修改状态指示器的 ID，避免与全局状态指示器冲突
      const modalContent = `
        <div class="modal-content">
          <div class="modal-header">
            <h3>代码预览 <span id="sandbox-status-indicator" class="sandbox-status-indicator"></span></h3>
            <div class="modal-actions">
              <span class="edit-btn" id="modal-edit-btn" title="编辑代码">✎️</span>
              <span class="fullscreen-btn" id="modal-fullscreen-btn" title="全屏">⛶</span>
              <span class="close-btn" id="modal-close-btn" title="关闭">×</span>
            </div>
          </div>
          <div class="modal-body">
            <iframe id="code-sandbox"></iframe>
          </div>
          <div class="modal-editor-container" id="code-editor-container" style="display: none;">
            <div class="editor-toolbar">
              <select id="editor-language-select" class="editor-select">
                <option value="html">HTML</option>
                <option value="javascript">JavaScript</option>
                <option value="css">CSS</option>
              </select>
              <button id="run-edited-code-btn" class="editor-btn">运行</button>
              <button id="cancel-edit-btn" class="editor-btn">取消</button>
            </div>
            <div class="editor-wrapper">
              <div class="line-numbers" id="line-numbers"></div>
              <pre><code id="code-editor" class="code-editor hljs" contenteditable="true" spellcheck="false"></code></pre>
            </div>
          </div>
        </div>
      `;
      modalContainer.innerHTML = modalContent;
      
      // 确保 highlight.js 正确加载
      try {
        // 检查是否已经存在 highlight.js
        if (typeof window.hljs === 'undefined' && typeof window.hljs === 'undefined') {
          console.log('加载highlight.js...');
          // 加载 highlight.js
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/highlight.min.js';
          script.onload = () => {
            console.log('highlight.js 加载成功');
            // 加载完成后初始化
            window.hljs.configure({
              languages: ['html', 'javascript', 'css'],
              ignoreUnescapedHTML: true
            });
          };
          document.head.appendChild(script);
          
          // 加载 highlight.js 样式
          const styleLink = document.createElement('link');
          styleLink.rel = 'stylesheet';
          styleLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.7.0/styles/atom-one-dark.min.css';
          document.head.appendChild(styleLink);
        } else {
          console.log('highlight.js 已经加载');
        }
      } catch (error) {
        console.error('加载 highlight.js 失败:', error);
      }
      
      // 添加状态指示器样式
      try {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .sandbox-status-indicator {
            display: inline-block;
            margin-left: 10px;
            font-size: 12px;
            font-weight: normal;
            padding: 2px 8px;
            border-radius: 10px;
            color: white;
            transition: all 0.3s ease;
            opacity: 0;
          }
          .sandbox-status-indicator.success {
            background-color: #52c41a;
            opacity: 1;
          }
          .sandbox-status-indicator.error {
            background-color: #f5222d;
            opacity: 1;
          }
          .sandbox-status-indicator.running {
            background-color: #1890ff;
            opacity: 1;
          }
          .sandbox-status-indicator.timeout {
            background-color: #fa8c16;
            opacity: 1;
          }
          
          /* 代码编辑器相关样式 */
          .modal-editor-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #282c34;
            display: flex;
            flex-direction: column;
            z-index: 10;
            color: #abb2bf;
          }
          
          .editor-toolbar {
            display: flex;
            padding: 8px;
            background-color: #21252b;
            border-bottom: 1px solid #181a1f;
            align-items: center;
          }
          
          .editor-select {
            margin-right: 8px;
            padding: 4px 8px;
            background-color: #323842;
            color: #d7dae0;
            border: 1px solid #181a1f;
            border-radius: 4px;
            font-size: 12px;
            outline: none;
          }
          
          .editor-select:focus {
            border-color: #528bff;
          }
          
          .editor-btn {
            margin-right: 8px;
            padding: 4px 12px;
            background-color: #4d78cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-size: 12px;
          }
          
          .editor-btn:hover {
            background-color: #5f8ae8;
          }
          
          #cancel-edit-btn {
            background-color: #3a3f4b;
            color: #d7dae0;
            border: 1px solid #181a1f;
          }
          
          #cancel-edit-btn:hover {
            background-color: #4a4f5a;
          }
          
          .editor-wrapper {
            display: flex;
            flex: 1;
            overflow: auto;
            position: relative;
            background-color: #282c34;
          }
          
          .line-numbers {
            width: 40px;
            padding: 12px 5px;
            background-color: #21252b;
            color: #636d83;
            text-align: right;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            font-size: 14px;
            line-height: 1.5;
            user-select: none;
            border-right: 1px solid #181a1f;
          }
          
          .code-editor {
            flex: 1;
            margin: 0;
            width: calc(100% - 40px);
            padding: 12px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            font-size: 14px;
            line-height: 1.5;
            border: none;
            outline: none;
            tab-size: 2;
            white-space: pre;
            overflow: auto;
            background-color: #282c34;
            color: #abb2bf;
          }
          
          /* 编辑器中的代码高亮颜色 - 根据 Atom One Dark 主题 */
          .hljs-keyword { color: #c678dd; }
          .hljs-built_in { color: #e6c07b; }
          .hljs-type { color: #e6c07b; }
          .hljs-literal { color: #56b6c2; }
          .hljs-number { color: #d19a66; }
          .hljs-regexp { color: #98c379; }
          .hljs-string { color: #98c379; }
          .hljs-comment { color: #7f848e; font-style: italic; }
          .hljs-doctag { color: #7f848e; }
          .hljs-meta { color: #e06c75; }
          .hljs-section { color: #e06c75; }
          .hljs-name { color: #e06c75; }
          .hljs-tag { color: #abb2bf; }
          .hljs-attr { color: #d19a66; }
          .hljs-attribute { color: #98c379; }
          .hljs-variable { color: #d19a66; }
          .hljs-params { color: #abb2bf; }
          .hljs-function { color: #61afef; }
          .hljs-class { color: #e6c07b; }
          .hljs-title { color: #61afef; }
          
          .edit-btn {
            cursor: pointer;
            margin-right: 8px;
            font-size: 16px;
          }
        `;
        document.head.appendChild(styleElement);
      } catch (styleError) {
        console.error('Failed to add status indicator styles:', styleError);
      }
      
      // Add event listeners safely
      try {
        const closeBtn = document.getElementById('modal-close-btn');
        if (closeBtn) {
          closeBtn.addEventListener('click', closeModal);
        }
        
        const fullscreenBtn = document.getElementById('modal-fullscreen-btn');
        if (fullscreenBtn) {
          fullscreenBtn.addEventListener('click', toggleFullscreen);
        }
        
        // 添加编辑按钮事件监听
        const editBtn = document.getElementById('modal-edit-btn');
        if (editBtn) {
          editBtn.addEventListener('click', showCodeEditor);
        }
        
        // 添加运行编辑后代码的按钮事件监听
        const runEditedCodeBtn = document.getElementById('run-edited-code-btn');
        if (runEditedCodeBtn) {
          runEditedCodeBtn.addEventListener('click', runEditedCode);
        }
        
        // 添加取消编辑按钮事件监听
        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        if (cancelEditBtn) {
          cancelEditBtn.addEventListener('click', hideCodeEditor);
        }
        
        // 添加语言选择器事件监听
        const languageSelect = document.getElementById('editor-language-select');
        const editorElement = document.getElementById('code-editor');
        const lineNumbers = document.getElementById('line-numbers');
        
        if (languageSelect && editorElement && lineNumbers) {
          // 监听语言选择变化
          languageSelect.addEventListener('change', () => {
            const language = languageSelect.value;
            debouncedApplyHighlighting(editorElement, lineNumbers, language);
          });
          
          // 监听编辑器内容变化
          editorElement.addEventListener('input', () => {
            const language = languageSelect.value || 'html';
            debouncedApplyHighlighting(editorElement, lineNumbers, language);
          });
          
          // 监听特殊按键（Tab、回车等）
          editorElement.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
              e.preventDefault(); // 阻止默认Tab行为
              
              // 插入两个空格代替Tab
              document.execCommand('insertText', false, '  ');
              
              // 更新高亮和行号
              const language = languageSelect.value || 'html';
              debouncedApplyHighlighting(editorElement, lineNumbers, language);
            }
          });
        }
        
        // Add ESC key handler
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && modalContainer && modalContainer.classList.contains('show')) {
            // 如果编辑器是打开的，则关闭编辑器而不是整个模态框
            const editorContainer = document.getElementById('code-editor-container');
            if (editorContainer && editorContainer.style.display !== 'none') {
              hideCodeEditor();
            } else {
              closeModal();
            }
          }
        });
        
        // 添加Tab键处理，使编辑器支持Tab缩进
        const codeEditor = document.getElementById('code-editor');
        if (codeEditor) {
          codeEditor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
              e.preventDefault();
              // 在光标位置插入制表符（2个空格）
              const start = this.selectionStart;
              const end = this.selectionEnd;
              
              // 设置新文本值
              this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
              
              // 将光标放在插入的制表符后面
              this.selectionStart = this.selectionEnd = start + 2;
            }
          });
        }
      } catch (eventError) {
        console.error('Failed to add event listeners:', eventError);
      }

      // Ensure default style is set
      modalContainer.style.opacity = '0';
      modalContainer.style.visibility = 'hidden';
    }
    
    console.log('Modal container after init:', modalContainer);
    return modalContainer;
  } catch (error) {
    console.error('Failed to initialize modal:', error);
    return null;
  }
}

/**
 * Open the modal and execute the provided HTML code
 * @param {string} code - The HTML code to execute
 */
export function openCodeModal(code) {
  try {
    console.log('Opening code modal with code:', code.substring(0, 50) + '...');
    // 保存原始代码以便编辑
    currentDisplayedCode = code;
    
    // Initialize and show modal
    const modalContainer = initializeModal();
    
    if (!modalContainer) {
      console.error('Failed to initialize modal container');
      return;
    }
    
    // Reset the display style to match SCSS style expectations
    // Set display to flex
    modalContainer.style.display = 'flex';
    
    // Use setTimeout to ensure display:flex is applied before adding show class
    // This prevents animation issues
    setTimeout(() => {
      if (document.getElementById('code-execution-modal')) {
        // Add show class for visibility and opacity animation
        modalContainer.classList.add('show');
        // Remove inline opacity/visibility styles to let CSS take over
        modalContainer.style.opacity = '';
        modalContainer.style.visibility = '';
        
        console.log('Modal container now visible. Classes:', modalContainer.className);
      }
    }, 10);
    
    // 确保编辑器已隐藏
    hideCodeEditor();
    
    // Execute the code
    executeCode(code);
  } catch (error) {
    console.error('Error opening code modal:', error);
    if (document.getElementById('sandbox-status-indicator')) {
      updateStatusIndicator('打开代码模块错误', 'error');
    }
  }
}

/**
 * Close the code execution modal
 */
export function closeModal() {
  const modal = document.getElementById('code-execution-modal');
  if (modal) {
    // Exit fullscreen if active
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    
    // Remove show class first for animation
    modal.classList.remove('show');
    // Then hide after transition completes
    setTimeout(() => {
      if (document.getElementById('code-execution-modal')) { // Extra null check
        modal.style.display = 'none';
      }
    }, 300); // Match the transition time in SCSS (0.3s)
    
    // Clear iframe content
    const sandbox = document.getElementById('code-sandbox');
    if (sandbox) {
      try {
        sandbox.src = 'about:blank';
        sandbox.removeAttribute('srcdoc');
      } catch (e) {
        console.warn('Error clearing iframe:', e);
      }
    }
    
    // Clear timeout
    if (executionTimeoutId) {
      clearTimeout(executionTimeoutId);
      executionTimeoutId = null;
    }
    
    // Remove message listener safely
    if (messageListener) {
      try {
        window.removeEventListener('message', messageListener);
      } catch (e) {
        console.warn('Error removing message listener:', e);
      }
      messageListener = null;
    }
    
    // Remove resize listener safely
    try {
      window.removeEventListener('resize', resizeModal);
    } catch (e) {
      console.warn('Error removing resize listener:', e);
    }
  }
}

/**
 * Toggle fullscreen mode for the modal
 */
function toggleFullscreen() {
  const modal = document.getElementById('code-execution-modal');
  if (!document.fullscreenElement) {
    // Enter fullscreen
    if (modal.requestFullscreen) {
      modal.requestFullscreen();
    } else if (modal.webkitRequestFullscreen) {
      modal.webkitRequestFullscreen();
    } else if (modal.msRequestFullscreen) {
      modal.msRequestFullscreen();
    }
    modal.classList.add('fullscreen');
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    modal.classList.remove('fullscreen');
  }
}

/**
 * Resize the modal and its content based on iframe content and viewport size.
 * This function primarily sets the overall constraints for the modal.
 * The internal layout (header, body, iframe, status-bar) should be handled by CSS flexbox.
 */
function resizeModal() {
  const modalContainer = document.getElementById('code-execution-modal');
  if (!modalContainer || modalContainer.style.display === 'none') {
    return;
  }

  const modalContentDiv = modalContainer.querySelector('.modal-content');
  if (!modalContentDiv) return;

  if (document.fullscreenElement === modalContainer) {
    // In fullscreen, CSS for .fullscreen class should handle sizing.
    // Reset any inline styles that might conflict.
    modalContentDiv.style.width = '';
    modalContentDiv.style.height = '';
    modalContentDiv.style.minWidth = '';
    modalContentDiv.style.maxWidth = '';
    modalContentDiv.style.minHeight = '';
    modalContentDiv.style.maxHeight = '';
    return;
  }

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate width constraints
  const minWidth = MIN_MODAL_WIDTH_PX;
  const calculatedMaxWidth = viewportWidth * (MAX_MODAL_WIDTH_PERCENT / 100);
  const maxWidth = Math.max(minWidth, calculatedMaxWidth); // Ensure maxWidth is at least minWidth

  // Calculate height constraints
  const minHeight = MIN_MODAL_HEIGHT_PX;
  const calculatedMaxHeight = viewportHeight * (MAX_MODAL_HEIGHT_PERCENT / 100);
  const maxHeight = Math.max(minHeight, calculatedMaxHeight); // Ensure maxHeight is at least minHeight
  
  // Set constraints on the modal-content div
  modalContentDiv.style.minWidth = `${minWidth}px`;
  modalContentDiv.style.maxWidth = `${maxWidth}px`;
  modalContentDiv.style.minHeight = `${minHeight}px`;
  modalContentDiv.style.maxHeight = `${maxHeight}px`;

  const sandbox = document.getElementById('code-sandbox');
  if (sandbox) {
    try {
      if (sandbox.contentWindow && sandbox.contentWindow.document && sandbox.contentWindow.document.body) {
        // const iframeContentHeight = sandbox.contentWindow.document.body.scrollHeight;
        // CSS flexbox is preferred for iframe height management within modal-body.
      }
    } catch (e) {
      // console.warn('Could not access iframe scrollHeight for resizing:', e);
    }
  }
}

/**
 * Execute HTML code in the sandbox iframe
 * @param {string} code - The HTML code to execute
 */
function executeCode(code) {
  try {
    const sandbox = document.getElementById('code-sandbox');
    // 修改这里，使用新的 ID 和类名
    const statusIndicator = document.getElementById('sandbox-status-indicator');
    
    if (!sandbox) {
      console.error('Sandbox iframe not found');
      return;
    }
    
    // 检查代码是否为空
    if (!code || code.trim() === '') {
      updateStatusIndicator('无代码可执行', 'error');
      return;
    }
    
    // Initialize
    currentConsoleLogs = []; // 保留这个以防将来需要
    
    // 设置初始状态
    if (statusIndicator) {
      updateStatusIndicator('运行中...', 'running');
    }
    
    // Reset iframe
    sandbox.src = 'about:blank';
    
    // Clear previous timeout
    if (executionTimeoutId) {
      clearTimeout(executionTimeoutId);
      executionTimeoutId = null;
    }
    
    // 仍然设置超时但使用更好的状态显示
    executionTimeoutId = setTimeout(() => {
      if (document.getElementById('sandbox-status-indicator')) {
        updateStatusIndicator('执行超时', 'timeout');
      }
    }, EXECUTION_TIMEOUT_MS);
    
    // Remove previous message listener safely
    if (messageListener) {
      try {
        window.removeEventListener('message', messageListener);
      } catch (e) {
        console.warn('Error removing previous message listener:', e);
      }
    }
    
    // 改进的消息监听器，提供更详细的错误信息
    messageListener = function(event) {
      if (!event.source || event.source !== sandbox.contentWindow) {
        return;
      }

      try {
        const { type, detail } = event.data || {};
        
        if (!type) return;

        switch (type) {
          case 'error':
            if (executionTimeoutId) {
              clearTimeout(executionTimeoutId);
              executionTimeoutId = null;
            }
            if (document.getElementById('sandbox-status-indicator')) {
              // 显示更重要的错误信息
              const errorMsg = detail && detail.message ? detail.message.split(' (at ')[0] : '执行出错';
              updateStatusIndicator(`错误: ${errorMsg}`, 'error');
            }
            console.error("沙盒错误:", detail);
            break;

          case 'potential_completion':
            if (executionTimeoutId) {
              clearTimeout(executionTimeoutId);
              executionTimeoutId = null;
            }
            if (document.getElementById('sandbox-status-indicator')) {
              updateStatusIndicator('执行成功', 'success');
            }
            break;

          case 'content_changed':
            if (document.getElementById('code-execution-modal')) {
              resizeModalBasedOnContent();
            }
            break;
            
          case 'sandbox_ready':
            console.log('沙盒准备就绪');
            break;
        }
      } catch (err) {
        console.error('Error in message handler:', err);
      }
    };
    
    window.addEventListener('message', messageListener);
    
    // Load sandbox content with better error handling
    setTimeout(() => {
      try {
        if (document.getElementById('code-sandbox')) {
          // 尝试生成沙盒 HTML
          const sandboxHtml = createSandboxHtml(code);
          sandbox.srcdoc = sandboxHtml;
          
          // 添加额外的错误处理
          sandbox.onerror = (error) => {
            console.error('沙盒iframe加载错误:', error);
            updateStatusIndicator('沙盒加载错误', 'error');
          };
          
          // Adjust size when iframe loads
          sandbox.onload = () => {
            if (document.getElementById('code-execution-modal')) {
              updateStatusIndicator('已加载', 'running');
              resizeModalBasedOnContent();
              window.addEventListener('resize', resizeModal);
            }
          };
        }
      } catch (loadError) {
        console.error('加载沙盒内容时出错:', loadError);
        updateStatusIndicator('加载错误', 'error');
      }
    }, 50);
  } catch (error) {
    console.error('Error executing code:', error);
    if (document.getElementById('sandbox-status-indicator')) {
      updateStatusIndicator('执行代码错误', 'error');
    }
  }
}

/**
 * Resize the modal based on iframe content
 */
function resizeModalBasedOnContent() {
  try {
    const sandbox = document.getElementById('code-sandbox');
    if (!sandbox) return;
    
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;
    
    const modalHeader = document.querySelector('.modal-header');
    if (!modalHeader) return;
    
    const modalHeaderHeight = modalHeader.offsetHeight;

    // 设置一个固定尺寸，避免抖动
    const maxWidth = 800;
    const maxHeight = 600;
    const minWidth = 300;
    const minHeight = 200;

    // 使用一个初始尺寸，避免内容加载时的抖动
    if (!modalContent.dataset.initialized) {
      // 第一次设置一个合理的默认尺寸
      modalContent.style.width = `${Math.min(650, window.innerWidth * 0.8)}px`;
      modalContent.style.height = `${Math.min(500, window.innerHeight * 0.7)}px`;
      modalContent.dataset.initialized = "true";
      return;
    }

    try {
      // 尝试读取iframe内容尺寸，但仅在内容完全加载后才应用
      if (!sandbox.contentWindow) return;
      
      const iframeDoc = sandbox.contentDocument || sandbox.contentWindow.document;
      if (!iframeDoc || !iframeDoc.body) return;
      
      if (iframeDoc.readyState === 'complete') {
        const contentHeight = iframeDoc.body.scrollHeight;
        const contentWidth = iframeDoc.body.scrollWidth;

        if (!contentHeight || !contentWidth) return;

        // 获取当前尺寸
        const currentWidth = parseInt(modalContent.style.width) || 0;
        const currentHeight = parseInt(modalContent.style.height) || 0;

        // 防止频繁调整导致的抖动
        if (Math.abs(contentWidth - currentWidth) > 50 ||
            Math.abs(contentHeight - currentHeight) > 50) {
          
          const newWidth = Math.min(Math.max(contentWidth + 40, minWidth), maxWidth);
          const newHeight = Math.min(Math.max(contentHeight + modalHeaderHeight + 20, minHeight), maxHeight);

          // 平滑过渡
          modalContent.style.transition = "width 0.3s, height 0.3s";
          modalContent.style.width = `${newWidth}px`;
          modalContent.style.height = `${newHeight}px`;
          
          // 300ms后移除过渡效果，避免后续调整的动画
          setTimeout(() => {
            if (modalContent && document.contains(modalContent)) {
              modalContent.style.transition = "";
            }
          }, 300);
        }
      }
    } catch (e) {
      console.warn('Failed to read iframe content dimensions', e);
    }
  } catch (error) {
    console.error('调整模态框大小失败:', error);
  }
}

/**
 * Create HTML for the sandbox iframe
 * @param {string} userCode - The user's HTML code
 * @returns {string} - The complete HTML document for the iframe
 */
function createSandboxHtml(userCode) {
  // 判断用户代码是否包含完整的HTML结构
  // 这里我们需要检测是否有完整的HTML标签结构，而不是插入到模板中
  const hasFullHtmlStructure = /<html[^>]*>.*<\/html>/s.test(userCode.trim());
  const hasDoctype = /<!DOCTYPE/i.test(userCode.trim());
  
  // 如果用户提供的是完整的HTML文档，直接使用它，但仍然添加我们的脚本
  if (hasFullHtmlStructure) {
    // 将我们的错误处理和通信脚本插入到完整的HTML中
    return injectScriptsIntoFullHtml(userCode, hasDoctype);
  }
  
  // 否则使用我们的模板
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code Sandbox</title>
      <style>
        /* 美化样式 */
        body {
          margin: 0;
          padding: 10px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.5;
        }
        
        /* Modern Scrollbar Styles for iframe content */
        body::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        body::-webkit-scrollbar-track {
          background: transparent;
        }
        body::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
        body::-webkit-scrollbar-thumb:hover {
          background: #aaa;
        }
        /* For Firefox */
        body {
          scrollbar-width: auto;
          scrollbar-color: #ccc transparent;
        }
        
        /* 添加内容区域的边框，使视觉效果更好 */
        .content-wrapper {
          border: 1px dashed #e0e0e0;
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 10px;
        }
        
        /* 添加一些基本样式重置，避免常见的HTML样式问题 */
        img { max-width: 100%; height: auto; }
        
        /* 添加基本响应式支持 */
        @media (max-width: 600px) {
          body { padding: 5px; }
        }
      </style>
      ${getSandboxScripts()}
    </head>
    <body>
      ${userCode}
      <script>
        // 执行完成信号
        setTimeout(() => {
          clearTimeout(internalTimeout);
          if (!executionCompleted) {
            executionCompleted = true;
            post('potential_completion');
          }
        }, 0);
      </script>
    </body>
    </html>
  `;
}

/**
 * 将监控脚本注入到完整的HTML中
 * @param {string} htmlCode - 完整的HTML代码
 * @param {boolean} hasDoctype - 是否已经包含DOCTYPE
 * @returns {string} - 注入脚本后的HTML
 */
function injectScriptsIntoFullHtml(htmlCode, hasDoctype) {
  let processedHtml = htmlCode;
  
  // 添加 DOCTYPE 如果需要
  if (!hasDoctype) {
    processedHtml = '<!DOCTYPE html>\n' + processedHtml;
  }
  
  // 生成我们需要注入的脚本
  const scripts = getSandboxScripts();
  
  // 将脚本注入到head中
  if (/<\/head>/i.test(processedHtml)) {
    processedHtml = processedHtml.replace(/<\/head>/i, `${scripts}\n</head>`);
  } else if (/<head[^>]*>/i.test(processedHtml)) {
    // 如果有head标签但没有结束标签，添加脚本和结束标签
    processedHtml = processedHtml.replace(/<head([^>]*)>/i, `<head$1>\n${scripts}`);
  } else if (/<html[^>]*>/i.test(processedHtml)) {
    // 如果有html标签但没有head，添加head和脚本
    processedHtml = processedHtml.replace(/<html([^>]*)>/i, `<html$1>\n<head>\n${scripts}\n</head>`);
  }
  
  // 在body内添加完成脚本
  if (/<\/body>/i.test(processedHtml)) {
    processedHtml = processedHtml.replace(/<\/body>/i, `\n<script>\n  // 执行完成信号\n  setTimeout(() => {\n    clearTimeout(internalTimeout);\n    if (!executionCompleted) {\n      executionCompleted = true;\n      post('potential_completion');\n    }\n  }, 0);\n</script>\n</body>`);
  }
  
  return processedHtml;
}

/**
 * 获取沙箱所需的脚本
 * @returns {string} - 脚本代码
 */
function getSandboxScripts() {
  // 计算超时时间
  const timeoutDuration = EXECUTION_TIMEOUT_MS - 500;
  
  // 使用常规字符串拼接以避免模板字符串嵌套问题
  return '<script>\n' +
    '    // 简化通信功能\n' +
    '    const post = (type, detail) => {\n' +
    '      try {\n' +
    '        window.parent.postMessage({ type, detail }, "*");\n' +
    '      } catch (e) {\n' +
    '        console.error("postMessage failed:", e);\n' +
    '      }\n' +
    '    };\n\n' +
    '    let executionCompleted = false;\n' +
    '    let internalTimeout = null;\n\n' +
    '    // 错误处理\n' +
    '    window.onerror = (message, source, lineno, colno, error) => {\n' +
    '      clearTimeout(internalTimeout);\n' +
    '      if (!executionCompleted) {\n' +
    '        executionCompleted = true;\n' +
    '        post("error", {\n' +
    '          message: message + " (at " + (source ? source.split("/").pop() : "unknown") + ":" + lineno + ":" + colno + ")",\n' +
    '          stack: error ? error.stack : undefined\n' +
    '        });\n' +
    '      }\n' +
    '      return true;\n' +
    '    };\n\n' +
    '    // 异步错误处理\n' +
    '    window.addEventListener("unhandledrejection", (event) => {\n' +
    '      clearTimeout(internalTimeout);\n' +
    '      if (!executionCompleted) {\n' +
    '        executionCompleted = true;\n' +
    '        post("error", { message: "Unhandled Promise Rejection", reason: String(event.reason) });\n' +
    '      }\n' +
    '    });\n\n' +
    '    // 监听DOM变化\n' +
    '    window.addEventListener("DOMContentLoaded", () => {\n' +
    '      if (document.body) {\n' +
    '        const observer = new MutationObserver(() => post("content_changed"));\n' +
    '        observer.observe(document.body, { childList: true, subtree: true, attributes: true });\n' +
    '      }\n' +
    '    });\n\n' +
    '    // 监听窗口大小变化\n' +
    '    window.addEventListener("resize", () => post("content_changed"));\n\n' +
    '    // 通知准备就绪\n' +
    '    post("sandbox_ready");\n\n' +
    '    // 设置超时保护\n' +
    '    internalTimeout = setTimeout(() => {\n' +
    '      if (!executionCompleted) post("potential_completion");\n' +
    '    }, ' + timeoutDuration + ');\n' +
    '  </script>';
}

/**
 * 更新状态指示器
 * @param {string} message - 状态消息
 * @param {string} type - 状态类型 (running, success, error, timeout)
 */
function updateStatusIndicator(message, type) {
  // 修改查找 ID，使用沙盒特定的状态指示器 ID
  const statusIndicator = document.getElementById('sandbox-status-indicator');
  if (!statusIndicator) return;
  
  // 移除所有状态类
  statusIndicator.classList.remove('success', 'error', 'running', 'timeout');
  
  // 添加新状态类
  statusIndicator.classList.add(type);
  
  // 设置文本内容
  statusIndicator.textContent = message;
}

// 设置全局事件委托监听器，捕获所有run-btn的点击事件
document.addEventListener('click', (e) => {
  // 查找最近的run-btn类的按钮元素
  const runButton = e.target.closest('.run-btn');
  if (runButton) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Run button clicked via global handler');
    
    // 查找代码块
    const codeBlock = runButton.closest('.code-block');
    if (codeBlock) {
      const codeElement = codeBlock.querySelector('code');
      if (codeElement) {
        const htmlCode = codeElement.textContent || '';
        console.log('Opening code modal with HTML code via global handler');
        openCodeModal(htmlCode);
      }
    }
  }
}, true);

export default { openCodeModal, closeModal };