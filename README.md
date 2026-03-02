# 冰人呼吸法训练应用

一款帮助用户学习和练习冰人呼吸法（Wim Hof Method）的网页应用。

## 项目信息

- **产品经理**：王戬
- **技术负责**：乔乔
- **开始日期**：2026-03-02
- **当前状态**：MVP 开发完成

## 技术栈

- 前端：React 18 + TypeScript
- 样式：Tailwind CSS 3
- 构建：Vite
- 动画：Framer Motion
- 部署：Vercel / Netlify
- 数据：localStorage

## MVP 功能（V1.0）

- [x] 项目初始化
- [x] 引导式呼吸训练（30次呼吸 × 3轮）
- [x] 禅意风格 UI（深色背景 + 呼吸动画圆圈）
- [x] 计时器 + 轮次管理
- [x] 安全提示弹窗（首次）
- [x] 训练完成总结
- [ ] 移动端适配优化
- [ ] 部署上线

## 项目结构

```
breathing-app/
├── docs/                    # 文档
│   ├── PRD.md              # 产品需求文档
│   └── tech.md             # 技术方案
├── src/                    # 源代码
│   ├── components/         # 组件
│   │   ├── breathing/     # 呼吸训练组件
│   │   ├── safety/        # 安全提示
│   │   └── summary/       # 训练总结
│   ├── hooks/             # 自定义 Hooks
│   ├── types/             # 类型定义
│   ├── App.tsx            # 主应用
│   └── main.tsx           # 入口
└── README.md              # 项目说明
```

## 快速开始

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build
```

## 访问地址

- 开发环境：http://localhost:5173/

## 相关链接

- [PRD 文档](./docs/PRD.md)
- [技术方案](./docs/tech.md)
