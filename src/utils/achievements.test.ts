import { describe, it, expect } from 'vitest'
import { checkAchievements, ACHIEVEMENTS } from './achievements'

describe('achievements.ts', () => {
  describe('ACHIEVEMENTS 常量', () => {
    it('包含 11 个成就', () => {
      expect(ACHIEVEMENTS.length).toBe(11)
    })

    it('每个成就都有必要字段', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(achievement.id).toBeDefined()
        expect(achievement.name).toBeDefined()
        expect(achievement.description).toBeDefined()
        expect(achievement.iconName).toBeDefined()
      })
    })
  })

  describe('checkAchievements', () => {
    it('无任何成就时不返回新成就', () => {
      const result = checkAchievements({
        consecutiveDays: 0,
        totalSessions: 0,
        personalBestHold: 0,
        unlockedIds: [],
      })
      
      expect(result).toEqual([])
    })

    describe('训练次数成就', () => {
      it('1 次训练解锁"初次尝试"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 0,
          unlockedIds: [],
        })
        
        expect(result.length).toBe(1)
        expect(result[0].id).toBe('first-training')
      })

      it('10 次训练解锁"勤奋学员"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 10,
          personalBestHold: 0,
          unlockedIds: ['first-training'],
        })
        
        expect(result.some(a => a.id === 'sessions-10')).toBe(true)
      })

      it('50 次训练解锁"呼吸专家"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 50,
          personalBestHold: 0,
          unlockedIds: ['first-training', 'sessions-10'],
        })
        
        expect(result.some(a => a.id === 'sessions-50')).toBe(true)
      })

      it('100 次训练解锁"呼吸大师"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 100,
          personalBestHold: 0,
          unlockedIds: ['first-training', 'sessions-10', 'sessions-50'],
        })
        
        expect(result.some(a => a.id === 'sessions-100')).toBe(true)
      })
    })

    describe('连续天数成就', () => {
      it('3 天连续解锁"连续3天"', () => {
        const result = checkAchievements({
          consecutiveDays: 3,
          totalSessions: 3,
          personalBestHold: 0,
          unlockedIds: ['first-training'],
        })
        
        expect(result.some(a => a.id === 'streak-3')).toBe(true)
      })

      it('7 天连续解锁"一周坚持"', () => {
        const result = checkAchievements({
          consecutiveDays: 7,
          totalSessions: 7,
          personalBestHold: 0,
          unlockedIds: ['first-training', 'streak-3'],
        })
        
        expect(result.some(a => a.id === 'streak-7')).toBe(true)
      })

      it('30 天连续解锁"月度冠军"', () => {
        const result = checkAchievements({
          consecutiveDays: 30,
          totalSessions: 30,
          personalBestHold: 0,
          unlockedIds: ['first-training', 'streak-3', 'streak-7'],
        })
        
        expect(result.some(a => a.id === 'streak-30')).toBe(true)
      })
    })

    describe('憋气时长成就', () => {
      it('30 秒憋气解锁"憋气新手"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 30,
          unlockedIds: ['first-training'],
        })
        
        expect(result.some(a => a.id === 'hold-30')).toBe(true)
      })

      it('60 秒憋气解锁"憋气达人"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 60,
          unlockedIds: ['first-training', 'hold-30'],
        })
        
        expect(result.some(a => a.id === 'hold-60')).toBe(true)
      })

      it('90 秒憋气解锁"憋气大师"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 90,
          unlockedIds: ['first-training', 'hold-30', 'hold-60'],
        })
        
        expect(result.some(a => a.id === 'hold-90')).toBe(true)
      })

      it('120 秒憋气解锁"冰人附体"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 120,
          unlockedIds: ['first-training', 'hold-30', 'hold-60', 'hold-90'],
        })
        
        expect(result.some(a => a.id === 'hold-120')).toBe(true)
      })
    })

    describe('不重复解锁', () => {
      it('已解锁的成就不再返回', () => {
        // 第一次检查
        const result1 = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 30,
          unlockedIds: [],
        })
        
        expect(result1.some(a => a.id === 'first-training')).toBe(true)
        expect(result1.some(a => a.id === 'hold-30')).toBe(true)
        
        // 第二次检查，传入已解锁的
        const result2 = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 30,
          unlockedIds: ['first-training', 'hold-30'],
        })
        
        expect(result2).toEqual([])
      })
    })

    describe('边界值测试', () => {
      it('憋气 29 秒不解锁任何憋气成就', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 29,
          unlockedIds: ['first-training'],
        })
        
        expect(result.some(a => a.id.startsWith('hold-'))).toBe(false)
      })

      it('憋气 30 秒刚好解锁"憋气新手"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 30,
          unlockedIds: ['first-training'],
        })
        
        expect(result.some(a => a.id === 'hold-30')).toBe(true)
      })

      it('憋气 119 秒不解锁"冰人附体"', () => {
        const result = checkAchievements({
          consecutiveDays: 0,
          totalSessions: 1,
          personalBestHold: 119,
          unlockedIds: ['first-training', 'hold-30', 'hold-60', 'hold-90'],
        })
        
        expect(result.some(a => a.id === 'hold-120')).toBe(false)
      })
    })

    describe('多成就同时解锁', () => {
      it('同时满足多个条件时返回多个成就', () => {
        const result = checkAchievements({
          consecutiveDays: 7,
          totalSessions: 7,
          personalBestHold: 60,
          unlockedIds: [],
        })
        
        const ids = result.map(a => a.id)
        expect(ids).toContain('first-training')
        expect(ids).toContain('streak-3')
        expect(ids).toContain('streak-7')
        expect(ids).toContain('hold-30')
        expect(ids).toContain('hold-60')
      })
    })
  })
})
