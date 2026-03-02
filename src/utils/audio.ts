// 音频管理 - 使用 Web Audio API 生成简单提示音
class AudioManager {
  private audioContext: AudioContext | null = null
  private initialized = false

  init() {
    if (this.initialized) return
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    this.initialized = true
  }

  // 吸气提示音 - 上升音调
  playInhale() {
    this.init()
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.3)
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.3)
  }

  // 呼气提示音 - 下降音调
  playExhale() {
    this.init()
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(500, this.audioContext.currentTime)
    oscillator.frequency.exponentialRampToValueAtTime(300, this.audioContext.currentTime + 0.2)
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.2)
  }

  // 憋气开始提示音
  playHoldStart() {
    this.init()
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.5)
  }

  // 恢复呼吸倒计时提示音
  playRecoveryTick() {
    this.init()
    if (!this.audioContext) return
    
    const oscillator = this.audioContext.createOscillator()
    const gainNode = this.audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(this.audioContext.destination)
    
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime)
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1)
    
    oscillator.start(this.audioContext.currentTime)
    oscillator.stop(this.audioContext.currentTime + 0.1)
  }

  // 训练完成提示音
  playComplete() {
    this.init()
    if (!this.audioContext) return
    
    // 三个上升音符
    const notes = [523, 659, 784] // C5, E5, G5
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)
      
      const startTime = this.audioContext!.currentTime + i * 0.2
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0.3, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.3)
    })
  }

  // 成就解锁提示音
  playAchievement() {
    this.init()
    if (!this.audioContext) return
    
    const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const oscillator = this.audioContext!.createOscillator()
      const gainNode = this.audioContext!.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(this.audioContext!.destination)
      
      const startTime = this.audioContext!.currentTime + i * 0.15
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0.25, startTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.25)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + 0.25)
    })
  }
}

export const audioManager = new AudioManager()

// 振动管理
export const vibrate = {
  short: () => {
    if (navigator.vibrate) navigator.vibrate(50)
  },
  long: () => {
    if (navigator.vibrate) navigator.vibrate(200)
  },
  double: () => {
    if (navigator.vibrate) navigator.vibrate([50, 100, 50])
  },
  triple: () => {
    if (navigator.vibrate) navigator.vibrate([50, 80, 50, 80, 50])
  }
}
