// 处理 AI 聊天请求的 Netlify 函数
const fetch = require('node-fetch');
const { ReadableStream } = require('web-streams-polyfill');

// 为 node-fetch 添加 ReadableStream 支持
if (!globalThis.ReadableStream) {
  globalThis.ReadableStream = ReadableStream;
}

exports.handler = async function(event, context) {
  // 只接受 POST 请求
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: '只允许 POST 请求' }) 
    };
  }

  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return { 
        statusCode: 500, 
        body: JSON.stringify({ error: 'API密钥未配置' }) 
      };
    }
    
    const body = JSON.parse(event.body);
    const { model, messages, temperature, max_tokens, stream } = body;
    const apiUrl = process.env.API_URL || 'https://api.openai.com/v1/chat/completions';
    
    console.log(`处理API请求: 模型=${model}, 消息数=${messages?.length}, 流式=${stream ? '是' : '否'}`);
    
    // 处理流式响应
    if (stream) {
      try {
        // 使用 Netlify 函数的流式响应方法
        // 注意：标准 Netlify 函数不支持真正的流式响应，我们会收集完整响应后一次性返回
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages,
            temperature,
            max_tokens,
            stream: true
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API请求错误:', errorData);
          return { 
            statusCode: response.status, 
            body: JSON.stringify({ 
              error: 'API请求失败', 
              details: errorData 
            }) 
          };
        }

        // 收集流式响应并拼接
        const reader = response.body.getReader();
        let chunks = [];
        let decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          chunks.push(value);
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ') && line !== 'data: [DONE]') {
              try {
                const data = JSON.parse(line.substring(6));
                if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                  fullText += data.choices[0].delta.content;
                }
              } catch (e) {
                console.warn('解析流式响应行失败:', e);
              }
            }
          }
        }

        // 返回完整的响应
        return { 
          statusCode: 200, 
          body: JSON.stringify({
            choices: [{
              message: {
                role: 'assistant',
                content: fullText
              }
            }],
            object: 'chat.completion',
            model: model,
            usage: {
              prompt_tokens: -1,
              completion_tokens: -1,
              total_tokens: -1
            }
          })
        };
      } catch (error) {
        console.error('处理流式响应错误:', error);
        return { 
          statusCode: 500, 
          body: JSON.stringify({ error: '处理流式响应失败', message: error.message }) 
        };
      }
    } else {
      // 非流式响应，直接转发
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens,
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API请求错误:', errorData);
        return { 
          statusCode: response.status, 
          body: JSON.stringify({ 
            error: 'API请求失败', 
            details: errorData 
          }) 
        };
      }
      
      const data = await response.json();
      return { 
        statusCode: 200, 
        body: JSON.stringify(data) 
      };
    }
  } catch (error) {
    console.error('处理请求错误:', error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: '服务器错误', message: error.message }) 
    };
  }
}; 