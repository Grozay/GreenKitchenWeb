// Quick messages list for GreenKitchen
export const quickMessages = [
  {
    id: 'greeting',
    text: 'Hello! I need assistance',
    icon: '👋',
    category: 'Greeting',
    tags: ['hello', 'assistance', 'help', 'greeting']
  },
  {
    id: 'menu',
    text: 'Can you show me the menu?',
    icon: '🍽️',
    category: 'Menu',
    tags: ['menu', 'food', 'dishes', 'list']
  },
  {
    id: 'order',
    text: 'I want to order food',
    icon: '📝',
    category: 'Order',
    tags: ['order', 'buy', 'purchase', 'food']
  },
  {
    id: 'delivery',
    text: 'Do you deliver?',
    icon: '🚚',
    category: 'Delivery',
    tags: ['delivery', 'ship', 'shipping', 'transport']
  },
  {
    id: 'price',
    text: 'How much is this dish?',
    icon: '💰',
    category: 'Price',
    tags: ['price', 'cost', 'how much', 'money']
  },
  {
    id: 'hours',
    text: 'What are your opening hours?',
    icon: '🕐',
    category: 'Hours',
    tags: ['hours', 'opening', 'closing', 'business hours']
  },
  {
    id: 'location',
    text: 'Where is your address?',
    icon: '📍',
    category: 'Location',
    tags: ['address', 'location', 'where', 'place']
  },
  {
    id: 'special',
    text: 'Do you have any special dishes?',
    icon: '⭐',
    category: 'Special',
    tags: ['special', 'signature', 'famous', 'unique']
  },
  {
    id: 'vegetarian',
    text: 'Do you have vegetarian options?',
    icon: '🥬',
    category: 'Diet',
    tags: ['vegetarian', 'vegan', 'no meat', 'plant-based']
  },
  {
    id: 'spicy',
    text: 'Is this dish spicy?',
    icon: '🌶️',
    category: 'Diet',
    tags: ['spicy', 'hot', 'pepper', 'chili']
  },
  {
    id: 'reservation',
    text: 'I want to make a reservation',
    icon: '🪑',
    category: 'Reservation',
    tags: ['reservation', 'booking', 'table', 'seat']
  },
  {
    id: 'payment',
    text: 'What payment methods do you accept?',
    icon: '💳',
    category: 'Payment',
    tags: ['payment', 'cash', 'card', 'momo', 'methods']
  },
  {
    id: 'promotion',
    text: 'Do you have any promotions?',
    icon: '🎉',
    category: 'Promotion',
    tags: ['promotion', 'discount', 'offer', 'deal']
  },
  {
    id: 'quality',
    text: 'Are your ingredients fresh?',
    icon: '🥩',
    category: 'Quality',
    tags: ['ingredients', 'fresh', 'quality', 'organic']
  },
  {
    id: 'portion',
    text: 'What is the portion size like?',
    icon: '🍽️',
    category: 'Portion',
    tags: ['portion', 'size', 'large', 'small', 'enough']
  }
]

// Group messages by category
export const groupedQuickMessages = quickMessages.reduce((acc, message) => {
  if (!acc[message.category]) {
    acc[message.category] = []
  }
  acc[message.category].push(message)
  return acc
}, {})

// Search quick messages
export const searchQuickMessages = (query) => {
  if (!query || query.trim() === '') return quickMessages
  
  const searchTerm = query.toLowerCase().trim()
  
  return quickMessages.filter(message => 
    message.text.toLowerCase().includes(searchTerm) ||
    message.category.toLowerCase().includes(searchTerm) ||
    message.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

// Get messages by category
export const getQuickMessagesByCategory = (category) => {
  return quickMessages.filter(message => message.category === category)
}

// Get message by ID
export const getQuickMessageById = (id) => {
  return quickMessages.find(message => message.id === id)
}
