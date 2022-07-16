/* eslint-disable no-undef */
// #region HTML Templates
const ProductCard = (name, price, imgURL, imgAlt) => {
  const productArticle = document.createElement('article')

  const productImg = document.createElement('img')

  const productDetails = document.createElement('div')
  productDetails.classList.add('details')

  const productName = document.createElement('h3')
  const productPrice = document.createElement('p')

  productImg.src = `../public/products/${imgURL}`
  productImg.alt = imgAlt

  productName.textContent = name
  productPrice.textContent = `$${price}`

  productDetails.appendChild(productName)
  productDetails.appendChild(productPrice)

  productArticle.appendChild(productImg)
  productArticle.appendChild(productDetails)

  return productArticle
}

const CategoryCard = (name, imgURL, imgAlt) => {
  const categoryArticle = document.createElement('article')
  const categoryImg = document.createElement('img')
  const categoryName = document.createElement('h2')

  categoryImg.src = `../public/products/${imgURL}`
  categoryImg.alt = imgAlt

  categoryName.textContent = name

  categoryArticle.appendChild(categoryImg)
  categoryArticle.appendChild(categoryName)

  return categoryArticle
}
// #endregion

/** Obtiene los productos con una peticion fetch
 * @returns {Promise<Array>}
 */
async function getProducts () {
  const response = await fetch('../public/products.json')
  const data = await response.json()
  return data
}

/** Renderiza en el elemento pasado, los productos de la categoria
 * @param {HTMLElement} element
 * @param {Array} products
 */
async function renderProducts (element, products) {
  element.innerHTML = ''
  for (const product of products) {
    const productCard = ProductCard(product.name, product.price, product.img, product.name)
    productCard.addEventListener('click', async () => {
      if (product.isAbleToCombo) {
        const swalResponse = await Swal.fire({
          customClass: {
            container: 'terminal-swal-container',
            popup: 'terminal-swal-popup'
          },
          showClass: { popup: 'animate__animated animate__slideInUp animate__fast' },
          hideClass: { popup: 'animate__animated animate__slideOutDown animate__fast' },
          title: `Querés pedir '${product.name}' en combo?`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          target: document.getElementsByTagName('main')[0]
        })

        console.log({ swalResponse })

        if (!swalResponse.isConfirmed) {
          addProductToCart(product)
        } else {
          localStorage.setItem('combo', JSON.stringify(product))
          document.location = './sides.html'
        }
      } else {
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
          addProductToCart(product)
        }
      }
    })

    element.appendChild(productCard)
  }
}

/** Marca el elemento presionado como seleccionado y remueve la seleccion del resto
 * @param {string} markElementID
 */
function markActive (markElementID) {
  const activeElement = document.getElementById(markElementID)
  const categoriesWrapper = document.querySelector('.categories')

  console.log({ activeElement, categoriesWrapper })

  // For each element remove active class
  for (const category of categoriesWrapper.children) {
    category.classList.remove('selected')
  }

  activeElement.classList.add('selected')
}

function addProductToCart (product) {
  // Obtiene y parsea el carrito desde localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || []

  // Verifica si el producto ya esta en el carrito
  const productInCart = cart.find(item => item.name === product.name)

  // Si el producto no esta en el carrito, lo agrega
  if (!productInCart) {
    const modifiedProduct = { ...product, quantity: 1 }
    cart.push(modifiedProduct)
  } else {
    // Si el producto ya esta en el carrito, incrementa la cantidad
    productInCart.quantity++
  }

  // Guarda el carrito en localStorage
  localStorage.setItem('cart', JSON.stringify(cart))

  console.log({ product, productInCart })
}

const listOfCategories = document.getElementById('categories_list')
const listOfProducts = document.getElementById('product_list')

const restartButton = document.getElementById('restart')
restartButton.addEventListener('click', async () => {
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

const App = async () => {
  // Obtiene los datos desde el JSON con los datos de los productos
  const products = await getProducts()

  // Por cada categoria la lista en el div donde se muestran las categorias
  await products.forEach(category => {
    const categoryDetails = category.details
    const categoryCard = CategoryCard(categoryDetails.name, categoryDetails.img, categoryDetails.name)
    categoryCard.id = categoryDetails.set

    categoryCard.addEventListener('click', () => {
      markActive(categoryCard.id)
      renderProducts(listOfProducts, category.products)
    })

    listOfCategories.appendChild(categoryCard)
  })

  // Selecciona las hamburguesas como categoria por defecto
  markActive('hamburgers')
  renderProducts(listOfProducts, products[0].products)
}

(async () => {
  await App()
})()
