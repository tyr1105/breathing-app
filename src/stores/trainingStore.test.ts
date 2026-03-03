import { describe, it, expect, beforeEach } from 'vitest'
import { useTrainingStore } from './trainingStore'

describe('trainingStore.ts', () => {
  beforeEach(() => {
    // 每次测试前重置 store
    useTrainingStore.setState({
      phase: 'idle',
      round: 1,
      breathCount: 0,
      holdTime: 0,
      recoveryTime: 15,
      roundHoldTimes: [],
      totalRounds: 3,
      breathsPerRound: 30,
      isBreathingIn: true,
    })
  })

  describe('初始状态', () => {
    it('phase 应该是 idle', () => {
      expect(useTrainingStore.getState().phase).toBe('idle')
    })

    it('round 应该是 1', () => {
      expect(useTrainingStore.getState().round).toBe(1)
    })

    it('breathCount 应该是 0', () => {
      expect(useTrainingStore.getState().breathCount).toBe(0)
    })
  })

  describe('startTraining', () => {
    it('将 phase 设置为 safety-check', () => {
      useTrainingStore.getState().startTraining()
      expect(useTrainingStore.getState().phase).toBe('safety-check')
    })
  })

  describe('confirmSafety', () => {
    it('将 phase 设置为 breathing', () => {
      useTrainingStore.setState({ phase: 'safety-check' })
      useTrainingStore.getState().confirmSafety()
      expect(useTrainingStore.getState().phase).toBe('breathing')
    })

    it('重置 breathCount 为 0', () => {
      useTrainingStore.setState({ phase: 'safety-check', breathCount: 10 })
      useTrainingStore.getState().confirmSafety()
      expect(useTrainingStore.getState().breathCount).toBe(0)
    })
  })

  describe('breath', () => {
    it('吸气后切换到呼气', () => {
      useTrainingStore.setState({ phase: 'breathing', isBreathingIn: true })
      useTrainingStore.getState().breath()
      expect(useTrainingStore.getState().isBreathingIn).toBe(false)
    })

    it('呼气后 breathCount +1 并切换回吸气', () => {
      useTrainingStore.setState({ phase: 'breathing', isBreathingIn: false, breathCount: 5 })
      useTrainingStore.getState().breath()
      expect(useTrainingStore.getState().breathCount).toBe(6)
      expect(useTrainingStore.getState().isBreathingIn).toBe(true)
    })

    it('完成一轮呼吸后进入憋气阶段', () => {
      useTrainingStore.setState({ 
        phase: 'breathing', 
        isBreathingIn: false, 
        breathCount: 29, 
        breathsPerRound: 30 
      })
      useTrainingStore.getState().breath()
      
      expect(useTrainingStore.getState().phase).toBe('hold')
      expect(useTrainingStore.getState().breathCount).toBe(30)
    })
  })

  describe('endHold', () => {
    it('进入恢复阶段', () => {
      useTrainingStore.setState({ phase: 'hold', holdTime: 60, roundHoldTimes: [] })
      useTrainingStore.getState().endHold()
      
      expect(useTrainingStore.getState().phase).toBe('recovery')
      expect(useTrainingStore.getState().recoveryTime).toBe(15)
    })

    it('记录本轮憋气时间', () => {
      useTrainingStore.setState({ phase: 'hold', holdTime: 60, roundHoldTimes: [30, 45] })
      useTrainingStore.getState().endHold()
      
      expect(useTrainingStore.getState().roundHoldTimes).toEqual([30, 45, 60])
    })
  })

  describe('tickRecovery', () => {
    it('恢复时间 -1', () => {
      useTrainingStore.setState({ phase: 'recovery', recoveryTime: 15, round: 1, totalRounds: 3 })
      useTrainingStore.getState().tickRecovery()
      
      expect(useTrainingStore.getState().recoveryTime).toBe(14)
    })

    it('恢复时间归零后进入下一轮（未完成所有轮）', () => {
      useTrainingStore.setState({ 
        phase: 'recovery', 
        recoveryTime: 1, 
        round: 1, 
        totalRounds: 3 
      })
      useTrainingStore.getState().tickRecovery()
      
      expect(useTrainingStore.getState().phase).toBe('breathing')
      expect(useTrainingStore.getState().round).toBe(2)
      expect(useTrainingStore.getState().breathCount).toBe(0)
      expect(useTrainingStore.getState().isBreathingIn).toBe(true)
    })

    it('恢复时间归零后完成训练（已完成所有轮）', () => {
      useTrainingStore.setState({ 
        phase: 'recovery', 
        recoveryTime: 1, 
        round: 3, 
        totalRounds: 3 
      })
      useTrainingStore.getState().tickRecovery()
      
      expect(useTrainingStore.getState().phase).toBe('complete')
    })
  })

  describe('nextRound', () => {
    it('未完成所有轮时进入下一轮', () => {
      useTrainingStore.setState({ round: 1, totalRounds: 3 })
      useTrainingStore.getState().nextRound()
      
      expect(useTrainingStore.getState().phase).toBe('breathing')
      expect(useTrainingStore.getState().round).toBe(2)
    })

    it('完成所有轮时进入完成阶段', () => {
      useTrainingStore.setState({ round: 3, totalRounds: 3 })
      useTrainingStore.getState().nextRound()
      
      expect(useTrainingStore.getState().phase).toBe('complete')
    })
  })

  describe('completeTraining', () => {
    it('将 phase 设置为 complete', () => {
      useTrainingStore.setState({ phase: 'hold' })
      useTrainingStore.getState().completeTraining()
      expect(useTrainingStore.getState().phase).toBe('complete')
    })
  })

  describe('reset', () => {
    it('重置所有状态到初始值', () => {
      // 先设置一些非初始状态
      useTrainingStore.setState({
        phase: 'complete',
        round: 3,
        breathCount: 30,
        holdTime: 120,
        recoveryTime: 0,
        roundHoldTimes: [60, 70, 80],
        isBreathingIn: false,
      })
      
      useTrainingStore.getState().reset()
      
      const state = useTrainingStore.getState()
      expect(state.phase).toBe('idle')
      expect(state.round).toBe(1)
      expect(state.breathCount).toBe(0)
      expect(state.holdTime).toBe(0)
      expect(state.recoveryTime).toBe(15)
      expect(state.roundHoldTimes).toEqual([])
      expect(state.isBreathingIn).toBe(true)
    })
  })

  describe('完整训练流程', () => {
    it('模拟一次完整的训练流程', () => {
      const store = useTrainingStore.getState()
      
      // 1. 开始训练
      store.startTraining()
      expect(useTrainingStore.getState().phase).toBe('safety-check')
      
      // 2. 确认安全
      store.confirmSafety()
      expect(useTrainingStore.getState().phase).toBe('breathing')
      
      // 3. 完成 30 次呼吸
      for (let i = 0; i < 30; i++) {
        store.breath() // 吸气
        store.breath() // 呼气
      }
      expect(useTrainingStore.getState().phase).toBe('hold')
      
      // 4. 憋气结束
      useTrainingStore.setState({ holdTime: 60 })
      store.endHold()
      expect(useTrainingStore.getState().phase).toBe('recovery')
      expect(useTrainingStore.getState().roundHoldTimes).toEqual([60])
      
      // 5. 恢复时间结束，进入下一轮
      useTrainingStore.setState({ recoveryTime: 1 })
      store.tickRecovery()
      expect(useTrainingStore.getState().phase).toBe('breathing')
      expect(useTrainingStore.getState().round).toBe(2)
    })
  })
})
