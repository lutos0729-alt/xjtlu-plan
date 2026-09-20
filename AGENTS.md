# XJTLU 升学规划 - 项目上下文

## 项目概述
面向西交利物浦大学（XJTLU）本科/研究生的海外升学规划工具。用户输入年级、专业/项目、申请类型、意向方向、意向国家，系统生成个性化升学规划，支持导出 PDF。

## 技术栈
- **框架**: uni-app (Vue 3 + Vite)
- **语言**: JavaScript
- **部署**: 腾讯云 CloudBase 静态托管（国内）+ Vercel（海外）
- **版本管理**: GitHub 仓库 lutos0729-alt/xjtlu-plan

## 开发命令
```bash
npm install          # 安装依赖
npm run dev:h5       # 本地预览 (http://localhost:5173)
npm run build:h5     # 构建生产版本 (输出到 dist/build/h5/)
```

## 部署命令
```bash
# 构建后上传到 CloudBase
tcb hosting deploy dist/build/h5 -e xjtlu-plan-d9gi4onzb85864805
```
CloudBase 域名: https://xjtlu-plan-d9gi4onzb85864805-1471653839.tcloudbaseapp.com

## 项目结构
```
src/
├── pages/
│   ├── cover/cover.vue       # 封面主页（入口页）
│   ├── index/index.vue       # 输入表单页
│   └── plan/plan.vue         # 规划展示页
├── data/
│   └── knowledgeBase.js      # 知识库（各国录取要求、任务模板）
├── utils/
│   └── planner.js            # 规划引擎（输入→生成结构化规划）
├── pages.json                # 路由配置
├── manifest.json             # uni-app 配置
└── App.vue                   # 全局样式
```

## 核心文件说明

### knowledgeBase.js
存储各国升学数据，按国家分键：
- `gpa`: GPA 要求（用西浦英制：70+=一等, 60+=2:1）
- `language`: 语言要求（雅思/托福）
- `standardized`: 标化考试（GRE/GMAT，部分国家为空）
- `timeline`: 申请时间线
- `keyDates`: 关键节点
- `featureNote`: 该国申请特点
- `tasks`: 按学期的任务模板

支持的国家: 英国、美国、澳大利亚、中国香港、新加坡、加拿大、欧洲大陆、英联邦、日韩

### planner.js
规划引擎核心逻辑：
1. `generatePlan(input)` - 主入口
2. 根据年级截取时间轴长度（大一→4年, 大二→3年, 研一→2年, 研二→1年）
3. 根据学制（1年/1.5年/2年）裁剪研究生时间轴
4. 按国家差异化（英国 rolling vs 美国 deadline）
5. 按申请类型注入不同任务（授课型重实习, 研究型重科研, 博士重套磁/论文）
6. 关键词匹配生成个性化建议（从"补充说明"文本提取）

### index.vue (输入页)
- 年级选择（大一~大四 + 研一~研二）
- 专业/项目（按年级动态显示，研一研二填学制）
- 申请类型（授课型/研究型/博士）
- 意向方向（自定义文本框）
- 意向国家（多选，"其他"可展开子列表）
- 补充说明（选填，最多500字）

### plan.vue (规划页)
- 顶部概览（核心目标 + 年级标签 + 学制标签 + 方向）
- 每个选中国家独立段落（核心目标→量化目标→申请节奏→关键节点）
- 共享时间轴（按学年×学期，含任务清单）
- 个性化建议区块（基于关键词匹配，仅填写补充说明时显示）
- PDF 导出（html2canvas + jspdf，静态导入）
- 复制摘要

### cover.vue (封面页)
- 西交利物浦大学图书馆背景图 + 紫蓝渐变遮罩
- 功能标签展示
- "开始制定我的规划" 按钮跳转输入页
- 页面切换 CSS 渐入动画

## 西浦特殊背景
- 全英文教学，学位由利物浦大学授予
- GPA 用英制：70+ = 一等学位（满绩），60+ = 2:1
- 2+2 模式：部分学生在利物浦完成后两年
- 非 985/211，但利物浦学位受海外院校认可
- 升学主要面向海外 Top 100 院校

## 当前状态 (V1)
- [x] 封面主页
- [x] 输入表单（年级、专业/项目、申请类型、意向方向、国家多选、补充说明）
- [x] 规划引擎（多国家、多方向、年级定制、学制识别）
- [x] 个性化建议（关键词匹配，非 AI）
- [x] PDF 导出
- [x] 复制摘要
- [x] CloudBase 部署（国内可访问）

## V2 待开发
- [ ] 进度追踪（任务勾选、完成度统计）
- [ ] 用户账号系统（登录、数据持久化）
- [ ] AI 个性化建议（DeepSeek API，需云函数代理）
- [ ] 更多专业细分数据（商科/理工/人文差异化）
- [ ] 具体 Top 100 院校库（从国家级细化到校级）
- [ ] 微信小程序端编译发布

## 注意事项
- PDF 导出用静态 import（动态 import 在生产构建中路径会出问题）
- CloudBase 静态托管不支持 API 代理，DeepSeek AI 功能需云函数
- COS 默认域名会强制下载 HTML，必须用 CloudBase 托管
- Vercel 域名在国内被墙，国内用户走 CloudBase
- `vite.config.js` 中 html2canvas 和 jspdf 配置在 optimizeDeps.exclude
