// Danh sách tin nhắn nhanh cho GreenKitchen
export const quickMessages = [
  {
    id: 'greeting',
    text: 'Xin chào! Tôi cần hỗ trợ',
    icon: '👋',
    category: 'Chào hỏi',
    tags: ['chào', 'hỗ trợ', 'xin chào']
  },
  {
    id: 'menu',
    text: 'Bạn có thể cho tôi xem menu không?',
    icon: '🍽️',
    category: 'Thực đơn',
    tags: ['menu', 'thực đơn', 'món ăn', 'danh sách']
  },
  {
    id: 'order',
    text: 'Tôi muốn đặt món',
    icon: '📝',
    category: 'Đặt món',
    tags: ['đặt món', 'đặt hàng', 'order', 'mua']
  },
  {
    id: 'delivery',
    text: 'Bạn có giao hàng không?',
    icon: '🚚',
    category: 'Giao hàng',
    tags: ['giao hàng', 'delivery', 'ship', 'vận chuyển']
  },
  {
    id: 'price',
    text: 'Món này giá bao nhiêu?',
    icon: '💰',
    category: 'Giá cả',
    tags: ['giá', 'giá cả', 'bao nhiêu', 'price', 'cost']
  },
  {
    id: 'hours',
    text: 'Giờ mở cửa của bạn là gì?',
    icon: '🕐',
    category: 'Giờ mở cửa',
    tags: ['giờ mở cửa', 'mở cửa', 'đóng cửa', 'business hours']
  },
  {
    id: 'location',
    text: 'Địa chỉ của bạn ở đâu?',
    icon: '📍',
    category: 'Địa chỉ',
    tags: ['địa chỉ', 'ở đâu', 'location', 'address']
  },
  {
    id: 'special',
    text: 'Bạn có món đặc biệt nào không?',
    icon: '⭐',
    category: 'Món đặc biệt',
    tags: ['món đặc biệt', 'special', 'signature', 'nổi tiếng']
  },
  {
    id: 'vegetarian',
    text: 'Bạn có món chay không?',
    icon: '🥬',
    category: 'Chế độ ăn',
    tags: ['chay', 'vegetarian', 'vegan', 'không thịt']
  },
  {
    id: 'spicy',
    text: 'Món này có cay không?',
    icon: '🌶️',
    category: 'Chế độ ăn',
    tags: ['cay', 'spicy', 'độ cay', 'nhiều ớt']
  },
  {
    id: 'reservation',
    text: 'Tôi muốn đặt bàn',
    icon: '🪑',
    category: 'Đặt bàn',
    tags: ['đặt bàn', 'reservation', 'booking', 'chỗ ngồi']
  },
  {
    id: 'payment',
    text: 'Bạn nhận thanh toán bằng gì?',
    icon: '💳',
    category: 'Thanh toán',
    tags: ['thanh toán', 'payment', 'tiền mặt', 'thẻ', 'momo']
  },
  {
    id: 'promotion',
    text: 'Bạn có khuyến mãi gì không?',
    icon: '🎉',
    category: 'Khuyến mãi',
    tags: ['khuyến mãi', 'promotion', 'giảm giá', 'discount', 'ưu đãi']
  },
  {
    id: 'quality',
    text: 'Nguyên liệu của bạn có tươi không?',
    icon: '🥩',
    category: 'Chất lượng',
    tags: ['nguyên liệu', 'tươi', 'chất lượng', 'fresh', 'quality']
  },
  {
    id: 'portion',
    text: 'Khẩu phần món này như thế nào?',
    icon: '🍽️',
    category: 'Khẩu phần',
    tags: ['khẩu phần', 'size', 'lớn', 'nhỏ', 'đủ ăn']
  }
]

// Nhóm tin nhắn theo category
export const groupedQuickMessages = quickMessages.reduce((acc, message) => {
  if (!acc[message.category]) {
    acc[message.category] = []
  }
  acc[message.category].push(message)
  return acc
}, {})

// Tìm kiếm tin nhắn nhanh
export const searchQuickMessages = (query) => {
  if (!query || query.trim() === '') return quickMessages
  
  const searchTerm = query.toLowerCase().trim()
  
  return quickMessages.filter(message => 
    message.text.toLowerCase().includes(searchTerm) ||
    message.category.toLowerCase().includes(searchTerm) ||
    message.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

// Lấy tin nhắn theo category
export const getQuickMessagesByCategory = (category) => {
  return quickMessages.filter(message => message.category === category)
}

// Lấy tin nhắn theo ID
export const getQuickMessageById = (id) => {
  return quickMessages.find(message => message.id === id)
}
