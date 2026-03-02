interface SafetyModalProps {
  onConfirm: () => void
}

export function SafetyModal({ onConfirm }: SafetyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-zen-bg-light rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-zen-accent/10">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl sm:text-2xl font-semibold text-zen-gold">
            重要安全提示
          </h2>
        </div>
        
        <ul className="space-y-3 sm:space-y-4 text-zen-text mb-6 sm:mb-8">
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg">•</span>
            <span className="text-sm sm:text-base">请勿在水中、驾驶时或站立时练习</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg">•</span>
            <span className="text-sm sm:text-base">如有心脏病、高血压、癫痫等疾病，请先咨询医生</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg">•</span>
            <span className="text-sm sm:text-base">如感到头晕或不适，请立即停止</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg">•</span>
            <span className="text-sm sm:text-base">本应用仅供健康人士使用，不构成医疗建议</span>
          </li>
        </ul>

        <button
          onClick={onConfirm}
          className="w-full py-3 sm:py-4 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                     text-zen-accent rounded-xl transition-all font-medium text-base sm:text-lg
                     active:scale-98"
        >
          我已了解并同意
        </button>
      </div>
    </div>
  )
}
