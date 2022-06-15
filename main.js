const products = [
  // Hamburgesas
  { id: 1, name: 'Doble Cuarto de Libra con Queso', price: 700, isAbleToCombo: true, category: 'dish' },
  { id: 2, name: 'Big Mac ', price: 890, isAbleToCombo: true, category: 'dish' },
  { id: 3, name: 'McNifica', price: 500, isAbleToCombo: true, category: 'dish' },
  // Acompanamientos
  { id: 4, name: 'Papas Fritas', price: 200, isAbleToCombo: false, category: 'accompaniment' },
  { id: 5, name: 'Aros de cebolla', price: 250, isAbleToCombo: false, category: 'accompaniment' },
  // Bebidas
  { id: 6, name: 'Coca Cola', price: 200, isAbleToCombo: false, category: 'drink' },
  { id: 7, name: 'Fanta', price: 200, isAbleToCombo: false, category: 'drink' },
  { id: 8, name: 'Sprite', price: 200, isAbleToCombo: false, category: 'drink' }
]

const app = () => {
  alert('Bienvenido a McDonalds!')
}

app()
