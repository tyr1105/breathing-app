import { AlertTriangle } from 'lucide-react'

interface SafetyModalProps {
  onConfirm: () => void
  onSkip?: () => void
}

export function SafetyModal({ onConfirm, onSkip }: SafetyModalProps) {
  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50">
      <div className="bg-zen-bg-light rounded-3xl p-8 max-w-md w-full shadow-2xl border border-zen-accent/10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="w-16 h-16 text-zen-gold" />
          </div>
          <h2 className="text-2xl font-semibold text-zen-gold">
            安全提示
          </h2>
        </div>
        
        <ul className="space-y-4 text-zen-text mb-8">
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg mt-0.5">•</span>
            <span>请勿在水中、驾驶时或站立时练习</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg mt-0.5">•</span>
            <span>如有心脏病、高血压、癫痫等疾病，请先咨询医生</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg mt-0.5">•</span>
            <span>如感到头晕或不适，请立即停止</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-zen-accent text-lg mt-0.5">•</span>
            <span className="text-zen-text-dim">本应用仅供健康人士使用</span>
          </li>
        </ul>

        <div className="space-y-3">
          <button
            onClick={onConfirm}
            className="w-full py-4 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                       text-zen-accent rounded-2xl transition-all font-medium text-lg
                       active:scale-98"
          >
            我已了解，开始训练
          </button>
          
          {onSkip && (
            <button
              onClick={onSkip}
              className="w-full py-3 px-6 text-zen-text-dim hover:text-zen-text 
                         transition-colors text-sm"
            >
              不再显示此提示
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
