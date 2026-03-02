// 版本信息
export const APP_VERSION = '2.1.0'
export const BUILD_DATE = new Date().toISOString().split('T')[0]

export const CHANGELOG = [
  {
    version: '2.1.0',
    date: '2026-03-03',
    changes: [
      '新增呼吸技巧说明页',
      '优化成就系统',
      '修复已知问题',
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
