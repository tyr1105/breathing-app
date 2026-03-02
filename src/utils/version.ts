// 版本信息
export const APP_VERSION = '3.0.0'
export const BUILD_DATE = new Date().toISOString().split('T')[0]

export const CHANGELOG = [
  {
    version: '3.0.0',
    date: '2026-03-03',
    changes: [
      '🎉 完整发布版本',
      '30个版本迭代完成',
      '11个成就徽章',
      '主题切换支持',
      'PWA离线支持',
      '键盘快捷键',
      '完整的文档系统',
    ],
  },
  {
    version: '2.5.0',
    date: '2026-03-03',
    changes: [
      '主题切换（深色/浅色/自动）',
      'PWA离线支持',
      '代码分割优化',
      '错误边界处理',
      '性能优化文档',
    ],
  },
  {
    version: '2.0.0',
    date: '2026-03-03',
    changes: [
      '新增周报统计功能',
      '新增数据导出/导入',
      '新增训练提醒',
      '成就系统（11个徽章）',
      '分享功能',
    ],
  },
  {
    version: '1.0.0',
    date: '2026-03-02',
    changes: [
      '核心呼吸训练功能',
      '3轮×30次呼吸训练',
      '声音和振动反馈',
      '训练历史记录',
      '连续天数追踪',
    ],
  },
]
