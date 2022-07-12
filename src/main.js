/* eslint-disable no-undef */
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

const allProductsInCart = []
const primaryFoods = document.querySelector('#primary-foods')
const accompanimentsWrapper = document.querySelector('#accompaniments')
const drinksWrapper = document.querySelector('#drinks')

const cart = document.querySelector('#order-cart')
const cartTotalPrice = document.querySelector('#totalPrice')

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
  // Renderiza los datos escenciales para cualquier producto
  if (comboDetails !== undefined) {
    productComboInformation = `
        <div class="order__product__combo">
          <img src="imgs/${comboDetails.accompaniment.img}" alt="${comboDetails.accompaniment.name}">
          <img src="imgs/${comboDetails.drink.img}" alt="${comboDetails.drink.name}">
        </div>
      `
  }

  // Renderiza el acompañamiento y bebida para el combo
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

const renderProductsInSpecificBox = (htmlElement, products, productHandler) => {
  htmlElement.innerHTML = ''
  products.forEach(products => {
    const productCard = renderProductCard(products, productHandler)
    htmlElement.appendChild(productCard)
  })
}

/** Calcula el precio total de los productos pedidos teniendo en cuenta el combo, devuelve un objeto listo para la funcion renderCartProduct
 * @param {Product} food - Producto principal pedido
 * @param {Product} accompaniment - Acompañamiento pedido
 * @param {Product} drink - Bebida pedida
 * @param {boolean} isResized - Indica si el producto fue aumentado
 */
const calculateComboToRender = (food, accompaniment, drink, isResized) => {
  const foodPrice = food.price
  const accompanimentPrice = accompaniment.priceInCombo
  const drinkPrice = drink.priceInCombo

  let totalPrice = foodPrice + accompanimentPrice + drinkPrice
  let finalName = `${food.name} con ${accompaniment.name} y ${drink.name}`

  if (isResized) {
    totalPrice += 150
    finalName += ' (Aumentado)'
  }

  return [{ ...food, name: finalName, price: totalPrice }, { accompaniment, drink }]
}

const addProductToCart = (product, isInCombo) => {
  console.log('Adding product to cart')

  if (isInCombo) {
    const accompaniments = products.filter(p => p.category === 'accompaniment')
    const drinks = products.filter(p => p.category === 'drink')

    const comboDetails = {}
    primaryFoods.classList.add('hidden') // Esconde el selector de primario de comida
    accompanimentsWrapper.classList.remove('hidden') // Muestra el selector de acompañamientos

    // Al elegir un combo, se muestra el selector de accompanamientos
    renderProductsInSpecificBox(accompanimentsWrapper, accompaniments, (id) => {
      comboDetails.accompaniment = products.find(p => p.id === id)
      accompanimentsWrapper.classList.add('hidden') // Esconde el selector de acompañamientos
      drinksWrapper.classList.remove('hidden') // Muestra el selector de bebidas

      // Una vez seleccionado el acompañamiento, se muestra el selector de bebidas
      renderProductsInSpecificBox(drinksWrapper, drinks, (id) => {
        comboDetails.drink = products.find(p => p.id === id)
        drinksWrapper.classList.add('hidden') // Esconde el selector de bebidas
        primaryFoods.classList.remove('hidden') // Muestra el selector de primario de comida

        Swal.fire({
          title: '¿Quiere agrandar el producto?',
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'No'
        }).then((result) => {
          const calculatedCombo = calculateComboToRender(product, comboDetails.accompaniment, comboDetails.drink, result.isConfirmed)
          // Finalmente, se agrega el producto al carrito
          allProductsInCart.push(calculatedCombo[0])
          cart.appendChild(renderCartProduct(calculatedCombo[0], calculatedCombo[1]))

          const allProductsInCartPrice = allProductsInCart.reduce((acc, curr) => acc + curr.price, 0)
          cartTotalPrice.innerHTML = `Total: $${allProductsInCartPrice}`
        })
      })
    })
  } else {
    allProductsInCart.push(product)
    cart.appendChild(renderCartProduct(product))

    const allProductsInCartPrice = allProductsInCart.reduce((acc, curr) => acc + curr.price, 0)
    cartTotalPrice.innerHTML = `Total: $${allProductsInCartPrice}`
  }
}

/** Renderiza la tarjeta de un producto pedido basado en el id del producto
 * @param {number} id - Identificador del producto
 */
const createFoodOrder = (id) => {
  // const isInCombo = false
  console.log('Creating food order')

  const product = products.find(p => p.id === id)
  if (product.isAbleToCombo !== undefined) {
    Swal.fire({
      title: 'Producto disponible para combo!',
      text: `Quiere agregar el producto "${product.name}" en combo?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      addProductToCart(product, result.isConfirmed)
    })
  } else {
    addProductToCart(product)
  }
}

// Programa Principal
cartTotalPrice.innerHTML = 'Total: $0'

// Obtiene los productos desde el local storage
let products = JSON.parse(localStorage.getItem('products')) || null
if (!products) { // Comprueba si existen los productos
  // En caso de no existir, se obtienen los productos desde el servidor
  fetch('./public/products.json')
    .then(response => response.json())
    .then(data => {
      products = data
      console.log('Getting products from server')
      localStorage.setItem('products', JSON.stringify(products))
      renderProductsInSpecificBox(primaryFoods, products, createFoodOrder)
    }).then()
    .catch(error => console.log(error))
} else {
  console.log('Getting products from local storage')
  renderProductsInSpecificBox(primaryFoods, products, createFoodOrder)
}
