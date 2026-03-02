// 全局错误处理

export function setupErrorHandling() {
  // 捕获未处理的 Promise rejection
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // 可以选择在这里上报错误
    // reportError(event.reason)
  })

  // 捕获全局错误
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    // 可以选择在这里上报错误
    // reportError(event.error)
  })
}

// 本地存储错误日志
export function logError(error: Error, context?: string) {
  try {
    const errorLog = JSON.parse(localStorage.getItem('breathing-error-log') || '[]')
    errorLog.push({
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    })
    
    // 只保留最近 10 条错误
    if (errorLog.length > 10) {
      errorLog.shift()
    }
    
    localStorage.setItem('breathing-error-log', JSON.stringify(errorLog))
  } catch {
    // 忽略存储错误
  }
}

// 获取错误日志
export function getErrorLog() {
  try {
    return JSON.parse(localStorage.getItem('breathing-error-log') || '[]')
  } catch {
    return []
  }
}

// 清除错误日志
export function clearErrorLog() {
  localStorage.removeItem('breathing-error-log')
}
