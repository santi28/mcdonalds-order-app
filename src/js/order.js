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

/** Devuelve un elemento con los estilos pertenecientes al de una categoria */
const CategoryCard = ({ category, products }) => {
  const categoryProducts = products.filter(product => product.details.set === category.set)

  const gettedProducts = []
  categoryProducts.forEach(categories => {
    gettedProducts.push(...categories.products)
  })

  const rawProducts = []
  products.forEach(categories => {
    rawProducts.push(...categories.products)
  })

  const categoryElement = document.createElement('li')
  categoryElement.classList.add('terminal__item', 'cursor_pointer')
  categoryElement.dataset.active = false

  const categoryTemplate = `
    <img src="../public/products/${category.img}" class="terminal__item__image">
    <h2 class="terminal__item__title">${category.name}</h2>
  `

  categoryElement.innerHTML = categoryTemplate

  categoryElement.onclick = () => {
    const activeItem = categoryElement.dataset.active
    if (activeItem === 'true') {
      RenderProductList({ products: rawProducts })
      categoryElement.dataset.active = false
    } else {
      RenderProductList({ products: gettedProducts })
      categoryElement.dataset.active = true
    }
  }

  return categoryElement
}

/** Devuelve el elemento correspondiente a un producto */
const ProductCard = ({ product }) => {
  const productElement = document.createElement('div')
  productElement.classList.add('terminal__item', 'row', 'cursor_pointer')

  const productTemplate = `
    <img src="../public/products/${product.img}" class="terminal__item__image" alt="${product.name}">
    <div class="terminal__item__info">
      <h2 class="terminal__item__title">${product.name}</h2>
      <span class="terminal__item__price">$${product.price}</span>
    </div>
  `

  productElement.onclick = async () => {
    if (product.isAbleToCombo) {
      // eslint-disable-next-line no-undef
      const swalResponse = await Swal.fire({
        customClass: {
          container: 'terminal-swal-container',
          popup: 'terminal-swal-popup'
        },
        showClass: { popup: 'animate__animated animate__slideInUp animate__fast' },
        hideClass: { popup: 'animate__animated animate__slideOutDown animate__fast' },
        title: `Querés la '${product.name}' en combo?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        target: document.getElementsByTagName('main')[0]
      })

      if (swalResponse.isConfirmed) generateProductCombo(product)
      else await addProductToCart(product)
    } else await addProductToCart(product)
  }

  productElement.innerHTML = productTemplate
  return productElement
}

/** Renderiza la lista de categorias */
const RenderCategoryList = ({ categories, products }) => {
  const categoryList = document.querySelector('#category-list')
  const categoryListItems = categories.map(category => {
    return CategoryCard({ category, products })
  })

  categoryList.innerHTML = ''
  categoryListItems.forEach(category => {
    categoryList.appendChild(category)
  })
}

const RenderProductList = ({ products }) => {
  const productList = document.querySelector('#food-list')
  productList.innerHTML = ''

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

function uuidv4 () {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}

async function addProductToCart (product) {
  // eslint-disable-next-line no-undef
  const swalResponse = await Swal.fire({
    customClass: {
      container: 'terminal-swal-container',
      popup: 'terminal-swal-popup'
    },
    showClass: { popup: 'animate__animated animate__slideInUp animate__fast' },
    hideClass: { popup: 'animate__animated animate__slideOutDown animate__fast' },
    title: `Querés agregar '${product.name}' al carrito?`,
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si',
    cancelButtonText: 'No',
    target: document.getElementsByTagName('main')[0]
  })

  if (swalResponse.isConfirmed) {
    // Obtiene y parsea el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    // Verifica si el producto ya esta en el carrito
    const productInCart = cart.find(item => item.name === product.name)

    // Si el producto no esta en el carrito, lo agrega
    if (!productInCart) {
      const modifiedProduct = { id: uuidv4(), ...product, quantity: 1 }
      cart.push(modifiedProduct)
    } else {
      // Si el producto ya esta en el carrito, incrementa la cantidad
      productInCart.quantity++
    }

    // Guarda el carrito en localStorage
    localStorage.setItem('cart', JSON.stringify(cart))
    updateCheckOut()

    console.log({ cart })
  }
}

function generateProductCombo (product) {
  localStorage.removeItem('combo')
  localStorage.setItem('combo', JSON.stringify(product))

  window.location.href = './order_combo.html'
}

/** Obitene los productos desde el JSON mediante fetch */
async function fetchProducts () {
  const productsURL = '../public/products.json'
  const products = await fetch(productsURL)
  const productsJSON = await products.json()
  return productsJSON
}

/** Devuelve un array con las categorias de los productos
 * @param {*} products
 */
function getCategories (products) {
  return products.map(product => product.details)
}

(async () => {
  /** @type {APIResponse} */
  const productsWithCategories = await fetchProducts()
  RenderCategoryList({ categories: getCategories(productsWithCategories), products: productsWithCategories })

  // Obtiene los productos de cada categoria
  const products = []
  productsWithCategories.forEach(categories => {
    products.push(...categories.products)
  })

  RenderProductList({ products })
  updateCheckOut()

  const restartButton = document.getElementById('restart')
  restartButton.addEventListener('click', async () => {
    // eslint-disable-next-line no-undef
    const swalResponse = await Swal.fire({
      customClass: {
        container: 'terminal-swal-container',
        popup: 'terminal-swal-popup'
      },
      showClass: { popup: 'animate__animated animate__slideInUp animate__fast' },
      hideClass: { popup: 'animate__animated animate__slideOutDown animate__fast' },
      title: 'Estás seguro de que querés descartar la orden?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
      target: document.getElementsByTagName('main')[0]
    })

    if (swalResponse.isConfirmed) {
      localStorage.clear()
      document.location = '../'
    }
  })

  const cartButton = document.getElementById('cart-button')
  cartButton.addEventListener('click', () => {
    window.location.href = './cart.html'
  })
})()
