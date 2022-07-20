const ProductCard = (name, price, imgURL, imgAlt, quantity) => {
  const productArticle = document.createElement('article')

  const productTemplate = `<img src="../public/products/${imgURL}" alt="${imgAlt}">
    <div class="details flex1">
      <h3>${name}</h3>
      <span class="price">$${price}</span>
      <div class="contentWrapper actionWrapper">
        <span>Cantidad: ${quantity}</span>
      </div>
    </div>`

  productArticle.innerHTML = productTemplate

  return productArticle
}

function updateCheckOut () {
  const cart = JSON.parse(localStorage.getItem('cart')) || []

  const totalProducts = cart.reduce((acc, item) => { return acc + item.quantity }, 0)
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)

  const checkPrice = document.getElementById('check-price')
  checkPrice.textContent = `$${totalPrice}`

  const checkProducts = document.getElementById('check-products')
  checkProducts.textContent = `Confirmar (${totalProducts} Items)`
}

function showCartProducts () {
  const cart = JSON.parse(localStorage.getItem('cart')) || []

  const cartContainer = document.getElementById('cart-wrapper')
  cartContainer.innerHTML = ''

  cart.forEach(item => {
    const totalPriceOfItem = item.price * item.quantity
    const productCard = ProductCard(item.name, totalPriceOfItem, item.img, item.name, item.quantity)
    cartContainer.appendChild(productCard)
  })
}

const App = async () => {
  updateCheckOut()
  showCartProducts()
}

(async () => {
  await App()
})()
