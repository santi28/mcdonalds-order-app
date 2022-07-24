const finish = document.getElementById('finish')
setTimeout(() => {
  finish.classList.add('slide-up')
}, 3000)

const finishButton = document.getElementById('finish-button')
finishButton.addEventListener('click', () => {
  localStorage.clear()
  window.location.href = '../'
})
