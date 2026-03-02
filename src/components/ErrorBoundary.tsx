import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zen-bg flex items-center justify-center p-4">
          <div className="max-w-sm w-full text-center">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-light text-zen-text mb-4">
              出错了
            </h2>
            <p className="text-zen-text-dim mb-6">
              应用遇到了问题，请尝试刷新页面
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-zen-accent/20 hover:bg-zen-accent/30 
                         text-zen-accent rounded-2xl transition-all font-medium"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
