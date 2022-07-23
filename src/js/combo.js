/** Interfaz de un producto
 * @typedef {Object} Product
 * @property {String} name
 * @property {String} img
 * @property {Number} price
 * @property {Number} [priceInCombo]
 * @property {Boolean} isAbleToCombo
 */

/** Interfaz de una categoria
 * @typedef {Object} Category
 * @property {String} set
 * @property {String} superset
 * @property {String} name
 * @property {String} img
 */

/** Interfaz de la respuesta de la API
 * @typedef {Object[]} APIResponse
 * @property {Category} details
 * @property {Product[]} products
 */

let selectDrink = false

const ProductCard = ({ product }) => {
  const productElement = document.createElement('div')
  productElement.classList.add('terminal__item', 'row', 'cursor_pointer')

  const productTemplate = `
    <img src="../public/products/${product.img}" class="terminal__item__image" alt="${product.name}">
    <div class="terminal__item__info">
      <h2 class="terminal__item__title">${product.name}</h2>
      <span class="terminal__item__price">$${product.priceInCombo}</span>
    </div>
  `

  productElement.onclick = async () => {
    if (!selectDrink) {
      selectDrink = true

      addProductToCombo({ product })

      const categoriesWithProducts = await fetchProducts()
      const drinks = categoriesWithProducts.find(category => category.details.set === 'drinks').products
      RenderProductList({ caption: '2. Selecciona una bebida', products: drinks })
    } else {
      addComboToCart({ product })
    }
  }

  productElement.innerHTML = productTemplate
  return productElement
}

const RenderProductList = ({ caption, products }) => {
  const productList = document.querySelector('#foods')
  productList.innerHTML = `<h1 class="terminal__title">${caption}</h1>`

  products.forEach(product => {
    productList.appendChild(ProductCard({ product }))
  })
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

function addProductToCombo ({ product }) {
  const combo = JSON.parse(localStorage.getItem('combo'))
  const productCombo = { ...product, price: product.priceInCombo }

  combo.combo = { side: productCombo }
  localStorage.setItem('combo', JSON.stringify(combo))
}

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

function addComboToCart ({ product }) {
  const combo = JSON.parse(localStorage.getItem('combo'))
  const productCombo = { ...product, price: product.priceInCombo }

  combo.id = uuidv4()
  combo.combo.drink = productCombo
  combo.quantity = 1

  const prices = { combo: combo.price, side: combo.combo.side.price, drink: combo.combo.drink.price }
  const totalPrice = Object.values(prices).reduce((acc, item) => acc + item, 0)

  combo.price = totalPrice

  const cart = JSON.parse(localStorage.getItem('cart')) || []
  const updetedCart = [...cart, combo]

  localStorage.setItem('cart', JSON.stringify(updetedCart))
  localStorage.removeItem('combo')
  updateCheckOut()

  window.location.href = './order.html'
}

/** Obitene los productos desde el JSON mediante fetch */
async function fetchProducts () {
  const productsURL = '../public/products.json'
  const products = await fetch(productsURL)
  const productsJSON = await products.json()
  return productsJSON
}

(async () => {
  const categoriesWithProducts = await fetchProducts()

  const cancelButton = document.getElementById('cancel-combo')
  cancelButton.addEventListener('click', async () => {
    // eslint-disable-next-line no-undef
    const swalResponse = await Swal.fire({
      customClass: {
        container: 'terminal-swal-container',
        popup: 'terminal-swal-popup'
      },
      showClass: { popup: 'animate__animated animate__slideInUp animate__fast' },
      hideClass: { popup: 'animate__animated animate__slideOutDown animate__fast' },
      title: 'Estás seguro de que querés descartar el combo?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      target: document.getElementsByTagName('main')[0]
    })

    if (swalResponse.isConfirmed) {
      localStorage.removeItem('combo')
      document.location = './order.html'
    }
  })

  // Obitiene los datos del combo desde el localStorage
  const combo = JSON.parse(localStorage.getItem('combo'))
  console.log(combo)

  const sides = categoriesWithProducts.find(category => category.details.set === 'sides').products
  RenderProductList({ products: sides, caption: '1. Selecciona un acompañamiento' })

  updateCheckOut()

  const cartButton = document.getElementById('cart-button')
  cartButton.addEventListener('click', () => {
    window.location.href = './cart.html'
  })
})()
