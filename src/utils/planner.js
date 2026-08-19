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

// 主函数：生成完整规划（支持多国家）
export function generatePlan(input) {
  const { grade, major, direction, countries } = input

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
  const countryPlans = validCountries.map((c) => buildCountryPlan(direction, c))

  const overview = {
    grade,
    major,
    direction,
    directionLabel: dirInfo.label,
    countries: validCountries,
    countryFlags: validCountries.map((c) => COUNTRIES[c].flag),
    countryLabels: validCountries.map((c) => COUNTRIES[c].label),
    remainingYears: gradeInfo.remainingYears,
    stage: gradeInfo.stage,
    keyPoints: dirInfo.keyPoints
  }

  return {
    overview,
    timeline,
    countryPlans,
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
