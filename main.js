const products = [
  // Hamburgesas
  { name: 'Doble Cuarto de Libra con Queso', price: 700, isAbleToCombo: true, category: 'dish' },
  { name: 'Big Mac', price: 890, isAbleToCombo: true, category: 'dish' },
  { name: 'McNifica', price: 500, isAbleToCombo: true, category: 'dish' },
  // Acompanamientos
  { name: 'Papas Fritas', price: 200, priceInCombo: 150, category: 'accompaniment', isAbleToResize: true },
  { name: 'Papas Fritas con Cheddar y Bacon', price: 250, priceInCombo: 200, category: 'accompaniment' },

  // Bebidas
  { name: 'Coca Cola', price: 200, priceInCombo: 50, category: 'drink', isAbleToResize: true },
  { name: 'Fanta', price: 200, priceInCombo: 50, category: 'drink', isAbleToResize: true },
  { name: 'Sprite', price: 200, priceInCombo: 50, category: 'drink', isAbleToResize: true }
]

/** Obtiene via prompt el nombre del producto que desea seleccionar
 * @param {{id: number, name: string, price: number, isAbleToCombo: boolean, category: string}[]} products
 */
const getProductByName = (message, products, filter) => {
  // /** @type {Array<{id: number, name: string, price: number, isAbleToCombo: boolean, category: string}>} */
  products = (filter) ? products.filter(product => product.category === filter) : products
  const productsNames = products.map(product => `${product.name} - ${product.price}`)

  const selectedProduct = prompt(`${message}\n${productsNames.join('\n')}`)
  if (!selectedProduct) return getProductByName('Seleccione un producto valido!', products, filter)
  const selectedProductData = products.find(product => product.name.toLowerCase().trim() === selectedProduct.toLowerCase().trim())
  if (selectedProductData) return selectedProductData
  else return getProductByName('Seleccione un producto valido!', products, filter)
}
/** @param {{id: number, name: string, price: number, isAbleToCombo: boolean, category: string}[]} order */
const printOrder = (order) => {
  const parsedOrder = order.map(product => {
    const productName = product.name
    const isCombo = product.isCombo
    let productPrice = product.price

    if (isCombo) {
      const accompaniment = product.comboOptions.accompaniment
      const drink = product.comboOptions.drink
      // console.log(drink)

      productPrice += accompaniment.priceInCombo += drink.priceInCombo
      if (product.isBig) productPrice += 120

      return { message: `${productName} (En Combo) - $${productPrice}\n  - ${accompaniment.name} - $${accompaniment.priceInCombo}\n  - ${drink.name} - $${drink.priceInCombo}${(product.isBig) ? '\n  - Tamaño grande - $120' : ''}`, price: productPrice }
    }

    return { message: `${productName} - $${productPrice}`, price: productPrice }
  })

  const totalPrice = parsedOrder.reduce((acc, product) => acc + product.price, 0)
  alert(`Su pedido es: \n${parsedOrder.map(product => product.message).join('\n')}\n\nTotal: $${totalPrice}`)
}

const app = () => {
  alert('Bienvenido a McDonalds!')

  const order = [] // Guarda los productos que se van añadiendo al pedido
  let whileCondition = true
  while (whileCondition) {
    let product = getProductByName('¿Que producto desea seleccionar? Escriba el nombre', products)
    // En caso de que el producto este disponible para combo, se pide al usuario si lo desea en combo
    if (product.isAbleToCombo) {
      const isCombo = confirm(`¿Desea el producto '${product.name}' en combo?`)
      if (isCombo) {
        // En caso de que el cliente lo desee en como, se pide que agregue el acompanamiento
        const accompaniment = getProductByName('¿Que acompañamiento desea agregar? Escriba el nombre', products, 'accompaniment')
        // Luego se le pide el tipo de bebida
        const drink = getProductByName('¿Que bebida desea agregar? Escriba el nombre', products, 'drink')

        // Se pregunta si se quiere agrandar el combo
        const isBig = confirm('¿Desea agrandar el combo?')

        product = { ...product, isCombo: true, comboOptions: { accompaniment, drink }, isBig }
      }
    }
    order.push(product)
    whileCondition = confirm('Producto Agregado!\n¿Desea seleccionar otro producto?')
  }

  printOrder(order)
}

app()
