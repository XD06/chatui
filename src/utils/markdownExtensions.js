/**
 * 自定义Markdown扩展 - 提供增强的Markdown渲染功能
 */

// 用于缓存MarkdownIt实例
let cachedMd = null;

/**
 * 初始化Markdown实例并应用所有扩展
 * @returns {Object} - 配置好的MarkdownIt实例
 */
export function initializeMarkdown() {
  // 如果已经初始化，直接返回缓存实例
  if (cachedMd) return cachedMd;
  
  // 动态导入markdown-it和highlight.js
  try {
    // 在浏览器环境中使用import()
    if (typeof window !== 'undefined') {
      const markdownIt = window.markdownit;
      const hljs = window.hljs;
      
      if (markdownIt && hljs) {
        const md = markdownIt({
          html: true,
          breaks: true,
          linkify: true,
          typographer: true,
          highlight: function(str, lang) {
            if (lang && hljs.getLanguage(lang)) {
              try {
                return hljs.highlight(str, { language: lang }).value;
              } catch (e) {
                console.error('代码高亮失败', e);
              }
            }
            return ''; // 使用默认的转义
          }
        });
        
        // 注册所有扩展
        registerAllExtensions(md);
        
        // 缓存实例
        cachedMd = md;
        return md;
      }
    }
    
    // 在Node.js环境中，或者window.markdownit不可用时
    console.warn('无法初始化Markdown处理器，可能需要导入相关依赖');
    return null;
  } catch (error) {
    console.error('初始化Markdown处理器失败:', error);
    return null;
  }
}

/**
 * 应用Markdown扩展处理内容
 * @param {string} content - 原始内容
 * @param {Object} md - 可选的MarkdownIt实例
 * @returns {string} - 处理后的内容
 */
export function applyMarkdownExtensions(content, md = null) {
  if (!content) return content;
  
  try {
    // 如果没有提供md实例，尝试初始化一个
    const markdownIt = md || initializeMarkdown();
    
    // 如果无法获取markdownIt实例，返回原始内容
    if (!markdownIt) return content;
    
    // 渲染Markdown
    return markdownIt.render(content);
  } catch (error) {
    console.error('应用Markdown扩展失败:', error);
    return content; // 出错时返回原始内容
  }
}

/**
 * 添加文件树渲染支持
 * @param {MarkdownIt} md - markdown-it实例
 */
export function addFileTreeSupport(md) {
  const defaultFence = md.renderer.rules.fence.bind(md.renderer.rules);
  
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const langName = token.info.trim().toLowerCase();
    
    // 处理文件树代码块
    if (langName === 'filetree') {
      return renderFileTree(token.content);
    }
    
    // 处理流程图
    if (langName === 'flowchart') {
      return renderFlowchart(token.content);
    }
    
    // 处理思维导图
    if (langName === 'mindmap') {
      return renderMindmap(token.content);
    }
    
    // 处理甘特图
    if (langName === 'gantt') {
      return renderGantt(token.content);
    }
    
    // 对于其他代码块，使用默认渲染器
    return defaultFence(tokens, idx, options, env, self);
  };
}

/**
 * 渲染文件树
 * @param {string} content - 文件树内容
 * @returns {string} - 渲染后的HTML
 */
function renderFileTree(content) {
  if (!content) return '<div class="file-tree"></div>';
  
  const lines = content.split('\n').filter(line => line.trim());
  let html = '<div class="file-tree">';
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    const indentLevel = line.search(/\S|$/) / 2; // 假设每个缩进是2个空格
    const isFolder = trimmedLine.endsWith('/');
    
    const itemClass = isFolder ? 'folder' : 'file';
    const icon = isFolder ? '📁' : '📄';
    const itemName = trimmedLine.replace(/\/$/, '');
    
    html += `<div class="tree-item ${itemClass}" style="padding-left: ${20 + indentLevel * 20}px">
      <span class="tree-label">${icon} ${itemName}</span>
    </div>`;
  });
  
  html += '</div>';
  return html;
}

/**
 * 渲染流程图
 * @param {string} content - 流程图内容
 * @returns {string} - 渲染后的HTML
 */
function renderFlowchart(content) {
  if (!content) return '<div class="flowchart-error">Empty flowchart content</div>';
  
  const id = 'flowchart-' + Math.random().toString(36).substring(2, 10);
  
  // 创建一个包含流程图的div，使用mermaid渲染
  return `<div class="flowchart-wrapper">
    <div class="mermaid" id="${id}">
      flowchart TD
      ${content}
    </div>
    <div class="flowchart-hint">
      <div class="flowchart-hint-icon">ℹ️</div>
      <div class="flowchart-hint-text">流程图将在渲染完成后显示</div>
    </div>
  </div>`;
}

/**
 * 渲染思维导图
 * @param {string} content - 思维导图内容
 * @returns {string} - 渲染后的HTML
 */
function renderMindmap(content) {
  if (!content) return '<div class="mindmap-error">Empty mindmap content</div>';
  
  const id = 'mindmap-' + Math.random().toString(36).substring(2, 10);
  
  // 创建一个包含思维导图的div，使用mermaid渲染
  return `<div class="mindmap-wrapper">
    <div class="mermaid" id="${id}">
      mindmap
      ${content}
    </div>
    <div class="mindmap-hint">
      <div class="mindmap-hint-icon">ℹ️</div>
      <div class="mindmap-hint-text">思维导图将在渲染完成后显示</div>
    </div>
  </div>`;
}

/**
 * 渲染甘特图
 * @param {string} content - 甘特图内容
 * @returns {string} - 渲染后的HTML
 */
function renderGantt(content) {
  if (!content) return '<div class="gantt-error">Empty gantt chart content</div>';
  
  const id = 'gantt-' + Math.random().toString(36).substring(2, 10);
  
  // 创建一个包含甘特图的div，使用mermaid渲染
  return `<div class="gantt-wrapper">
    <div class="mermaid" id="${id}">
      gantt
      ${content}
    </div>
    <div class="gantt-hint">
      <div class="gantt-hint-icon">ℹ️</div>
      <div class="gantt-hint-text">甘特图将在渲染完成后显示</div>
    </div>
  </div>`;
}

/**
 * 添加可折叠详情块支持
 * @param {MarkdownIt} md - markdown-it实例
 */
export function addDetailsSupport(md) {
  // 标记detailsBlock的开始
  md.block.ruler.before('fence', 'details', (state, startLine, endLine, silent) => {
    const startPos = state.bMarks[startLine] + state.tShift[startLine];
    const maxPos = state.eMarks[startLine];
    
    // 检查是否匹配:::details 模式
    if (maxPos - startPos < 11) return false;
    if (state.src.slice(startPos, startPos + 3) !== ':::') return false;
    
    const detailsMatch = state.src.slice(startPos + 3, maxPos).trim().match(/^(details)\s+(.*)/);
    if (!detailsMatch) return false;
    
    // 如果是在验证模式下，直接返回true
    if (silent) return true;
    
    // 查找结束标记 :::
    let nextLine = startLine + 1;
    let found = false;
    
    while (nextLine < endLine) {
      const lineStart = state.bMarks[nextLine] + state.tShift[nextLine];
      const lineMax = state.eMarks[nextLine];
      
      if (lineStart < lineMax && state.src.slice(lineStart, lineStart + 3) === ':::') {
        found = true;
        break;
      }
      
      nextLine++;
    }
    
    if (!found) {
      // 没有找到结束标记，将这一行作为普通文本处理
      return false;
    }
    
    // 创建Details标记
    const title = detailsMatch[2] || 'Details';
    const detailsToken = state.push('details_open', 'div', 1);
    detailsToken.attrSet('class', 'details-wrapper');
    detailsToken.markup = ':::';
    
    // 创建Summary标记
    const summaryToken = state.push('summary_open', 'div', 1);
    summaryToken.attrSet('class', 'details-summary');
    summaryToken.attrSet('onclick', 'this.classList.toggle(\'open\'); this.nextElementSibling.classList.toggle(\'open\')');
    summaryToken.markup = '';
    
    // 创建Summary内容
    const summaryContentToken = state.push('inline', '', 0);
    summaryContentToken.content = title;
    summaryContentToken.children = [];
    
    // 闭合Summary
    state.push('summary_close', 'div', -1);
    
    // 创建Content容器
    const contentToken = state.push('content_open', 'div', 1);
    contentToken.attrSet('class', 'details-content');
    contentToken.markup = '';
    
    // 处理Details内部的内容
    const contentStartLine = startLine + 1;
    const contentEndLine = nextLine;
    
    // 将内部内容设置为需要由md解析的token
    const contentToken2 = state.push('fence', 'div', 0);
    contentToken2.hidden = true;
    
    // 提取内部内容
    const content = state.getLines(contentStartLine, contentEndLine, state.tShift[startLine], false).trim();
    state.md.block.parse(content, state.md, state.env, state.tokens);
    
    // 闭合Content和Details
    state.push('content_close', 'div', -1);
    state.push('details_close', 'div', -1);
    
    // 更新解析位置
    state.line = nextLine + 1;
    return true;
  });
}

/**
 * 添加键盘样式支持
 * @param {MarkdownIt} md - markdown-it实例
 */
export function addKeyboardSupport(md) {
  // 添加 <kbd>Ctrl</kbd> 支持
  const defaultInlineRule = md.renderer.rules.text || function(tokens, idx) {
    return tokens[idx].content;
  };
  
  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    const text = tokens[idx].content;
    // 匹配 <kbd>text</kbd> 模式
    const processed = text.replace(/<kbd>(.*?)<\/kbd>/gi, (match, content) => {
      return `<kbd>${content}</kbd>`;
    });
    
    if (processed !== text) {
      return processed;
    }
    
    return defaultInlineRule(tokens, idx, options, env, self);
  };
}

/**
 * 添加增强图片处理功能
 * @param {MarkdownIt} md - markdown-it实例
 */
export function addImageEnhancement(md) {
  // 保存原始图片渲染器
  const defaultImageRenderer = md.renderer.rules.image || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };
  
  // 替换图片渲染器
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    
    // 获取原始渲染结果
    const originalRendered = defaultImageRenderer(tokens, idx, options, env, self);
    
    // 替换原始img标签，添加可点击放大功能
    const enhancedImage = originalRendered.replace(/<img(.*?)>/gi, (match, attributes) => {
      // 提取src属性值
      const srcMatch = attributes.match(/src=["'](.*?)["']/i);
      const src = srcMatch ? srcMatch[1] : '';
      
      // 提取alt属性值
      const altMatch = attributes.match(/alt=["'](.*?)["']/i);
      const alt = altMatch ? altMatch[1] : '';
      
      // 提取title属性值
      const titleMatch = attributes.match(/title=["'](.*?)["']/i);
      const title = titleMatch ? titleMatch[1] : alt;
      
      // 为图片创建唯一ID，用于标识
      const imgId = 'img-' + Math.random().toString(36).substring(2, 10);
      
      // 创建可点击放大的图片
      return `<div class="enhanced-image-container">
        <img${attributes} data-fullscreen-id="${imgId}" style="max-width:100%;cursor:zoom-in;" />
        ${title ? `<div class="enhanced-image-caption">${title}</div>` : ''}
      </div>`;
    });
    
    return enhancedImage;
  };
  
  // 重写HTML渲染器处理img标签
  const defaultHTMLBlockRenderer = md.renderer.rules.html_block || function(tokens, idx, options, env, self) {
    return tokens[idx].content;
  };
  
  md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
    const content = tokens[idx].content;
    
    // 增强HTML块中的img标签
    const enhancedContent = content.replace(/<img(.*?)>/gi, (match, attributes) => {
      // 如果已经在增强图片容器内，不做处理
      if (match.includes('enhanced-image-container') || match.includes('data-fullscreen-id')) {
        return match;
      }
      
      // 提取src属性
      const srcMatch = attributes.match(/src=["'](.*?)["']/i);
      const src = srcMatch ? srcMatch[1] : '';
      
      // 提取alt和title属性
      const altMatch = attributes.match(/alt=["'](.*?)["']/i);
      const alt = altMatch ? altMatch[1] : '';
      
      const titleMatch = attributes.match(/title=["'](.*?)["']/i);
      const title = titleMatch ? titleMatch[1] : alt;
      
      // 为图片创建唯一ID，用于标识
      const imgId = 'img-' + Math.random().toString(36).substring(2, 10);
      
      // 创建可点击放大的图片
      return `<div class="enhanced-image-container">
        <img${attributes} data-fullscreen-id="${imgId}" style="max-width:100%;cursor:zoom-in;" />
        ${title ? `<div class="enhanced-image-caption">${title}</div>` : ''}
      </div>`;
    });
    
    if (enhancedContent !== content) {
      return enhancedContent;
    }
    
    return defaultHTMLBlockRenderer(tokens, idx, options, env, self);
  };
  
  // 我们不再在这里初始化图片功能，而是依赖src/utils/markdown.js中的实现
  // 这样避免功能重复和冲突
}

/**
 * 添加标注和高亮支持
 * @param {MarkdownIt} md - markdown-it实例
 */
export function addHighlightSupport(md) {
  // 添加 ==highlight== 支持
  md.inline.ruler.after('emphasis', 'highlight', (state, silent) => {
    const start = state.pos;
    const marker = state.src.charCodeAt(start);

    if (silent) return false;
    if (marker !== 0x3D) return false; // = 字符的 ASCII 码
    if (state.src.charCodeAt(start + 1) !== 0x3D) return false;

    // 查找闭合的 ==
    let end = start + 2;
    let found = false;

    while (end < state.posMax) {
      if (state.src.charCodeAt(end) === 0x3D && 
          state.src.charCodeAt(end + 1) === 0x3D) {
        found = true;
        break;
      }
      end++;
    }

    if (!found || start + 2 === end) return false;

    state.pos = start + 2;
    state.posMax = end;

    // 不要在内部对高亮内容做额外处理
    state.pos = end + 2;
    state.posMax = state.tokens.length;

    // 生成 token
    const token = state.push('highlight', '', 0);
    token.content = state.src.slice(start + 2, end);

    return true;
  });

  // 渲染高亮内容
  md.renderer.rules.highlight = (tokens, idx) => {
    return `<mark>${tokens[idx].content}</mark>`;
  };
}

/**
 * 添加注释和脚注支持
 * @param {MarkdownIt} md - markdown-it实例
 */
export function addFootnoteSupport(md) {
  // 添加脚注支持 [^1]: 脚注内容
  // 实现时可以根据具体需求调整此功能
  md.inline.ruler.after('emphasis', 'footnote_ref', (state, silent) => {
    const start = state.pos;
    if (state.src.charCodeAt(start) !== 0x5B) return false; // [ 字符
    if (state.src.charCodeAt(start + 1) !== 0x5E) return false; // ^ 字符

    let pos = start + 2;
    let footnoteId = '';

    // 收集脚注ID
    while (pos < state.posMax) {
      const ch = state.src.charCodeAt(pos);
      if (ch === 0x5D) break; // ] 字符
      if (ch === 0x20 || ch === 0x0A) return false; // 不允许空格或换行
      footnoteId += state.src.charAt(pos);
      pos++;
    }

    if (pos === state.posMax || footnoteId.length === 0) return false;

    if (!silent) {
      const token = state.push('footnote_ref', '', 0);
      token.meta = { id: footnoteId };
      token.content = footnoteId;
    }

    state.pos = pos + 1;
    return true;
  });

  // 渲染脚注引用
  md.renderer.rules.footnote_ref = (tokens, idx) => {
    const id = tokens[idx].meta.id;
    return `<sup class="footnote-ref"><a href="#fn-${id}" id="fnref-${id}">[${id}]</a></sup>`;
  };
}

/**
 * 注册所有Markdown扩展
 * @param {MarkdownIt} md - markdown-it实例
 */
export function registerAllExtensions(md) {
  addFileTreeSupport(md);
  addDetailsSupport(md);
  addKeyboardSupport(md);
  addHighlightSupport(md);
  addFootnoteSupport(md);
  addImageEnhancement(md); // 添加增强图片处理功能
}

export default registerAllExtensions; 