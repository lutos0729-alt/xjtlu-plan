<template>
  <view class="page">
    <!-- 顶部渐变区 -->
    <view class="header">
      <view class="header-bg"></view>
      <view class="header-content">
        <view class="logo-badge">XJTLU</view>
        <text class="title">升学规划生成器</text>
        <text class="subtitle">西交利物浦大学 · 本科生海外升学规划</text>
        <view class="stat-row">
          <view class="stat-item">
            <text class="stat-num">6</text>
            <text class="stat-label">意向国家</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">3</text>
            <text class="stat-label">升学方向</text>
          </view>
          <view class="stat-divider"></view>
          <view class="stat-item">
            <text class="stat-num">4</text>
            <text class="stat-label">年级起点</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 表单卡片 -->
    <view class="form-card">
      <!-- 年级 -->
      <view class="form-section">
        <view class="section-label">
          <text class="label-text">年级</text>
          <text class="label-tag">必选</text>
        </view>
        <view class="grade-row">
          <view
            v-for="g in options.grades"
            :key="g"
            class="grade-chip"
            :class="{ active: form.grade === g }"
            @tap="form.grade = g"
          >
            {{ g }}
          </view>
        </view>
      </view>

      <!-- 专业 -->
      <view class="form-section">
        <view class="section-label">
          <text class="label-text">专业</text>
          <text class="label-tag">必填</text>
        </view>
        <view class="input-wrap">
          <input
            class="text-input"
            v-model="form.major"
            placeholder="如：计算机科学与技术"
            placeholder-class="ph"
            maxlength="30"
          />
        </view>
      </view>

      <!-- 意向方向 -->
      <view class="form-section">
        <view class="section-label">
          <text class="label-text">意向方向</text>
          <text class="label-tag">必选</text>
        </view>
        <view class="direction-list">
          <view
            v-for="d in options.directions"
            :key="d.value"
            class="direction-item"
            :class="{ active: form.direction === d.value }"
            @tap="form.direction = d.value"
          >
            <view class="dir-top">
              <text class="dir-label">{{ d.label }}</text>
              <view v-if="form.direction === d.value" class="check-icon">✓</view>
            </view>
            <text class="dir-desc">{{ d.desc }}</text>
          </view>
        </view>
      </view>

      <!-- 意向国家（多选） -->
      <view class="form-section">
        <view class="section-label">
          <text class="label-text">意向国家</text>
          <text class="label-tag">可多选</text>
        </view>
        <view class="country-grid">
          <view
            v-for="c in options.countries"
            :key="c.value"
            class="country-chip"
            :class="{ active: form.countries.includes(c.value) }"
            @tap="toggleCountry(c.value)"
          >
            <text class="country-flag">{{ c.flag }}</text>
            <text class="country-name">{{ c.label }}</text>
          </view>
          <view
            class="country-chip other-toggle"
            :class="{ active: showOther }"
            @tap="showOther = !showOther"
          >
            <text class="country-flag">🌍</text>
            <text class="country-name">其他</text>
            <text class="other-arrow">{{ showOther ? '▾' : '▸' }}</text>
          </view>
        </view>
        <view v-if="showOther" class="other-section">
          <view class="other-divider"></view>
          <view class="other-label">其他地区</view>
          <view class="country-grid">
            <view
              v-for="c in options.otherCountries"
              :key="c.value"
              class="country-chip"
              :class="{ active: form.countries.includes(c.value) }"
              @tap="toggleCountry(c.value)"
            >
              <text class="country-flag">{{ c.flag }}</text>
              <text class="country-name">{{ c.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- DeepSeek API Key（选填） -->
      <view class="form-section">
        <view class="section-label">
          <text class="label-text">DeepSeek API Key</text>
          <text class="label-tag optional">选填</text>
        </view>
        <input
          class="form-input api-input"
          v-model="form.apiKey"
          type="text"
          password
          placeholder="填入后可生成 AI 个性化建议"
          placeholder-class="ph"
        />
        <view class="api-tip">
          <text class="tip-text">前往 </text>
          <text class="tip-link" @tap="openDeepSeek">platform.deepseek.com</text>
          <text class="tip-text"> 注册获取 API Key，费用约 0.01 元/次</text>
        </view>
      </view>
    </view>

    <!-- 生成按钮 -->
    <view class="btn-area">
      <button class="gen-btn" :class="{ disabled: !canSubmit }" :disabled="!canSubmit" @tap="onSubmit">
        生成我的升学规划
      </button>
      <text class="btn-hint">基于你的信息生成个性化时间轴与量化目标</text>
    </view>

    <view class="footer">
      <text>Top 100 海外院校 · 数据持续更新中</text>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { FORM_OPTIONS } from '@/utils/planner.js'

const options = FORM_OPTIONS

const form = reactive({
  grade: '',
  major: '',
  direction: '',
  countries: [],
  apiKey: ''
})
const showOther = ref(false)

const canSubmit = computed(
  () => form.grade && form.major.trim() && form.direction && form.countries.length > 0
)

function toggleCountry(value) {
  const idx = form.countries.indexOf(value)
  if (idx > -1) {
    form.countries.splice(idx, 1)
  } else {
    form.countries.push(value)
  }
}

function onSubmit() {
  if (!canSubmit.value) {
    uni.showToast({ title: '请完成所有信息', icon: 'none' })
    return
  }
  uni.setStorageSync('planInput', {
    grade: form.grade,
    major: form.major.trim(),
    direction: form.direction,
    countries: form.countries,
    apiKey: form.apiKey.trim()
  })
  uni.navigateTo({ url: '/pages/plan/plan' })
}

function openDeepSeek() {
  // #ifdef H5
  window.open('https://platform.deepseek.com', '_blank')
  // #endif
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f4f5fa;
  padding-bottom: 60rpx;
}

/* 顶部 */
.header {
  position: relative;
  padding: 0 0 60rpx;
  overflow: hidden;
}
.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 420rpx;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%);
  border-radius: 0 0 48rpx 48rpx;
}
.header-content {
  position: relative;
  z-index: 1;
  padding: 90rpx 48rpx 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.logo-badge {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  margin-bottom: 24rpx;
}
.title {
  color: #fff;
  font-size: 48rpx;
  font-weight: 800;
  line-height: 1.3;
  margin-bottom: 12rpx;
}
.subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 26rpx;
  margin-bottom: 48rpx;
}
.stat-row {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20rpx;
  padding: 24rpx 36rpx;
  backdrop-filter: blur(10rpx);
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 28rpx;
}
.stat-num {
  color: #fff;
  font-size: 40rpx;
  font-weight: 800;
  line-height: 1;
}
.stat-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 22rpx;
  margin-top: 8rpx;
}
.stat-divider {
  width: 2rpx;
  height: 50rpx;
  background: rgba(255, 255, 255, 0.25);
}

/* 表单卡片 */
.form-card {
  margin: -30rpx 32rpx 0;
  background: #fff;
  border-radius: 32rpx;
  padding: 12rpx 36rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(79, 70, 229, 0.08);
  position: relative;
  z-index: 2;
}
.form-section {
  padding: 28rpx 0;
  border-bottom: 2rpx solid #f0f1f5;
  &:last-child {
    border-bottom: none;
  }
}
.section-label {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}
.label-text {
  font-size: 30rpx;
  font-weight: 700;
  color: #1a1a2e;
}
.label-tag {
  margin-left: 16rpx;
  font-size: 20rpx;
  color: #6366f1;
  background: #eef2ff;
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

/* 年级 chip */
.grade-row {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}
.grade-chip {
  flex: 1;
  min-width: 120rpx;
  text-align: center;
  padding: 22rpx 0;
  border-radius: 16rpx;
  background: #f5f6fa;
  color: #64748b;
  font-size: 28rpx;
  font-weight: 600;
  transition: all 0.2s;
  &.active {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: #fff;
    box-shadow: 0 6rpx 20rpx rgba(79, 70, 229, 0.35);
  }
}

/* 输入框 */
.input-wrap {
  background: #f5f6fa;
  border-radius: 16rpx;
  padding: 4rpx 24rpx;
}
.text-input {
  height: 88rpx;
  font-size: 28rpx;
  color: #1a1a2e;
}
.ph {
  color: #9ca3af;
}
.label-tag.optional {
  color: #9ca3af;
  background: #f3f4f6;
}
.api-input {
  height: 88rpx;
  font-size: 26rpx;
  color: #1a1a2e;
  background: #f5f6fa;
  border-radius: 16rpx;
  padding: 0 24rpx;
}
.api-tip {
  margin-top: 16rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4rpx;
}
.tip-text {
  font-size: 22rpx;
  color: #9ca3af;
}
.tip-link {
  font-size: 22rpx;
  color: #6366f1;
  font-weight: 600;
  text-decoration: underline;
}

/* 方向 */
.direction-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.direction-item {
  border: 2rpx solid #e5e7eb;
  border-radius: 20rpx;
  padding: 28rpx 32rpx;
  background: #fff;
  transition: all 0.2s;
  &.active {
    border-color: #6366f1;
    background: #eef2ff;
  }
}
.dir-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10rpx;
}
.dir-label {
  font-size: 30rpx;
  font-weight: 700;
  color: #1a1a2e;
}
.check-icon {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #6366f1;
  color: #fff;
  font-size: 26rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}
.dir-desc {
  font-size: 24rpx;
  color: #6b7280;
  line-height: 1.5;
}

/* 国家 */
.country-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.country-chip {
  width: calc((100% - 32rpx) / 3);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 0;
  border-radius: 16rpx;
  background: #f5f6fa;
  border: 2rpx solid transparent;
  transition: all 0.2s;
  &.active {
    background: #eef2ff;
    border-color: #6366f1;
  }
}
.country-flag {
  font-size: 44rpx;
  margin-bottom: 8rpx;
}
.country-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #374151;
}

/* 其他展开 */
.other-toggle {
  position: relative;
  &.active {
    background: #f0fdf4;
    border-color: #10b981;
  }
}
.other-arrow {
  font-size: 20rpx;
  color: #9ca3af;
  margin-top: 4rpx;
}
.other-section {
  margin-top: 24rpx;
  animation: slideDown 0.2s ease;
}
.other-divider {
  height: 2rpx;
  background: #e5e7eb;
  margin-bottom: 24rpx;
}
.other-label {
  font-size: 24rpx;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 16rpx;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮 */
.btn-area {
  margin: 48rpx 32rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gen-btn {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  border-radius: 50rpx;
  background: linear-gradient(135deg, #4f46e5, #9333ea);
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  border: none;
  box-shadow: 0 10rpx 30rpx rgba(79, 70, 229, 0.4);
  &.disabled {
    opacity: 0.5;
    box-shadow: none;
  }
  &::after {
    border: none;
  }
}
.btn-hint {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: #9ca3af;
}
.footer {
  text-align: center;
  margin-top: 40rpx;
  font-size: 22rpx;
  color: #c0c4cc;
}
</style>
