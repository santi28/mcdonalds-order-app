const processing = document.getElementById('processing')
const payScreen = document.getElementById('pay_screen')

setTimeout(() => {
  processing.classList.add('slide-up')
  payScreen.classList.add('slide-in')
  localStorage.clear()
}, 2000)
