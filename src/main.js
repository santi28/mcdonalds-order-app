// JSDoc Types
/** Definición de categorias de productos
 * @typedef {('dish'|'accompaniment'|'drink')} Category
 */
/** Definición de un producto
 * @typedef {Object} Product
 * @property {number} id - Identificador del producto
 * @property {string} name - Nombre del producto
 * @property {string} img - Imagen del producto
 * @property {number} price - Precio del producto
 * @property {number} [priceInCombo] - Precio del producto en combo
 * @property {boolean} [isAbleToCombo] - Indica si el producto puede ser combinado
 * @property {Category} category - Categoría del producto
 * @property {boolean} [isAbleToResize] - Indica si el producto puede ser aumentado
 */
/** Definición de productos del combo
 * @typedef {Object} comboDetails
 * @property {Product} accompaniment - Acompañamiento deseado para el combo
 * @property {Product} drink - Bebida deseada para el combo
 */

/** @type {Product[]} */
const products = [
  // Hamburgesas
  {
    id: '1',
    name: 'Doble Cuarto de Libra con Queso',
    img: 'dclq.png',
    price: 700,
    isAbleToCombo: true,
    category: 'dish'
  },
  {
    id: '2',
    name: 'Big Mac',
    img: 'bm.png',
    price: 890,
    isAbleToCombo: true,
    category: 'dish'
  },
  {
    id: '3',
    name: 'McNifica',
    img: 'mn.png',
    price: 500,
    isAbleToCombo: true,
    category: 'dish'
  },
  // Acompanamientos
  {
    id: '4',
    name: 'Papas Fritas',
    img: 'pf.png',
    price: 200,
    priceInCombo: 150,
    category: 'accompaniment',
    isAbleToResize: true
  },
  {
    id: '5',
    name: 'Papas Fritas con Cheddar y Bacon',
    img: 'pfcb.png',
    price: 250,
    priceInCombo: 200,
    category: 'accompaniment'
  },

  // Bebidas
  {
    id: '6',
    name: 'Coca Cola',
    img: 'cc.svg',
    price: 200,
    priceInCombo: 50,
    category: 'drink',
    isAbleToResize: true
  },
  {
    id: '7',
    name: 'Fanta',
    img: 'ft.png',
    price: 200,
    priceInCombo: 50,
    category: 'drink',
    isAbleToResize: true
  },
  {
    id: '8',
    name: 'Sprite',
    img: 'sp.png',
    price: 200,
    priceInCombo: 50,
    category: 'drink',
    isAbleToResize: true
  }
]

/** Renderiza la tarjeta de un producto en base a sus atributos
 * @param {Product} product
 * @returns {HTMLElement} Tarjeta lista para ser renderizada
 */
const renderProductCard = (product, clickHandler) => {
  const productCard = document.createElement('button')
  productCard.classList.add('food')
  productCard.setAttribute('data-id', product.id)

  productCard.innerHTML = `
    <img src="imgs/${product.img}" alt="${product.name}">
    <div class="food__content">
      <h2>${product.name}</h2>
      <span>Precio: ${product.price}</span>
    </div>
  `

  productCard.addEventListener('click', () => { clickHandler(product.id) })

  return productCard
}

/** Renderiza la tarjeta de un producto pedido en base a sus atributos
 * @param {Product} productDetails - Datos del producto
 * @param {comboDetails} comboDetails - Datos del acompañamiento y bebida
 * @returns
 */
const renderCartProduct = (productDetails, comboDetails) => {
  const product = document.createElement('div')
  product.classList.add('order__product')

  let productComboInformation
  if (comboDetails !== undefined) {
    productComboInformation = `
        <div class="order__product__combo">
          <img src="imgs/${comboDetails.accompaniment.img}" alt="${comboDetails.accompaniment.name}">
          <img src="imgs/${comboDetails.drink.img}" alt="${comboDetails.drink.name}">
        </div>
      `
  }

  product.innerHTML = `
    <img src="imgs/${productDetails.img}" alt="${productDetails.name}">
    <div class="order__product__information">
      <h3 class="order__product__name">${productDetails.name}</h3>
      <span class="order__product__price">Precio $${productDetails.price}</span>
      ${productComboInformation || ''}
    </div>
  `

  return product
}

// Programa Principal
const primaryFoods = document.querySelector('#primary-foods')
const cart = document.querySelector('#order-cart')

const productHandler = (id) => {
  let isInCombo = false
  let comboOption

  const product = products.find(p => p.id === id)
  if (product.isAbleToCombo !== undefined) {
    isInCombo = confirm(`Quiere agregar el producto "${product.name}" en combo?`)
  }

  if (isInCombo) comboOption = { accompaniment: products[4], drink: products[5] }

  // Una vez que seleccionamos un producto, se renderiza la selección en el carrito
  const cartProduct = renderCartProduct(product, comboOption)
  cart.appendChild(cartProduct)
}

products.forEach(products => {
  const productCard = renderProductCard(products, productHandler)
  primaryFoods.appendChild(productCard)
})
