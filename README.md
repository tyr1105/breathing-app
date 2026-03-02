# 冰人呼吸法训练应用

一款帮助用户练习 Wim Hof 呼吸法的应用。

## 功能特性

### 核心功能
- ✅ 3轮训练 × 30次呼吸（可自定义）
- ✅ 呼吸引导动画
- ✅ 憋气计时
- ✅ 恢复呼吸倒计时

### 体验优化
- ✅ 声音提示（吸气/呼气/憋气/完成）
- ✅ 振动反馈
- ✅ 暂停/恢复功能
- ✅ 训练进度条

### 数据追踪
- ✅ 训练历史记录（100条）
- ✅ 7天训练趋势图
- ✅ 连续训练天数
- ✅ 个人最佳记录

### 激励系统
- ✅ 11个成就徽章
- ✅ 成就解锁提示
- ✅ 新纪录庆祝

### 个性化
- ✅ 自定义呼吸次数
- ✅ 自定义训练轮数
- ✅ 自定义恢复时间
- ✅ 声音/振动开关

## 技术栈

- **前端**: React 18 + TypeScript
- **样式**: Tailwind CSS 3
- **动画**: Framer Motion
- **构建**: Vite 7
- **移动端**: Capacitor 7
- **CI/CD**: GitHub Actions

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview
```

## 下载

- **Android APK**: [GitHub Actions](https://github.com/tyr1105/breathing-app/actions)
- **Web版本**: 开发服务器运行在 http://localhost:5173/

## 版本历史

### V12 (当前)
- PWA 支持
- 移动端优化
- 性能优化

### V8-V11
- 成就系统
- 数据可视化
- 激励机制

### V6-V7
- 7天趋势图
- 连续天数统计

### V3-V5
- 暂停功能
- 进度条
- 视觉优化

### V1-V2
- MVP 核心功能
- 基础 UI
- Android 打包

## 项目结构

```
breathing-app/
├── src/
│   ├── components/
│   │   ├── breathing/      # 呼吸训练组件
│   │   ├── safety/         # 安全提示
│   │   ├── summary/        # 训练总结
│   │   ├── settings/       # 设置页面
│   │   ├── history/        # 历史记录
│   │   └── achievements/   # 成就系统
│   ├── utils/
│   │   ├── audio.ts        # 音频管理
│   │   ├── storage.ts      # 数据存储
│   │   └── achievements.ts # 成就定义
│   └── App.tsx             # 主应用
├── android/                 # Android 项目
└── .github/
    └── workflows/           # CI/CD
```

## 许可证

MIT
