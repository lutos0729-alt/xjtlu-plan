/**
 * 升学规划知识库
 * 数据来源：手动整理 Top 100 海外院校常见录取要求与申请时间线
 * 覆盖 XJTLU 同学最常申的国家/方向，后续可持续补充
 *
 * 注：GPA 目标基于西交利物浦大学（XJTLU）英国学位等级制
 *   70+ = 一等学位（First Class，相当于 GPA 4.0）
 *   60-69 = 二等一学位（2:1，相当于 GPA 3.3-3.7）
 *   50-59 = 二等二学位（2:2，相当于 GPA 2.7-3.0）
 */

// 年级 → 剩余年限与起点
export const GRADES = {
  '大一': { remainingYears: 4, startYear: '大一', stage: '起步期' },
  '大二': { remainingYears: 3, startYear: '大二', stage: '加速期' },
  '大三': { remainingYears: 2, startYear: '大三', stage: '冲刺期' },
  '大四': { remainingYears: 1, startYear: '大四', stage: '申请期' },
  '研一': { remainingYears: 2, startYear: '研一', stage: '科研积累期' },
  '研二': { remainingYears: 1, startYear: '研二', stage: '申请冲刺期' }
}

// 完整学年顺序
export const YEAR_ORDER = ['大一', '大二', '大三', '大四', '研一', '研二']

// 意向方向 → 侧重维度
export const DIRECTIONS = {
  '授课型硕士': {
    label: '授课型硕士',
    emphasis: ['GPA', '实习', '语言'],
    keyPoints: '适合：本科毕业直接读，就业导向，快速拿学位回国求职',
    researchWeight: 'low',
    internshipWeight: 'high'
  },
  '研究型硕士': {
    label: '研究型硕士',
    emphasis: ['GPA', '科研', '套磁'],
    keyPoints: '适合：计划后续读博士，看重科研经历',
    researchWeight: 'high',
    internshipWeight: 'medium'
  },
  '博士': {
    label: '博士',
    emphasis: ['科研', '论文', '套磁', 'RP'],
    keyPoints: '重视研究计划(RP)与导师匹配，需有论文或科研产出',
    researchWeight: 'veryHigh',
    internshipWeight: 'low'
  }
}

// 意向国家 → 申请规则、量化目标、关键节点
export const COUNTRIES = {
  '英国': {
    label: '英国',
    flag: '🇬🇧',
    applicationType: 'rolling',
    applicationWindow: '9月 - 次年1月（滚动录取，先到先得）',
    languageTarget: '雅思 7.0（单项不低于 6.5）',
    gpaTarget: '均分 65+（高 2:1）/ 70+（一等学位）',
    standardizedTest: '一般不需要 GRE/GMAT，部分商科要 GMAT',
    programDuration: '1 年制硕士为主',
    featureNote: '早申优势明显，热门项目 10-11 月可能满位',
    milestones: [
      { name: '语言达标', window: '大三暑假前', desc: '雅思达到直录要求，否则需配语言班' },
      { name: '选校定校', window: '大三暑假', desc: '确定 6-8 所目标院校与专业' },
      { name: '递交申请', window: '大四上 9-10月', desc: '开放即递交，抢占 rolling 名额' },
      { name: '收 offer', window: '大四上 11月-次年3月', desc: '滚动出结果，注意留位费期限' }
    ]
  },
  '美国': {
    label: '美国',
    flag: '🇺🇸',
    applicationType: 'deadline',
    applicationWindow: '12月15日 - 次年1月15日（秋季入学主轮截止）',
    languageTarget: '托福 100+ / 雅思 7.0+',
    gpaTarget: '均分 65+（高 2:1）/ 70+（一等学位，Top 30 必须）',
    standardizedTest: 'GRE 320+（理工科）/ GMAT 700+（商科），部分项目可选',
    programDuration: '1.5 - 2 年制',
    featureNote: '截止日期明确，材料要求最全（PS/CV/推荐信/Writing Sample）',
    milestones: [
      { name: '标化出分', window: '大三暑假前', desc: 'GRE/GMAT 考出目标分数' },
      { name: '语言达标', window: '大三暑假', desc: '托福/雅思达到门槛' },
      { name: '选校定校', window: '大三下 - 暑假', desc: '确定 8-12 所，分冲刺/匹配/保底' },
      { name: '材料定稿', window: '大四上 9-11月', desc: 'PS、CV、推荐信、Writing Sample 完成' },
      { name: '递交申请', window: '大四上 12月', desc: '在 deadline 前递交所有项目' },
      { name: '收 offer', window: '次年 2-4月', desc: '集中放榜，4·15 前确定去留' }
    ]
  },
  '澳大利亚': {
    label: '澳大利亚',
    flag: '🇦🇺',
    applicationType: 'rolling',
    applicationWindow: '全年滚动，提前 6-12 个月申请（2月/7月两次入学）',
    languageTarget: '雅思 6.5-7.0（单项不低于 6.0）',
    gpaTarget: '均分 60+（2:1）/ 65+（八大名校）',
    standardizedTest: '一般不需要 GRE/GMAT',
    programDuration: '1 - 2 年制',
    featureNote: '可用 5 学期/7 学期成绩单申请有条件录取',
    milestones: [
      { name: '语言达标', window: '大三暑假', desc: '雅思达到直录或配语言班要求' },
      { name: '递交申请', window: '大三下 - 大四上', desc: '提前申请有条件录取(CoE)' },
      { name: '换无条件 offer', window: '大四下', desc: '补交完整成绩单与毕业证' },
      { name: '签证办理', window: '大四下 - 毕业后', desc: '办理学生签证，准备入学' }
    ]
  },
  '中国香港': {
    label: '中国香港',
    flag: '🇭🇰',
    applicationType: 'rolling',
    applicationWindow: '9月 - 次年3月（滚动，分轮次）',
    languageTarget: '雅思 6.5+（港三校建议 7.0）',
    gpaTarget: '均分 65+（港前三）/ 70+（热门专业）',
    standardizedTest: '部分商科要 GMAT，理工科一般不需要',
    programDuration: '1 年制为主',
    featureNote: '港三校认可利物浦学位，一等学位申请港前三有优势',
    milestones: [
      { name: '语言达标', window: '大三暑假前', desc: '雅思至少 6.5，港三校建议 7.0' },
      { name: '选校定校', window: '大三暑假', desc: '确定港校梯队，冲稳保搭配' },
      { name: '递交申请', window: '大四上 9-11月', desc: '首轮递交优势最大' },
      { name: '面试准备', window: '大四上 11月-次年2月', desc: '部分专业有面试/笔试' },
      { name: '收 offer', window: '次年 1-4月', desc: '分轮次放榜' }
    ]
  },
  '新加坡': {
    label: '新加坡',
    flag: '🇸🇬',
    applicationType: 'deadline',
    applicationWindow: '11月 - 次年3月（NUS/NTU 主轮）',
    languageTarget: '雅思 6.5+（建议 7.0）',
    gpaTarget: '均分 65+（NUS/NTU）/ 70+（热门专业）',
    standardizedTest: '部分项目要 GRE/GMAT，商科建议 GMAT',
    programDuration: '1 - 1.5 年制',
    featureNote: 'NUS/NTU 亚洲顶尖，一等学位+强软背景才有竞争力',
    milestones: [
      { name: '语言达标', window: '大三暑假前', desc: '雅思至少 6.5' },
      { name: '标化出分', window: '大三暑假', desc: 'GRE/GMAT 如项目要求则需考出' },
      { name: '选校定校', window: '大三暑假', desc: '确定 NUS/NTU 及其他项目' },
      { name: '递交申请', window: '大四上 11月-12月', desc: '赶第一轮 deadline' },
      { name: '收 offer', window: '次年 2-5月', desc: '陆续放榜' }
    ]
  },
  '加拿大': {
    label: '加拿大',
    flag: '🇨🇦',
    applicationType: 'deadline',
    applicationWindow: '12月 - 次年2月（秋季入学截止）',
    languageTarget: '托福 100+ / 雅思 7.0+',
    gpaTarget: '均分 70+（一等学位，后两年成绩尤为重要）',
    standardizedTest: '部分项目要 GRE，商科要 GMAT',
    programDuration: '1.5 - 2 年制',
    featureNote: '重视后两年 GPA，部分项目需套磁导师',
    milestones: [
      { name: '语言达标', window: '大三暑假', desc: '托福/雅思达到门槛' },
      { name: '标化出分', window: '大三暑假', desc: 'GRE/GMAT 按项目要求' },
      { name: '套磁导师', window: '大三下 - 暑假', desc: '研究型项目需提前联系导师' },
      { name: '递交申请', window: '大四上 12月-次年2月', desc: '按各校 deadline 递交' },
      { name: '收 offer', window: '次年 3-5月', desc: '陆续放榜' }
    ]
  },
  '欧洲大陆': {
    label: '欧洲大陆',
    flag: '🇪🇺',
    applicationType: 'deadline',
    applicationWindow: '12月 - 次年3月（各国不同，以秋季入学为主）',
    languageTarget: '雅思 6.5+ / 托福 90+（英文授课项目）',
    gpaTarget: '均分 60+（2:1）/ 65+（顶尖项目）',
    standardizedTest: '部分项目要 GRE，多数不需要',
    programDuration: '1.5 - 2 年制',
    featureNote: '德法荷瑞士等国，英文授课项目增多，部分需小语种成绩',
    milestones: [
      { name: '语言达标', window: '大三暑假前', desc: '英文项目需雅思/托福，部分需德语/法语证书' },
      { name: '选校定校', window: '大三暑假', desc: '确定目标国家与院校，注意授课语言' },
      { name: '递交申请', window: '大四上 12月-次年3月', desc: '按各国 deadline 递交' },
      { name: '收 offer', window: '次年 3-6月', desc: '陆续放榜，部分需面试' }
    ]
  },
  '英联邦': {
    label: '英联邦',
    flag: '🌏',
    applicationType: 'rolling',
    applicationWindow: '全年滚动，提前 6-12 个月申请',
    languageTarget: '雅思 6.5+',
    gpaTarget: '均分 60+（2:1）',
    standardizedTest: '一般不需要 GRE/GMAT',
    programDuration: '1 - 2 年制',
    featureNote: '新西兰等英联邦国家，申请制与英国相似，可同时申请多国',
    milestones: [
      { name: '语言达标', window: '大三暑假', desc: '雅思至少 6.5' },
      { name: '递交申请', window: '大三下 - 大四上', desc: '提前申请有条件录取' },
      { name: '换无条件 offer', window: '大四下', desc: '补交完整成绩单与毕业证' },
      { name: '签证办理', window: '大四下 - 毕业后', desc: '办理学生签证' }
    ]
  },
  '日韩': {
    label: '日韩',
    flag: '🗾',
    applicationType: 'deadline',
    applicationWindow: '10月 - 12月（次年秋季入学为主）',
    languageTarget: '日语 N2+ / 韩语 TOPIK 4级+ 或 雅思 6.5+（英文项目）',
    gpaTarget: '均分 65+（高 2:1）',
    standardizedTest: '一般不需要 GRE/GMAT',
    programDuration: '2 年制为主',
    featureNote: '英文授课项目增多，部分需小语种成绩，奖学金机会多',
    milestones: [
      { name: '语言准备', window: '大二起', desc: '小语种需长期准备，或走英文项目' },
      { name: '语言达标', window: '大三暑假前', desc: '日语 N2+/韩语 TOPIK 4级+ 或雅思 6.5+' },
      { name: '选校定校', window: '大三暑假', desc: '确定目标院校与项目' },
      { name: '递交申请', window: '大四上 10-12月', desc: '按各校 deadline 递交' },
      { name: '收 offer', window: '次年 2-4月', desc: '陆续放榜' }
    ]
  }
}

// 各阶段基础任务模板（按学年 × 学期阶段）
// 后由 planner 根据方向/国家做差异化裁剪与补充
export const PHASE_TASKS = {
  '大一': {
    '上学期': {
      focus: '适应大学节奏，夯实学业基础',
      tasks: [
        '稳住 GPA，目标均分 85+（升学核心指标从大一算起）',
        '了解本专业培养方案与未来升学方向',
        '加入 1-2 个社团，探索兴趣',
        '开始日常英语输入（听/读），培养语感'
      ]
    },
    '寒假': {
      focus: '初步了解升学路径',
      tasks: [
        '了解海外硕/博申请的基本要素（GPA/语言/科研/实习）',
        '背单词起步，目标 4000-6000 词汇量',
        '与学长学姐交流，收集经验'
      ]
    },
    '下学期': {
      focus: '保持学业，开始背景积累',
      tasks: [
        '继续稳 GPA，争取核心课程高分',
        '参加学科竞赛或大创项目（理工科）/ 课题调研（文商科）',
        '确定语言考试方向（雅思 or 托福）',
        '关注目标国家/院校信息'
      ]
    },
    '暑假': {
      focus: '第一段经历积累',
      tasks: [
        '完成第一段实习或科研助理（不求高端，重在体验方向）',
        '集中攻克英语，争取开学前词汇量达标',
        '整理已修课程与成绩，评估 GPA 走势'
      ]
    }
  },
  '大二': {
    '上学期': {
      focus: 'GPA 冲刺，深化背景',
      tasks: [
        'GPA 进入冲刺期，核心专业课争取 88+',
        '语言备考进入正轨，开始系统刷题/上课',
        '科研：加入导师课题组或申报大创（研究型方向必做）',
        '实习：瞄准第二段，提升行业匹配度'
      ]
    },
    '寒假': {
      focus: '语言首考 / 寒期实习',
      tasks: [
        '雅思/托福首考（建议寒假，摸底真实水平）',
        '或进行一段寒期实习（2-4 周）',
        '复盘首考成绩，制定提分计划'
      ]
    },
    '下学期': {
      focus: '确定方向，深化科研/实习',
      tasks: [
        '明确升学方向（授课/研究/博士）与意向国家',
        '科研产出：争取参与论文或会议（研究型/博士）',
        '实习升级：进入目标行业核心岗位',
        '语言二战（如首考未达标）'
      ]
    },
    '暑假': {
      focus: '语言出分 + 暑期经历',
      tasks: [
        '雅思/托福达到目标分数（最晚大三上开学前）',
        '完成一段高质量暑期科研或实习（6-8 周）',
        '如需 GRE/GMAT，开始基础备考'
      ]
    }
  },
  '大三': {
    '上学期': {
      focus: '语言达标，启动选校',
      tasks: [
        '保住 GPA，后两年成绩尤为关键',
        '语言必须达标（切勿拖到申请季）',
        '开始选校调研，建立目标院校清单',
        '研究型/博士：启动套磁，联系意向导师',
        'GRE/GMAT 出分（如目标国家/项目需要）'
      ]
    },
    '寒假': {
      focus: '选校定校 + 经历补充',
      tasks: [
        '确定 6-12 所目标院校（冲/稳/保搭配）',
        '完成寒期实习或科研冲刺',
        'PS/SoP 初稿动笔（梳理经历主线）'
      ]
    },
    '下学期': {
      focus: '材料准备 + 套磁深化',
      tasks: [
        '标化最终出分（GRE/GMAT/语言）',
        'PS/SoP 反复打磨，针对不同项目定制',
        '联系推荐人（2-3 位），确认推荐意向',
        '研究型/博士：深化套磁，争取导师口头 offer',
        'CV 定稿，整理所有经历与产出'
      ]
    },
    '暑假': {
      focus: '材料定稿，进入申请季',
      tasks: [
        '所有申请材料定稿（PS/CV/推荐信/RP）',
        '推荐信确认提交方式（网推/纸质）',
        'Writing Sample / 作品集完成（如需）',
        '语言冲刺最终分数（如未达标）'
      ]
    }
  },
  '大四': {
    '上学期': {
      focus: '递交申请，把握时间线',
      tasks: [
        '按目标国家时间线递交申请（英美港新节奏不同）',
        '跟踪推荐信提交状态',
        '准备面试（部分项目有面/笔）',
        '保持 GPA，不可掉以轻心',
        '补申：根据早申结果调整策略'
      ]
    },
    '寒假': {
      focus: '等 offer + 补申',
      tasks: [
        '跟踪申请状态，及时补件',
        '如有缺口，补申匹配/保底项目',
        '准备可能的面试'
      ]
    },
    '下学期': {
      focus: '定校 + 签证 + 行前',
      tasks: [
        '比较 offer，缴纳留位费确定去留',
        '办理签证（按目标国家流程）',
        '补交最终成绩单与毕业证明',
        '行前准备：住宿、体检、机票'
      ]
    },
    '暑假': {
      focus: '行前收尾',
      tasks: [
        '完成签证与入境准备',
        '联系同校学长学姐，了解入学事宜',
        '准备开学注册材料'
      ]
    }
  },
  '研一': {
    '上学期': {
      focus: '深入科研，确定博士方向',
      tasks: [
        '与导师充分沟通，明确研究方向与课题',
        '系统阅读领域文献，建立研究框架',
        '保持硕士课程高分，GPA 仍是重要参考',
        '语言成绩如未达标，尽快出分'
      ]
    },
    '寒假': {
      focus: '学术交流 + 套磁启动',
      tasks: [
        '整理文献综述，尝试撰写小论文或研究计划',
        '开始关注目标博士项目与导师，整理候选清单',
        '如有条件，参加学术会议或暑期学校'
      ]
    },
    '下学期': {
      focus: '论文产出 + 深化套磁',
      tasks: [
        '推进课题研究，争取投稿 1 篇会议或期刊论文',
        '向目标导师发套磁信，附 CV 和研究摘要',
        '确定 8-15 所目标院校，分冲/稳/保',
        'GRE/GMAT 出分（如目标项目要求）'
      ]
    },
    '暑假': {
      focus: '暑研 + 文书准备',
      tasks: [
        '争取一段海外暑研经历（对博士申请极为加分）',
        'PS/SoP/Research Proposal 初稿动笔',
        '联系推荐人（2-3 位），确认推荐意向',
        '持续套磁，争取导师口头意向'
      ]
    }
  },
  '研二': {
    '上学期': {
      focus: '递交申请，论文冲刺',
      tasks: [
        '按目标国家时间线递交博士申请',
        '论文投稿/修改/接收（有接收记录是强加分）',
        'PS/RP 反复打磨，针对不同导师定制',
        '跟踪推荐信提交状态',
        '准备面试（博士面试通常涉及研究深挖）'
      ]
    },
    '寒假': {
      focus: '面试 + 补申',
      tasks: [
        '准备正式面试：研究方向陈述 + 未来计划',
        '跟踪申请状态，及时补件',
        '如有缺口，补申匹配项目',
        '继续推进论文产出'
      ]
    },
    '下学期': {
      focus: '定校 + 签证 + 衔接博士',
      tasks: [
        '比较 offer（含奖学金/RA/TA），确定去向',
        '办理签证',
        '与未来导师沟通入学前准备事项',
        '补交最终成绩单与学位证明',
        '完成硕士论文答辩与毕业手续'
      ]
    },
    '暑假': {
      focus: '行前准备',
      tasks: [
        '完成签证与入境准备',
        '联系未来导师与课题组同门',
        '预习博士阶段所需的先修知识'
      ]
    }
  }
}

// 方向差异化补充任务
export const DIRECTION_TASKS = {
  '授课型硕士': {
    extra: {
      '大二暑假': ['优先积累 2 段以上对口实习，提升就业导向项目竞争力'],
      '大三下学期': ['梳理课程匹配度，对照目标项目先修课要求查漏补缺']
    }
  },
  '研究型硕士': {
    extra: {
      '大二下学期': ['主动联系本系导师，争取进组做科研助理'],
      '大三上学期': ['启动套磁：向意向导师发送学术背景邮件'],
      '大三下学期': ['撰写 Research Proposal 初稿，针对导师方向定制']
    }
  },
  '博士': {
    extra: {
      '大二下学期': ['进组科研，争取一作或共一论文产出'],
      '大三上学期': ['套磁核心导师，附 CV + 研究兴趣陈述'],
      '大三下学期': ['打磨 Research Proposal，争取论文投稿/在审'],
      '大三暑假': ['准备 Writing Sample 与发表论文清单']
    }
  }
}
