<template>
  <view class="cover-page">
    <view class="bg-gradient"></view>
    <view class="bg-overlay"></view>

    <view class="content">
      <view class="logo">
        <text class="logo-icon">🎓</text>
      </view>

      <text class="title">XJTLU 升学规划</text>
      <text class="subtitle">西交利物浦大学 · 本科生海外升学规划助手</text>

      <view class="features">
        <view class="feature-item">
          <text class="feature-icon">📋</text>
          <text class="feature-text">个性化升学路径</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">🌍</text>
          <text class="feature-text">多国家多方向</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📅</text>
          <text class="feature-text">年级定制时间轴</text>
        </view>
        <view class="feature-item">
          <text class="feature-icon">📄</text>
          <text class="feature-text">一键导出 PDF</text>
        </view>
      </view>

      <view class="start-btn" @click="goToInput">
        <text class="btn-text">开始制定我的规划</text>
        <text class="btn-arrow">→</text>
      </view>

      <text class="footer">面向 Top 100 海外名校 · 助力西浦学子升学之路</text>
    </view>
  </view>
</template>

<script setup>
const goToInput = () => {
  const btn = document.querySelector('.start-btn')
  if (btn) btn.style.transform = 'scale(0.96)'
  setTimeout(() => {
    uni.navigateTo({
      url: '/pages/index/index',
      animationType: 'fade-in',
      animationDuration: 400
    })
  }, 150)
}
</script>

<style scoped>
.cover-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.bg-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://aka.doubaocdn.com/s/3UpewwleLH') center/cover no-repeat;
  opacity: 0.3;
}

.bg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.85) 0%, rgba(118, 75, 162, 0.85) 100%);
}

.content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 48rpx;
  max-width: 600px;
  width: 100%;
}

.logo {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
}

.logo-icon {
  font-size: 64rpx;
}

.title {
  font-size: 52rpx;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 2rpx;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.85);
  margin-bottom: 64rpx;
  text-align: center;
  line-height: 1.6;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24rpx;
  margin-bottom: 64rpx;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 20rpx 32rpx;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 40rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.feature-icon {
  font-size: 32rpx;
}

.feature-text {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 28rpx 80rpx;
  background: #ffffff;
  border-radius: 48rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
  margin-bottom: 48rpx;
}

.start-btn:active {
  transform: scale(0.96);
}

.btn-text {
  font-size: 32rpx;
  font-weight: 600;
  color: #667eea;
}

.btn-arrow {
  font-size: 36rpx;
  color: #667eea;
}

.footer {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
}
</style>
