import { create } from 'zustand'
import { TrainingState, TrainingActions } from '../types/training'

const initialState: TrainingState = {
  phase: 'idle',
  round: 1,
  breathCount: 0,
  holdTime: 0,
  recoveryTime: 15,
  roundHoldTimes: [],
  totalRounds: 3,
  breathsPerRound: 30,
  isBreathingIn: true,
}

export const useTrainingStore = create<TrainingState & TrainingActions>((set, get) => ({
  ...initialState,

  startTraining: () => set({ phase: 'safety-check' }),

  confirmSafety: () => set({ phase: 'breathing', breathCount: 0 }),

  breath: () => {
    const { breathCount, breathsPerRound, isBreathingIn } = get()
    if (isBreathingIn) {
      // 吸气结束，切换到呼气
      set({ isBreathingIn: false })
    } else {
      // 呼气结束，计数+1
      const newCount = breathCount + 1
      if (newCount >= breathsPerRound) {
        // 完成一轮呼吸，进入憋气
        set({ phase: 'hold', breathCount: newCount, holdTime: 0 })
      } else {
        set({ breathCount: newCount, isBreathingIn: true })
      }
    }
  },

  startHold: () => set({ phase: 'hold', holdTime: 0 }),

  endHold: () => {
    const { holdTime, roundHoldTimes } = get()
    set({ 
      phase: 'recovery', 
      recoveryTime: 15,
      roundHoldTimes: [...roundHoldTimes, holdTime]
    })
  },

  tickRecovery: () => {
    const { recoveryTime, round, totalRounds } = get()
    const newRecoveryTime = recoveryTime - 1
    if (newRecoveryTime <= 0) {
      if (round >= totalRounds) {
        set({ phase: 'complete' })
      } else {
        set({ 
          phase: 'breathing', 
          round: round + 1, 
          breathCount: 0, 
          isBreathingIn: true 
        })
      }
    } else {
      set({ recoveryTime: newRecoveryTime })
    }
  },

  nextRound: () => {
    const { round, totalRounds } = get()
    if (round >= totalRounds) {
      set({ phase: 'complete' })
    } else {
      set({ 
        phase: 'breathing', 
        round: round + 1, 
        breathCount: 0, 
        isBreathingIn: true 
      })
    }
  },

  completeTraining: () => set({ phase: 'complete' }),

  reset: () => set(initialState),
}))
