/**
 * 升学规划引擎
 * 输入：{ grade, major, direction, countries: [] }
 * 输出：结构化规划（总览 / 时间轴 / 各国家独立规划段落）
 */
import {
  GRADES,
  YEAR_ORDER,
  DIRECTIONS,
  COUNTRIES,
  PHASE_TASKS,
  DIRECTION_TASKS
} from '../data/knowledgeBase.js'

// 阶段顺序
const PHASE_ORDER = ['上学期', '寒假', '下学期', '暑假']

// 核心目标摘要（按方向 + 国家生成）
function buildCoreTargets(direction, country) {
  const dir = DIRECTIONS[direction]
  const cty = COUNTRIES[country]
  const targets = [cty.gpaTarget.split('（')[0], cty.languageTarget]

  if (/^(GRE|GMAT)\s*\d/.test(cty.standardizedTest)) {
    targets.push('标化达标（GRE/GMAT）')
  }

  if (dir.researchWeight === 'veryHigh' || dir.researchWeight === 'high') {
    targets.push('1-2 段科研 + 论文产出')
  } else {
    targets.push('1-2 段对口实习')
  }

  return targets
}

// 经历目标（按方向）
function buildExperienceTarget(direction) {
  const dir = DIRECTIONS[direction]
  if (dir.researchWeight === 'veryHigh') {
    return '1-2 段深度科研 + 至少 1 篇论文（一作优先）'
  }
  if (dir.researchWeight === 'high') {
    return '1 段科研 + 1 段实习（科研为主）'
  }
  return '2 段以上对口实习 + 课程匹配度高'
}

// 检测学制年限（从专业/项目栏或补充说明中提取）
function detectDuration(text) {
  if (!text) return null
  const lower = text.toLowerCase()
  if (/1\.5\s*年|一年半|1\.5年制/.test(text) || /1\.5\s*年|一年半/.test(lower)) return 1.5
  if (/(?<!\d)1\s*年(?!.*\d)|一年制|1年制/.test(text)) return 1
  if (/(?<!\d)2\s*年|两年制|2年制/.test(text) || /(?<!\d)2\s*年/.test(lower)) return 2
  if (/3\s*年|三年制/.test(text)) return 3
  return null
}

// 根据学制裁剪时间轴
function trimTimelineByDuration(timeline, grade, duration) {
  if (!duration || !['研一', '研二'].includes(grade)) return timeline
  if (duration >= 2) return timeline

  const result = []
  for (const yearData of timeline) {
    if (yearData.year === '研一') {
      if (duration === 1) {
        // 1年制：研一只保留上学期+寒假+下学期，去掉暑假
        result.push({
          ...yearData,
          phases: yearData.phases.filter((p) => p.name !== '暑假')
        })
      } else {
        // 1.5年制：研一完整保留
        result.push(yearData)
      }
    } else if (yearData.year === '研二') {
      if (duration === 1.5) {
        // 1.5年制：研二只保留上学期
        result.push({
          ...yearData,
          phases: yearData.phases.filter((p) => p.name === '上学期')
        })
      }
      // 1年制：无研二
    } else {
      result.push(yearData)
    }
  }
  return result
}

// 生成时间轴：从当前年级起截取到毕业（与国家无关，年级+方向驱动）
function buildTimeline(grade, direction) {
  const startIdx = YEAR_ORDER.indexOf(grade)
  const years = YEAR_ORDER.slice(startIdx)
  const dirExtra = DIRECTION_TASKS[direction]?.extra || {}

  return years.map((year, i) => {
    const yearPhases = PHASE_TASKS[year]
    const phases = PHASE_ORDER
      .filter((p) => yearPhases[p])
      .map((phaseName) => {
        const phase = yearPhases[phaseName]
        const tasks = [...phase.tasks]
        const key = `${year}${phaseName}`
        if (dirExtra[key]) {
          tasks.push(...dirExtra[key])
        }
        return {
          name: phaseName,
          focus: phase.focus,
          tasks
        }
      })

    return {
      year,
      yearIndex: startIdx + i + 1,
      isCurrent: i === 0,
      phases
    }
  })
}

// 单个国家规划段落
function buildCountryPlan(direction, country) {
  const cty = COUNTRIES[country]
  return {
    country,
    flag: cty.flag,
    label: cty.label,
    coreTargets: buildCoreTargets(direction, country),
    targets: {
      gpa: cty.gpaTarget,
      language: cty.languageTarget,
      standardized: cty.standardizedTest,
      experience: buildExperienceTarget(direction),
      programDuration: cty.programDuration
    },
    milestones: cty.milestones,
    applicationInfo: {
      type: cty.applicationType,
      window: cty.applicationWindow,
      note: cty.featureNote,
      typeLabel:
        cty.applicationType === 'rolling' ? '滚动录取（先到先得）' : '固定截止（赶 deadline）'
    }
  }
}

// 关键词匹配：分析用户补充说明，生成个性化建议
const KEYWORD_GROUPS = [
  {
    category: '科研兴趣',
    items: [
      { keywords: ['人工智能', 'AI', '机器学习', '深度学习', 'ML', 'DL'], tip: 'AI/机器学习方向竞争激烈，建议尽早联系导师进实验室，争取至少 1 篇论文产出（会议优先），Kaggle 比赛也是加分项。' },
      { keywords: ['计算机视觉', 'CV', '图像处理'], tip: 'CV 方向需要扎实的数学基础（线性代数、概率论），建议重点修读相关课程并参与视觉相关科研项目。' },
      { keywords: ['自然语言处理', 'NLP', '大模型', 'LLM'], tip: 'NLP/大模型方向目前热度极高，建议关注 ACL/EMNLP 等顶会论文，尝试复现经典模型并在 GitHub 开源。' },
      { keywords: ['数据科学', '大数据', '数据分析', 'data science'], tip: '数据科学方向建议积累 SQL/Python 实战项目，Kaggle 排名和数据处理项目经历是重要加分项。' },
      { keywords: ['金融科技', '金融工程', '量化', '金工', 'fintech'], tip: '金工/量化方向对数学要求高，建议加强随机过程、统计建模课程，CFA/FRM 考试也可锦上添花。' },
      { keywords: ['生物信息', '生物医学', '计算生物'], tip: '交叉学科方向适合利用 XJTLU 多学科背景，建议联系生物+计算机双背景导师。' },
      { keywords: ['网络安全', '信息安全', '区块链', '密码学'], tip: '安全方向建议参与 CTF 竞赛积累实战经验，关注 CVE 漏洞研究，区块链方向可关注智能合约安全。' },
      { keywords: ['人机交互', 'HCI', '用户体验', 'UX', 'UI'], tip: 'HCI 方向建议积累用户研究方法训练，设计作品集比论文更重要，尝试参与实际产品设计项目。' },
      { keywords: ['系统', '分布式', '云计算', '操作系统', '内核'], tip: '系统方向门槛较高，建议深入理解底层原理，参与开源系统项目（如 Linux 内核贡献）是强加分。' }
    ]
  },
  {
    category: '现有经历',
    items: [
      { keywords: ['实习', '工作经历', '工作经验'], tip: '已有一段以上实习经历是优势，建议确保实习内容与目标方向对口，并争取拿到主管推荐信。' },
      { keywords: ['科研', '实验室', '导师', '课题组'], tip: '已有科研经历很好，建议争取论文产出（一作优先），并让导师写推荐信。' },
      { keywords: ['论文', '发表', 'paper', '顶会'], tip: '论文产出是申请 Top 30 研究型项目的关键加分项，建议持续打磨投稿。' },
      { keywords: ['比赛', '竞赛', '获奖', 'ACM', '数学建模', 'Kaggle'], tip: '竞赛获奖是申请亮点，建议选择 1-2 个高含金量竞赛深入准备，拿到名次比泛泛参与更有价值。' },
      { keywords: ['项目', 'github', '开源', '作品集'], tip: '项目经历是 CS 方向的重要加分项，建议在 GitHub 维护高质量项目并完善 README 文档。' },
      { keywords: ['交换', '交流', '海外', '暑校', 'summer school'], tip: '海外经历对申请有正面影响，建议争取拿到海外教授推荐信。' }
    ]
  },
  {
    category: '目标与方向',
    items: [
      { keywords: ['Top10', 'Top 10', '常春藤', 'ivy', 'MIT', 'Stanford', 'CMU', 'Berkeley', '剑桥', '牛津'], tip: '目标 Top 10 竞争极其激烈，建议 GPA 达到一等学位（70+），语言和标化远超门槛，且需要突出的科研或实习亮点。' },
      { keywords: ['Top30', 'Top 30', '名校', '名 program'], tip: '目标 Top 30 需要 GPA 65+（一等优先），至少 1 段高质量科研或实习，推荐信来自领域内有影响力的教授。' },
      { keywords: ['全奖', '奖学金', 'RA', 'TA', 'fellowship'], tip: '申请全奖需重点关注研究型项目，提前套磁目标导师，展示自己的研究潜力和方向匹配度。' },
      { keywords: ['转专业', '跨专业', '零基础'], tip: '跨专业申请需通过先修课、证书或项目证明目标方向的能力储备，建议尽早补齐核心课程。' },
      { keywords: ['博士', 'PhD', '直博'], tip: '博士申请核心是科研匹配度，建议尽早锁定研究方向，深度参与 1-2 段科研并争取论文产出。' },
      { keywords: ['授课型', '就业', '找工作', 'industry'], tip: '授课型硕士以就业为导向，建议重点积累 2 段以上对口实习，关注项目就业数据和课程实用性。' }
    ]
  },
  {
    category: '个人背景',
    items: [
      { keywords: ['2+2', '利物浦', 'UK campus'], tip: '2+2 模式下在利物浦期间的推荐信和成绩尤为重要，建议争取利物浦教授的强推荐信。' },
      { keywords: ['低GPA', '均分低', '成绩不好', '挂科'], tip: 'GPA 偏低需通过高语言分数、强实习/科研来弥补，也可考虑先读预科或申请排名稍低的学校作为跳板。' },
      { keywords: ['创业', 'startup', '自己开'], tip: '创业经历是差异化亮点，建议梳理清晰的商业模式和数据成果，展示领导力和创新思维。' },
      { keywords: ['社团', '学生会', '领导力', '志愿'], tip: '社团/志愿经历对部分项目（尤其美国）是加分项，建议突出领导力和影响力数据。' },
      { keywords: ['数学好', '数学竞赛', '数学建模'], tip: '数学优势对理工科申请非常有利，建议在 GRE Quant 部分争取满分，数学建模竞赛拿奖也是亮点。' },
      { keywords: ['英语好', '雅思高', '托福高', '语言好'], tip: '语言优势很好，建议雅思争取 7.5+（单项 7+），这能让你把更多精力放在科研和文书上。' }
    ]
  }
]

function analyzeNote(note, ctx) {
  if (!note || !note.trim()) return []
  const lower = note.toLowerCase()
  const tips = []
  const matched = new Set()

  for (const group of KEYWORD_GROUPS) {
    for (const item of group.items) {
      const hit = item.keywords.some((kw) => {
        return lower.includes(kw.toLowerCase()) || note.includes(kw)
      })
      if (hit && !matched.has(item.tip)) {
        matched.add(item.tip)
        tips.push({ category: group.category, tip: item.tip })
      }
    }
  }

  if (tips.length === 0 && note.trim().length > 5) {
    const grade = ctx.grade || ''
    tips.push({
      category: '个性化提醒',
      tip: `已记录你的补充说明。当前规划基于通用框架生成，建议结合你的具体情况重点关注时间轴中与你目标最相关的阶段任务。`
    })
  }

  return tips
}

// 主函数：生成完整规划（支持多国家）
export function generatePlan(input) {
  const { grade, major, direction, intendedDirection, countries, note } = input

  const gradeInfo = GRADES[grade]
  const dirInfo = DIRECTIONS[direction]

  if (!gradeInfo || !dirInfo) {
    throw new Error('输入参数有误，请检查年级/方向')
  }

  const countryList = Array.isArray(countries) ? countries : [countries]
  const validCountries = countryList.filter((c) => COUNTRIES[c])
  if (validCountries.length === 0) {
    throw new Error('请至少选择一个意向国家')
  }

  const timeline = buildTimeline(grade, direction)
  const fullText = `${major} ${note || ''}`
  const duration = detectDuration(fullText)
  const trimmedTimeline = trimTimelineByDuration(timeline, grade, duration)
  const countryPlans = validCountries.map((c) => buildCountryPlan(direction, c))
  const personalTips = analyzeNote(`${note || ''} ${intendedDirection || ''}`, { grade, major, direction, countries: validCountries })

  const overview = {
    grade,
    major,
    direction,
    directionLabel: dirInfo.label,
    intendedDirection: intendedDirection || '',
    countries: validCountries,
    countryFlags: validCountries.map((c) => COUNTRIES[c].flag),
    countryLabels: validCountries.map((c) => COUNTRIES[c].label),
    remainingYears: gradeInfo.remainingYears,
    stage: gradeInfo.stage,
    keyPoints: dirInfo.keyPoints,
    duration: duration
  }

  return {
    overview,
    timeline: trimmedTimeline,
    countryPlans,
    personalTips,
    hasNote: !!(note && note.trim()),
    generatedAt: new Date().toLocaleDateString('zh-CN')
  }
}

// 选项列表（供表单页使用）
// 主选国家（默认展示）
const PRIMARY_COUNTRIES = ['英国', '美国', '澳大利亚', '中国香港', '新加坡']

export const FORM_OPTIONS = {
  grades: Object.keys(GRADES),
  directions: Object.keys(DIRECTIONS).map((k) => ({
    value: k,
    label: DIRECTIONS[k].label,
    desc: DIRECTIONS[k].keyPoints
  })),
  countries: PRIMARY_COUNTRIES.map((k) => ({
    value: k,
    label: COUNTRIES[k].label,
    flag: COUNTRIES[k].flag
  })),
  otherCountries: ['加拿大', '欧洲大陆', '英联邦', '日韩'].map((k) => ({
    value: k,
    label: COUNTRIES[k].label,
    flag: COUNTRIES[k].flag
  }))
}
