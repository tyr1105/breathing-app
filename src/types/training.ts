export type TrainingPhase = 
  | 'idle'          // 空闲
  | 'safety-check'  // 安全提示
  | 'breathing'     // 深呼吸阶段
  | 'hold'          // 憋气阶段
  | 'recovery'      // 恢复呼吸
  | 'complete'      // 训练完成

export interface TrainingState {
  phase: TrainingPhase
  round: number           // 当前轮次 (1-3)
  breathCount: number     // 当前呼吸次数 (1-30)
  holdTime: number        // 憋气时长（秒）
  recoveryTime: number    // 恢复呼吸倒计时（15秒）
  roundHoldTimes: number[] // 每轮憋气时长记录
  totalRounds: number     // 总轮数（默认3）
  breathsPerRound: number // 每轮呼吸次数（默认30）
  isBreathingIn: boolean  // 当前是否在吸气
}

export interface TrainingActions {
  startTraining: () => void
  confirmSafety: () => void
  breath: () => void
  startHold: () => void
  endHold: () => void
  tickRecovery: () => void
  nextRound: () => void
  completeTraining: () => void
  reset: () => void
}
