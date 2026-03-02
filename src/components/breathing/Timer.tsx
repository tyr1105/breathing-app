interface TimerProps {
  time: number
  label: string
}

export function Timer({ time, label }: TimerProps) {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (
    <div className="text-center">
      <div className="text-6xl font-light text-zen-text mb-2 tracking-wider">
        {String(minutes).padStart(2, '0')}
        <span className="animate-pulse">:</span>
        {String(seconds).padStart(2, '0')}
      </div>
      <div className="text-sm text-zen-text-dim">{label}</div>
    </div>
  )
}
