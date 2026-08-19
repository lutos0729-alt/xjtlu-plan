<template>
  <view class="page">
    <view class="export-area">
      <!-- 顶部概览 -->
      <view class="hero">
        <view class="hero-bg"></view>
        <view class="hero-content">
          <view class="back-btn" @tap="goBack">‹ 返回</view>
          <view class="hero-info">
            <view class="hero-top">
              <view class="hero-flags">
                <text
                  v-for="(flag, fi) in plan.overview.countryFlags"
                  :key="fi"
                  class="hero-flag"
                >{{ flag }}</text>
              </view>
              <view class="hero-tags">
                <text class="hero-tag">{{ plan.overview.grade }}</text>
                <text class="hero-tag">{{ plan.overview.directionLabel }}</text>
              </view>
            </view>
            <text class="hero-major">{{ plan.overview.major }}</text>
            <view class="hero-meta">
              <text class="meta-item">意向：{{ plan.overview.countryLabels.join(' / ') }}</text>
              <text class="meta-dot">·</text>
              <text class="meta-item">剩余 {{ plan.overview.remainingYears }} 年</text>
              <text class="meta-dot">·</text>
              <text class="meta-item">{{ plan.overview.stage }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 各国家规划段落 -->
      <view
        class="section country-section"
        v-for="(cp, ci) in plan.countryPlans"
        :key="ci"
      >
        <!-- 国家标题 -->
        <view class="country-header">
          <text class="ch-flag">{{ cp.flag }}</text>
          <text class="ch-name">{{ cp.label }}</text>
          <view class="ch-badge">{{ cp.applicationInfo.typeLabel }}</view>
        </view>

        <!-- 核心目标 -->
        <view class="cp-block">
          <view class="section-head">
            <view class="section-icon">🎯</view>
            <text class="section-title">核心目标</text>
          </view>
          <view class="ct-chips">
            <view class="ct-chip" v-for="(t, i) in cp.coreTargets" :key="i">
              <text class="ct-num">{{ i + 1 }}</text>
              <text class="ct-text">{{ t }}</text>
            </view>
          </view>
        </view>

        <!-- 量化目标 -->
        <view class="cp-block">
          <view class="section-head">
            <view class="section-icon">📊</view>
            <text class="section-title">量化目标</text>
          </view>
          <view class="target-grid">
            <view class="target-card">
              <text class="t-label">GPA</text>
              <text class="t-value">{{ cp.targets.gpa }}</text>
            </view>
            <view class="target-card">
              <text class="t-label">语言成绩</text>
              <text class="t-value">{{ cp.targets.language }}</text>
            </view>
            <view class="target-card">
              <text class="t-label">标化考试</text>
              <text class="t-value small">{{ cp.targets.standardized }}</text>
            </view>
            <view class="target-card">
              <text class="t-label">经历要求</text>
              <text class="t-value small">{{ cp.targets.experience }}</text>
            </view>
          </view>
        </view>

        <!-- 申请节奏 -->
        <view class="cp-block">
          <view class="section-head">
            <view class="section-icon">📅</view>
            <text class="section-title">申请节奏</text>
          </view>
          <view class="apply-card">
            <view class="apply-row">
              <text class="apply-label">录取方式</text>
              <text class="apply-value">{{ cp.applicationInfo.typeLabel }}</text>
            </view>
            <view class="apply-row">
              <text class="apply-label">申请窗口</text>
              <text class="apply-value">{{ cp.applicationInfo.window }}</text>
            </view>
            <view class="apply-note">
              <text class="note-icon">💡</text>
              <text class="note-text">{{ cp.applicationInfo.note }}</text>
            </view>
          </view>
        </view>

        <!-- 关键节点 -->
        <view class="cp-block">
          <view class="section-head">
            <view class="section-icon">🏁</view>
            <text class="section-title">关键节点</text>
          </view>
          <view class="milestone-list">
            <view
              class="milestone-item"
              v-for="(m, mi) in cp.milestones"
              :key="mi"
            >
              <view class="ms-marker">
                <view class="ms-dot"></view>
                <view v-if="mi < cp.milestones.length - 1" class="ms-line"></view>
              </view>
              <view class="ms-content">
                <view class="ms-top">
                  <text class="ms-name">{{ m.name }}</text>
                  <text class="ms-window">{{ m.window }}</text>
                </view>
                <text class="ms-desc">{{ m.desc }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 时间轴 -->
      <view class="section">
        <view class="section-head">
          <view class="section-icon">🗺️</view>
          <text class="section-title">升学时间轴</text>
        </view>
        <view class="timeline">
          <view class="tl-year" v-for="(yearData, yi) in plan.timeline" :key="yi">
            <view class="year-banner" :class="{ current: yearData.isCurrent }">
              <text class="year-label">{{ yearData.year }}</text>
              <text v-if="yearData.isCurrent" class="year-now">当前</text>
            </view>

            <view class="year-phases">
              <view class="phase-item" v-for="(phase, pi) in yearData.phases" :key="pi">
                <view class="phase-side">
                  <view class="phase-dot"></view>
                  <view v-if="pi < yearData.phases.length - 1" class="phase-conn"></view>
                </view>
                <view class="phase-body">
                  <view class="phase-head">
                    <text class="phase-name">{{ phase.name }}</text>
                    <text class="phase-focus">{{ phase.focus }}</text>
                  </view>
                  <view class="task-list">
                    <view class="task-item" v-for="(task, ti) in phase.tasks" :key="ti">
                      <text class="task-bullet">●</text>
                      <text class="task-text">{{ task }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 方向说明 -->
      <view class="section">
        <view class="section-head">
          <view class="section-icon">📌</view>
          <text class="section-title">方向说明</text>
        </view>
        <view class="note-card">
          <text class="note-text">{{ plan.overview.keyPoints }}</text>
          <text class="note-gen">生成日期：{{ plan.generatedAt }}</text>
      </view>
    </view>

      <!-- AI 个性化建议 -->
      <view class="section ai-section">
        <view class="section-head">
          <view class="section-icon">✨</view>
          <text class="section-title">AI 个性化建议</text>
          <view v-if="aiAdvice && !aiLoading" class="ai-badge">已生成</view>
        </view>

        <view v-if="!aiAdvice && !aiLoading && !aiError" class="ai-card">
          <text class="ai-hint">基于你的专业和目标，AI 可生成更有针对性的建议</text>
          <button v-if="apiKey" class="ai-btn" @tap="fetchAIAdvice">生成 AI 建议</button>
          <text v-else class="ai-warn">需在首页填写 DeepSeek API Key 后使用</text>
        </view>

        <view v-if="aiLoading" class="ai-card">
          <view class="ai-spinner-wrap">
            <view class="ai-spinner"></view>
            <text class="ai-loading-text">AI 正在生成个性化建议...</text>
          </view>
        </view>

        <view v-if="aiAdvice && !aiLoading" class="ai-card">
          <view class="ai-advice" v-for="(line, li) in aiAdviceLines" :key="li">
            <text v-if="line.isHeading" class="ai-heading">{{ line.text }}</text>
            <text v-else class="ai-line">{{ line.text }}</text>
          </view>
          <button class="ai-btn ai-btn-sm" @tap="fetchAIAdvice">重新生成</button>
        </view>

        <view v-if="aiError && !aiLoading" class="ai-card">
          <text class="ai-error-text">{{ aiError }}</text>
          <button class="ai-btn ai-btn-sm" @tap="fetchAIAdvice">重试</button>
        </view>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-actions">
      <button class="action-btn secondary" @tap="goBack">重新生成</button>
      <button class="action-btn primary" @tap="copyPlan">复制摘要</button>
      <button class="action-btn export-btn" :disabled="exporting" @tap="exportPDF">
        {{ exporting ? '生成中...' : '导出 PDF' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { generatePlan } from '@/utils/planner.js'
import { generateAIAdvice } from '@/utils/ai.js'

const plan = ref(null)
const exporting = ref(false)
const apiKey = ref('')
const aiLoading = ref(false)
const aiAdvice = ref('')
const aiError = ref('')

const aiAdviceLines = computed(() => {
  if (!aiAdvice.value) return []
  return aiAdvice.value
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => {
      const trimmed = l.trim()
      if (trimmed.startsWith('### ')) {
        return { isHeading: true, text: trimmed.replace(/^###\s+/, '').replace(/\*\*/g, '') }
      }
      return { isHeading: false, text: trimmed.replace(/\*\*/g, '') }
    })
})

onMounted(() => {
  const input = uni.getStorageSync('planInput')
  if (!input || !input.grade) {
    uni.redirectTo({ url: '/pages/index/index' })
    return
  }
  apiKey.value = input.apiKey || ''
  try {
    plan.value = generatePlan(input)
  } catch (e) {
    uni.showToast({ title: '生成失败：' + e.message, icon: 'none' })
    setTimeout(() => uni.redirectTo({ url: '/pages/index/index' }), 1500)
  }
})

function goBack() {
  uni.navigateBack({ fail: () => uni.redirectTo({ url: '/pages/index/index' }) })
}

function copyPlan() {
  const p = plan.value
  if (!p) return
  const countryLines = p.countryPlans
    .map((cp) => {
      return `【${cp.label}】${cp.coreTargets.join(' / ')} | ${cp.targets.gpa} | ${cp.targets.language} | ${cp.applicationInfo.window}`
    })
    .join('\n')
  const summary = [
    `【升学规划】${p.overview.grade} · ${p.overview.major} · ${p.overview.directionLabel}`,
    `意向国家：${p.overview.countryLabels.join(' / ')}`,
    countryLines
  ].join('\n')
  uni.setClipboardData({
    data: summary,
    success: () => uni.showToast({ title: '已复制摘要', icon: 'success' })
  })
}

async function exportPDF() {
  if (exporting.value || !plan.value) return
  exporting.value = true
  uni.showLoading({ title: '正在生成 PDF...', mask: true })

  // #ifdef H5
  try {
    const html2canvas = (await import('html2canvas/dist/html2canvas.esm.js')).default
    const { jsPDF } = await import('jspdf/dist/jspdf.es.min.js')

    const el = document.querySelector('.export-area')
    if (!el) throw new Error('未找到内容区域')

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f4f5fa',
      logging: false
    })

    const imgData = canvas.toDataURL('image/jpeg', 0.92)
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = 210
    const pageHeight = 297
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position -= pageHeight
      pdf.addPage()
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const p = plan.value
    const filename = `升学规划_${p.overview.grade}_${p.overview.major}_${p.overview.countryLabels.join('+')}.pdf`
    pdf.save(filename)
    uni.hideLoading()
    uni.showToast({ title: 'PDF 已生成', icon: 'success' })
  } catch (e) {
    uni.hideLoading()
    uni.showToast({ title: '导出失败，请重试', icon: 'none' })
    console.error('PDF export error:', e)
  }
  // #endif

  // #ifndef H5
  uni.hideLoading()
  uni.showToast({ title: '小程序端可截图保存', icon: 'none' })
  // #endif

  exporting.value = false
}

async function fetchAIAdvice() {
  if (aiLoading.value || !plan.value) return
  if (!apiKey.value) {
    aiError.value = '请先在首页填写 DeepSeek API Key'
    return
  }
  aiLoading.value = true
  aiError.value = ''
  aiAdvice.value = ''
  try {
    const input = uni.getStorageSync('planInput')
    const advice = await generateAIAdvice(input, plan.value, apiKey.value)
    aiAdvice.value = advice
  } catch (e) {
    aiError.value = e.message || '生成失败，请检查 API Key 和网络后重试'
  } finally {
    aiLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f5fa;
  padding-bottom: 140rpx;
}

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
}
.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  min-height: 380rpx;
  background: linear-gradient(150deg, #4f46e5 0%, #7c3aed 60%, #9333ea 100%);
  border-radius: 0 0 44rpx 44rpx;
}
.hero-content {
  position: relative;
  z-index: 1;
  padding: 90rpx 40rpx 50rpx;
}
.back-btn {
  color: rgba(255, 255, 255, 0.9);
  font-size: 28rpx;
  margin-bottom: 30rpx;
  display: inline-block;
}
.hero-info {
  margin-bottom: 10rpx;
}
.hero-top {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 16rpx;
}
.hero-flags {
  display: flex;
  gap: 8rpx;
}
.hero-flag {
  font-size: 48rpx;
}
.hero-tags {
  display: flex;
  gap: 12rpx;
}
.hero-tag {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}
.hero-major {
  color: #fff;
  font-size: 44rpx;
  font-weight: 800;
  display: block;
  margin-bottom: 16rpx;
}
.hero-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8rpx;
}
.meta-item {
  color: rgba(255, 255, 255, 0.85);
  font-size: 24rpx;
}
.meta-dot {
  color: rgba(255, 255, 255, 0.4);
  font-size: 24rpx;
}

/* 通用 section */
.section {
  margin: 32rpx 32rpx 0;
}
.section-head {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
}
.section-icon {
  font-size: 36rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 800;
  color: #1a1a2e;
}

/* 国家段落 */
.country-section {
  background: #fff;
  border-radius: 28rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.country-header {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding-bottom: 28rpx;
  margin-bottom: 28rpx;
  border-bottom: 2rpx solid #f0f1f5;
}
.ch-flag {
  font-size: 48rpx;
}
.ch-name {
  font-size: 36rpx;
  font-weight: 800;
  color: #1a1a2e;
  flex: 1;
}
.ch-badge {
  font-size: 22rpx;
  color: #6366f1;
  background: #eef2ff;
  padding: 8rpx 20rpx;
  border-radius: 12rpx;
  font-weight: 600;
}
.cp-block {
  margin-bottom: 36rpx;
  &:last-child {
    margin-bottom: 0;
  }
}

/* 核心目标 */
.ct-chips {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.ct-chip {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.ct-num {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #eef2ff;
  color: #6366f1;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.ct-text {
  font-size: 27rpx;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1.4;
}

/* 量化目标 */
.target-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.target-card {
  width: calc((100% - 20rpx) / 2);
  background: #f9fafb;
  border-radius: 20rpx;
  padding: 28rpx;
  border: 2rpx solid #f0f1f5;
}
.t-label {
  font-size: 24rpx;
  color: #9ca3af;
  font-weight: 600;
  display: block;
  margin-bottom: 16rpx;
}
.t-value {
  font-size: 30rpx;
  font-weight: 700;
  color: #4f46e5;
  line-height: 1.4;
  &.small {
    font-size: 26rpx;
    color: #374151;
  }
}

/* 申请节奏 */
.apply-card {
  background: #f9fafb;
  border-radius: 20rpx;
  padding: 8rpx 28rpx;
  border: 2rpx solid #f0f1f5;
}
.apply-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24rpx 0;
  border-bottom: 2rpx solid #f0f1f5;
  gap: 24rpx;
  &:last-of-type {
    border-bottom: none;
  }
}
.apply-label {
  font-size: 28rpx;
  color: #6b7280;
  font-weight: 600;
  flex-shrink: 0;
}
.apply-value {
  font-size: 27rpx;
  color: #1a1a2e;
  font-weight: 600;
  text-align: right;
}
.apply-note {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  padding: 24rpx 0 8rpx;
}
.note-icon {
  font-size: 28rpx;
  flex-shrink: 0;
}
.apply-note .note-text {
  font-size: 25rpx;
  color: #6b7280;
  line-height: 1.6;
}

/* 关键节点 */
.milestone-list {
  position: relative;
}
.milestone-item {
  display: flex;
  gap: 24rpx;
  &:last-child .ms-line {
    display: none;
  }
}
.ms-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.ms-dot {
  width: 24rpx;
  height: 24rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #9333ea);
  margin-top: 8rpx;
  box-shadow: 0 0 0 6rpx rgba(99, 102, 241, 0.12);
}
.ms-line {
  width: 4rpx;
  flex: 1;
  background: #e5e7eb;
  margin: 8rpx 0;
}
.ms-content {
  padding-bottom: 32rpx;
  flex: 1;
}
.ms-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.ms-name {
  font-size: 30rpx;
  font-weight: 700;
  color: #1a1a2e;
}
.ms-window {
  font-size: 24rpx;
  color: #6366f1;
  background: #eef2ff;
  padding: 6rpx 18rpx;
  border-radius: 10rpx;
  font-weight: 600;
}
.ms-desc {
  font-size: 25rpx;
  color: #6b7280;
  line-height: 1.6;
}

/* 时间轴 */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}
.tl-year {
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.year-banner {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  padding: 24rpx 36rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &.current {
    background: linear-gradient(135deg, #ec4899, #9333ea);
  }
}
.year-label {
  color: #fff;
  font-size: 32rpx;
  font-weight: 800;
}
.year-now {
  color: #fff;
  font-size: 22rpx;
  background: rgba(255, 255, 255, 0.25);
  padding: 6rpx 18rpx;
  border-radius: 10rpx;
  font-weight: 700;
}
.year-phases {
  padding: 24rpx 32rpx 8rpx;
}
.phase-item {
  display: flex;
  gap: 24rpx;
  &:last-child .phase-conn {
    display: none;
  }
}
.phase-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 6rpx;
}
.phase-dot {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  background: #c7d2fe;
  border: 4rpx solid #eef2ff;
}
.phase-conn {
  width: 4rpx;
  flex: 1;
  background: #e5e7eb;
  margin: 8rpx 0;
  min-height: 40rpx;
}
.phase-body {
  flex: 1;
  padding-bottom: 36rpx;
}
.phase-head {
  margin-bottom: 20rpx;
}
.phase-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #4f46e5;
  display: block;
  margin-bottom: 6rpx;
}
.phase-focus {
  font-size: 25rpx;
  color: #9ca3af;
  font-weight: 600;
}
.task-list {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.task-item {
  display: flex;
  gap: 14rpx;
  align-items: flex-start;
}
.task-bullet {
  font-size: 16rpx;
  color: #a5b4fc;
  line-height: 1.8;
  flex-shrink: 0;
}
.task-text {
  font-size: 26rpx;
  color: #374151;
  line-height: 1.65;
  flex: 1;
}

/* 方向说明 */
.note-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}
.note-card .note-text {
  font-size: 27rpx;
  color: #374151;
  line-height: 1.7;
  display: block;
  margin-bottom: 24rpx;
}
.note-gen {
  font-size: 22rpx;
  color: #c0c4cc;
}

/* 底部操作 */
.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx;
  padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10rpx);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.06);
  z-index: 10;
}
.action-btn {
  flex: 1;
  height: 92rpx;
  line-height: 92rpx;
  border-radius: 46rpx;
  font-size: 27rpx;
  font-weight: 700;
  border: none;
  padding: 0 8rpx;
  &::after {
    border: none;
  }
}
.action-btn.secondary {
  background: #f5f6fa;
  color: #4f46e5;
}
.action-btn.primary {
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(79, 70, 229, 0.35);
}
.action-btn.export-btn {
  background: linear-gradient(135deg, #059669, #10b981);
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.35);
  &[disabled] {
    opacity: 0.6;
  }
}

/* AI 个性化建议 */
.ai-section {
  background: linear-gradient(135deg, #faf5ff, #eff6ff);
  border-radius: 28rpx;
  padding: 32rpx;
  border: 2rpx solid #e9d5ff;
}
.ai-badge {
  font-size: 20rpx;
  color: #7c3aed;
  background: #ede9fe;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-weight: 700;
  margin-left: auto;
}
.ai-card {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 20rpx;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}
.ai-hint {
  font-size: 26rpx;
  color: #6b7280;
  line-height: 1.6;
  text-align: center;
}
.ai-btn {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  padding: 0 48rpx;
  border: none;
  box-shadow: 0 6rpx 20rpx rgba(124, 58, 237, 0.3);
  &::after {
    border: none;
  }
}
.ai-btn-sm {
  font-size: 24rpx;
  height: 64rpx;
  line-height: 64rpx;
  padding: 0 36rpx;
  margin-top: 8rpx;
}
.ai-warn {
  font-size: 24rpx;
  color: #ef4444;
}
.ai-spinner-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
  padding: 20rpx 0;
}
.ai-spinner {
  width: 56rpx;
  height: 56rpx;
  border: 6rpx solid #e9d5ff;
  border-top-color: #7c3aed;
  border-radius: 50%;
  animation: ai-spin 0.7s linear infinite;
}
@keyframes ai-spin {
  to {
    transform: rotate(360deg);
  }
}
.ai-loading-text {
  font-size: 26rpx;
  color: #7c3aed;
  font-weight: 600;
}
.ai-advice {
  width: 100%;
}
.ai-heading {
  font-size: 28rpx;
  font-weight: 800;
  color: #5b21b6;
  display: block;
  margin-top: 24rpx;
  margin-bottom: 12rpx;
  &:first-child {
    margin-top: 0;
  }
}
.ai-line {
  font-size: 26rpx;
  color: #374151;
  line-height: 1.7;
  display: block;
  margin-bottom: 8rpx;
}
.ai-error-text {
  font-size: 26rpx;
  color: #ef4444;
  text-align: center;
  line-height: 1.6;
}
</style>
