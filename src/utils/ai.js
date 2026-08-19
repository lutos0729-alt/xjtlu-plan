/**
 * DeepSeek AI 增强模块
 * 在规则引擎生成的规划骨架上，调用 DeepSeek API 生成个性化建议文案
 */

// 开发环境通过 vite proxy 转发；生产环境需替换为自有后端地址
const API_BASE = '/api/deepseek'

/**
 * 调用 DeepSeek Chat API
 * @param {Array} messages - [{role, content}]
 * @param {string} apiKey - DeepSeek API Key
 * @returns {Promise<string>} AI 回复文本
 */
export async function callDeepSeek(messages, apiKey) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE}/chat/completions`,
      method: 'POST',
      timeout: 60000,
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      data: {
        model: 'deepseek-chat',
        messages,
        stream: false,
        temperature: 0.7,
        max_tokens: 1200
      },
      success(res) {
        if (res.statusCode !== 200) {
          const msg = res.data?.error?.message || `请求失败 (${res.statusCode})`
          reject(new Error(msg))
          return
        }
        const content = res.data?.choices?.[0]?.message?.content
        if (!content) {
          reject(new Error('AI 返回为空'))
          return
        }
        resolve(content)
      },
      fail(err) {
        reject(new Error(err.errMsg || '网络请求失败'))
      }
    })
  })
}

/**
 * 构建发给 AI 的 prompt
 * 包含学生信息 + 规划骨架摘要 + 输出要求
 */
export function buildAIPrompt(input, plan) {
  const { grade, major, direction, countries } = input

  const planSummary = plan.countryPlans
    .map((cp) => {
      return `${cp.label}：${cp.coreTargets.join(' / ')}；${cp.targets.gpa}；${cp.targets.language}；申请窗口 ${cp.applicationInfo.window}`
    })
    .join('\n')

  const timelineSummary = plan.timeline
    .map((y) => {
      return `${y.year}：` + y.phases.map((p) => `${p.name}（${p.focus}）`).join('、')
    })
    .join('\n')

  const system = `你是一位经验丰富的海外升学规划顾问，专注于帮助西交利物浦大学（XJTLU）的本科生规划海外研究生申请。西交利物浦大学位于苏州，采用全英文教学，有 2+2 模式（前两年在苏州，后两年可选赴利物浦），学生可获得利物浦大学学位，在海外申请中具有英文授课背景优势。

评分体系：XJTLU 采用英国学位等级制，70 分以上即为一等学位（First Class，满绩），60-69 为二等一（2:1），50-59 为二等二（2:2）。海外院校普遍认可利物浦学位，申请时无需换算 GPA。请根据学生情况给出个性化、具体、可执行的建议。`

  const user = `学生信息：
- 年级：${grade}
- 专业：${major}
- 意向方向：${direction}
- 意向国家/地区：${countries.join('、')}

已生成的规划骨架（不要重复这些内容，在此基础上补充更具体的建议）：
${planSummary}

时间轴概要：
${timelineSummary}

请基于以上信息，生成个性化建议，严格使用以下格式：

### 总体策略
（2-3句话，针对该学生专业与目标国家的核心策略，要具体到专业方向）

### 分阶段建议
（针对当前起每个年级各给 1-2 条关键行动建议，要具体到该专业/该国家，不要泛泛而谈）

### 特别提醒
（1-3 条该学生尤其需注意的事项，如关键时间节点、材料准备、XJTLU 特有优势的利用等）

要求：
- 建议具体、可执行，避免"好好学习""提前准备"等空话
- 结合西交利物浦大学全英文教学和 2+2 模式的特点
- 总字数 300-500 字`

  return [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ]
}

/**
 * 主入口：生成 AI 个性化建议
 * @param {object} input - 原始用户输入
 * @param {object} plan - 规划引擎生成的规划
 * @param {string} apiKey - DeepSeek API Key
 * @returns {Promise<string>} markdown 格式的建议文本
 */
export async function generateAIAdvice(input, plan, apiKey) {
  if (!apiKey) throw new Error('请先在首页填写 DeepSeek API Key')
  const messages = buildAIPrompt(input, plan)
  return await callDeepSeek(messages, apiKey)
}
