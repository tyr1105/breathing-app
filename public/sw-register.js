if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/breathing-app/sw.js').catch(() => {
      // Service worker registration failed
    })
  })
}
