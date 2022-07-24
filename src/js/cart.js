const Product = ({ id, img, name, price, quantity, combo }) => {
  // Contenedor principal del producto
  const item = document.createElement('div')
  item.classList.add('terminal__item', 'row')
  item.dataset.id = id

  // #region Imagen
  const image = document.createElement('img')
  image.classList.add('terminal__item__image')
  image.src = `../public/products/${img}`
  // #endregion
  // #region Info container
  const info = document.createElement('div')
  info.classList.add('terminal__item__info')
  // #endregion

  // #region Title
  const titleContainer = document.createElement('h2')
  titleContainer.classList.add('terminal__item__title')
  titleContainer.innerText = name
  // #endregion
  // #region Price
  const priceContainer = document.createElement('span')
  priceContainer.classList.add('terminal__item__price')
  priceContainer.innerText = `$${price}`

  if (quantity > 1) {
    priceContainer.innerText += ` • ($${price * quantity})`
  }
  // #endregion

  // #region Footer
  const footer = document.createElement('section')
  footer.classList.add('terminal__item__footer', 'row')
  // #endregion

  // #region Actions
  const actions = document.createElement('div')
  actions.classList.add('terminal__item__actions')
  // #endregion

  // #region Quantity
  const quantityElement = document.createElement('span')
  quantityElement.classList.add('terminal__item__actions__counter__value')
  quantityElement.innerText = `${quantity} Items`
  // #endregion

  // #region Button
  const button = document.createElement('button')
  button.classList.add('button', 'square', 'small')
  button.innerHTML = '<ion-icon name="trash"></ion-icon>'
  // #endregion

  // Agregar elementos
  actions.appendChild(quantityElement)
  actions.appendChild(button)

  button.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    const index = cart.findIndex(item => item.id === id)
    if (index > -1) {
      cart.splice(index, 1)
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    rednderCart()
  })

  footer.appendChild(actions)

  // Información del combo
  if (combo) {
    // #region Combo info
    const comboInfo = document.createElement('div')
    comboInfo.classList.add('terminal__item__combo_info', 'row')
    // #endregion
    // #region Drink combo image
    const drinkComboImage = document.createElement('img')
    drinkComboImage.classList.add('terminal__item__combo_info__image')
    drinkComboImage.src = `../public/products/${combo.drink.img}`
    // #endregion
    // #region Side combo image
    const sideComboImage = document.createElement('img')
    sideComboImage.classList.add('terminal__item__combo_info__image')
    sideComboImage.src = `../public/products/${combo.side.img}`
    // #endregion
    comboInfo.appendChild(drinkComboImage)
    comboInfo.appendChild(sideComboImage)
    footer.appendChild(comboInfo)
  }

  info.appendChild(titleContainer)
  info.appendChild(priceContainer)
  info.appendChild(footer)
  item.appendChild(image)
  item.appendChild(info)

  return item
}

function updateCheckOut () {
  const cart = JSON.parse(localStorage.getItem('cart')) || []

  const totalProducts = cart.reduce((acc, item) => { return acc + item.quantity }, 0)
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const checkPrice = document.getElementById('checkout-price')
  checkPrice.textContent = `$${totalPrice}`

  const checkProducts = document.getElementById('checkout-products')
  checkProducts.textContent = `Confirmar (${totalProducts} Items)`
}

function rednderCart () {
  const cart = document.querySelector('#foods')
  cart.innerHTML = ''

  const localCart = JSON.parse(localStorage.getItem('cart'))
  if (localCart) {
    console.log(localCart)
    localCart.forEach(product => {
      cart.appendChild(Product(product))
    })
  }

  updateCheckOut()
}

(async () => {
  const returnButton = document.querySelector('#return-button')
  returnButton.addEventListener('click', () => {
    window.location.href = './order.html'
  })

  const paymentButton = document.querySelector('#pay-button')
  paymentButton.addEventListener('click', () => {
    window.location.href = './checkout.html'
  })

  rednderCart()
})()
