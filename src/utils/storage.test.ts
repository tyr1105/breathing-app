import { describe, it, expect, beforeEach } from 'vitest'
import { historyManager, settingsManager, statsManager } from './storage'

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('historyManager', () => {
    describe('getAll', () => {
      it('空存储时返回空数组', () => {
        expect(historyManager.getAll()).toEqual([])
      })

      it('有数据时返回正确的记录数组', () => {
        const record = {
          rounds: 3,
          breathsPerRound: 30,
          holdTimes: [60, 65, 70],
          totalHoldTime: 195,
        }
        historyManager.add(record)
        
        const history = historyManager.getAll()
        expect(history.length).toBe(1)
        expect(history[0].rounds).toBe(3)
        expect(history[0].holdTimes).toEqual([60, 65, 70])
      })
    })

    describe('add', () => {
      it('添加记录时自动生成 id 和 date', () => {
        const record = {
          rounds: 3,
          breathsPerRound: 30,
          holdTimes: [60, 65, 70],
          totalHoldTime: 195,
        }
        
        const result = historyManager.add(record)
        
        expect(result.id).toBeDefined()
        expect(result.date).toBeDefined()
        expect(result.rounds).toBe(3)
      })

      it('新记录插入到数组开头（最新的在前）', () => {
        historyManager.add({ rounds: 3, breathsPerRound: 30, holdTimes: [60], totalHoldTime: 60 })
        historyManager.add({ rounds: 3, breathsPerRound: 30, holdTimes: [70], totalHoldTime: 70 })
        
        const history = historyManager.getAll()
        expect(history[0].holdTimes[0]).toBe(70) // 最新的
        expect(history[1].holdTimes[0]).toBe(60)
      })

      it('超过 100 条时自动裁剪', () => {
        for (let i = 0; i < 105; i++) {
          historyManager.add({ 
            rounds: 3, 
            breathsPerRound: 30, 
            holdTimes: [i], 
            totalHoldTime: i 
          })
        }
        
        const history = historyManager.getAll()
        expect(history.length).toBe(100)
        // 最新的记录应该在最前面
        expect(history[0].holdTimes[0]).toBe(104)
      })
    })

    describe('clear', () => {
      it('清空所有历史记录', () => {
        historyManager.add({ rounds: 3, breathsPerRound: 30, holdTimes: [60], totalHoldTime: 60 })
        historyManager.clear()
        expect(historyManager.getAll()).toEqual([])
      })
    })

    describe('getStats', () => {
      it('空历史时返回零值统计', () => {
        const stats = historyManager.getStats()
        expect(stats).toEqual({
          totalSessions: 0,
          totalBreaths: 0,
          avgHoldTime: 0,
          maxHoldTime: 0,
        })
      })

      it('正确计算统计数据', () => {
        historyManager.add({ rounds: 3, breathsPerRound: 30, holdTimes: [60, 65, 70], totalHoldTime: 195 })
        historyManager.add({ rounds: 3, breathsPerRound: 30, holdTimes: [50, 55], totalHoldTime: 105 })
        
        const stats = historyManager.getStats()
        
        expect(stats.totalSessions).toBe(2)
        expect(stats.totalBreaths).toBe(180) // 2 × 3 × 30
        expect(stats.avgHoldTime).toBe(60) // (60+65+70+50+55) / 5 = 60
        expect(stats.maxHoldTime).toBe(70)
      })
    })

    describe('getLast7Days', () => {
      it('返回最近 7 天的数据', () => {
        // 添加一条今天的记录
        historyManager.add({ rounds: 3, breathsPerRound: 30, holdTimes: [60], totalHoldTime: 60 })
        
        const last7Days = historyManager.getLast7Days()
        
        expect(last7Days.length).toBe(7)
        expect(last7Days[6].sessions).toBe(1) // 今天有一条
        expect(last7Days[6].avgHold).toBe(60)
      })

      it('无数据时 sessions 和 avgHold 都是 0', () => {
        const last7Days = historyManager.getLast7Days()
        
        expect(last7Days.length).toBe(7)
        last7Days.forEach(day => {
          expect(day.sessions).toBe(0)
          expect(day.avgHold).toBe(0)
        })
      })
    })
  })

  describe('settingsManager', () => {
    describe('get', () => {
      it('返回默认设置', () => {
        const settings = settingsManager.get()
        
        expect(settings.breathsPerRound).toBe(30)
        expect(settings.totalRounds).toBe(3)
        expect(settings.soundEnabled).toBe(true)
        expect(settings.theme).toBe('dark')
      })

      it('返回已保存的设置', () => {
        settingsManager.save({ breathsPerRound: 40, soundEnabled: false })
        
        const settings = settingsManager.get()
        expect(settings.breathsPerRound).toBe(40)
        expect(settings.soundEnabled).toBe(false)
        // 未修改的保持默认
        expect(settings.totalRounds).toBe(3)
      })
    })

    describe('save', () => {
      it('部分更新设置', () => {
        settingsManager.save({ breathsPerRound: 50 })
        settingsManager.save({ soundEnabled: false })
        
        const settings = settingsManager.get()
        expect(settings.breathsPerRound).toBe(50)
        expect(settings.soundEnabled).toBe(false)
      })
    })

    describe('reset', () => {
      it('重置为默认设置', () => {
        settingsManager.save({ breathsPerRound: 100, theme: 'light' })
        const reset = settingsManager.reset()
        
        expect(reset.breathsPerRound).toBe(30)
        expect(reset.theme).toBe('dark')
      })
    })
  })

  describe('statsManager', () => {
    describe('get', () => {
      it('返回默认统计', () => {
        const stats = statsManager.get()
        
        expect(stats.consecutiveDays).toBe(0)
        expect(stats.totalSessions).toBe(0)
        expect(stats.personalBestHold).toBe(0)
        expect(stats.achievements).toEqual([])
      })
    })

    describe('updateTraining', () => {
      it('首次训练时连续天数为 1', () => {
        const stats = statsManager.updateTraining(60)
        
        expect(stats.totalSessions).toBe(1)
        expect(stats.consecutiveDays).toBe(1)
        expect(stats.lastTrainingDate).toBe(new Date().toISOString().split('T')[0])
      })

      it('累计总憋气时间', () => {
        statsManager.updateTraining(60)
        statsManager.updateTraining(90)
        
        const stats = statsManager.get()
        expect(stats.totalHoldTime).toBe(150)
      })
    })

    describe('updatePersonalBest', () => {
      it('新纪录返回 true 并更新', () => {
        const result = statsManager.updatePersonalBest(120)
        
        expect(result).toBe(true)
        expect(statsManager.get().personalBestHold).toBe(120)
      })

      it('非新纪录返回 false 且不更新', () => {
        statsManager.updatePersonalBest(120)
        const result = statsManager.updatePersonalBest(60)
        
        expect(result).toBe(false)
        expect(statsManager.get().personalBestHold).toBe(120)
      })
    })

    describe('addAchievement', () => {
      it('添加新成就', () => {
        statsManager.addAchievement('first-training')
        
        const stats = statsManager.get()
        expect(stats.achievements).toContain('first-training')
      })

      it('不重复添加同一成就', () => {
        statsManager.addAchievement('first-training')
        statsManager.addAchievement('first-training')
        
        const stats = statsManager.get()
        expect(stats.achievements.filter(a => a === 'first-training').length).toBe(1)
      })
    })
  })
})
