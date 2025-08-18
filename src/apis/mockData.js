import moment from 'moment'

export const BLOG_NOTIFICATION_TYPE = {
  REPLY: 'REPLY',
  LIKE: 'LIKE'
}
export const mockNotifications = [
  {
    id: 1,
    user: 'JaneDoe',
    type: BLOG_NOTIFICATION_TYPE.REPLY,
    content: 'replied to your comment on the blog "Understanding React Hooks"',
    time: moment().subtract(2, 'hours')
  },
  {
    id: 2,
    user: 'Admin',
    type: BLOG_NOTIFICATION_TYPE.LIKE,
    content: 'liked your blog post "10 Tips for Clean Code"',
    time: moment().subtract(1, 'day')
  }
]

export const categories = [
  'EVENTS',
  'PROMOTIONS',
  'ANNOUNCEMENTS',
  'MENU',
  'EXERCISES',
  'WEIGHT LOSS',
  'DIET PLANS'
]

export const newsItems = [
  {
    image: 'https://storage.googleapis.com/a1aa/image/ee346eb9-9fd5-4200-d074-e7745bef9e33.jpg',
    title: 'ORGANIZING AN EVENT FOR 300+ GUESTS? HERE\'S HOW FITFOOD HELPED THALLO HANDLE LUNCH AND BRAND IMAGE FLAWLESSLY',
    date: '10/05/2025',
    description: 'Fitfood x Thallo: 350 healthy meals for a medical conference – The perfect culinary solution for'
  },
  {
    image: 'https://storage.googleapis.com/a1aa/image/77519fcc-2213-459e-196f-687a74c018d8.jpg',
    title: 'BLOW OUT 10TH BIRTHDAY CANDLES - FITFOOD GIVES YOU 20% OFF',
    date: '02/05/2025',
    description: 'Get 20% off when you comment and share this post'
  },
  {
    image: 'https://storage.googleapis.com/a1aa/image/72dbcbe2-d5d4-4be1-b7d6-bc491242552e.jpg',
    title: 'FITFOOD X FARADAY - SINBLE: HOW TO TURN A LATE WEEKEND AFTERNOON SNACK INTO EMPLOYEES\' FAVORITE TIME?',
    date: '20/04/2025',
    description: 'Weekend, after stressful working hours,'
  }
]

// src/apis/blogDetailMock.js

export const detailedNewsItem = {
  id: 'faraday-sinble-event',
  image: 'https://storage.googleapis.com/a1aa/image/72dbcbe2-d5d4-4be1-b7d6-bc491242552e.jpg',
  title: 'FITFOOD X FARADAY - SINBLE: HOW TO TURN A LATE WEEKEND AFTERNOON SNACK INTO EMPLOYEES’ FAVORITE TIME?',
  date: '04/20/2025',
  categories: ['EVENTS', 'PROMOTIONS', 'ANNOUNCEMENTS'],
  contentMarkdown: `
Office Afternoon Snack: Small but Makes a Big Difference!

At the end of the week, after hours of intense work, a light afternoon snack is the most meaningful treat a company can offer its employees. More than just a meal, a well-planned snack break can:

* Banish fatigue and recharge energy for the afternoon.
* Foster teamល team bonding through shared moments.
* Boost morale and enhance work efficiency.
* Increase employee engagement and satisfaction with the company.

That’s why more and more businesses are paying attention to organizing afternoon snack events. Fitfood and Faraday – Sinble’s Happy Friday is a prime example.

![Office Snack Table](https://storage.googleapis.com/a1aa/image/ee346eb9-9fd5-4200-d074-e7745bef9e33.jpg)

*An example of a delightful office snack setup.*

### Faraday – Sinble: "A Need for Innovation"

Faraday – Sinble is an international investment advisory and asset management firm. With the philosophy of "COMPREHENSIVE AND TRANSPARENT INVESTMENT CONSULTING," they strive to create a professional and friendly work environment for their team.

"We wanted to establish a weekly Friday activity, a light afternoon snack that could foster connection and bring positive energy to our employees," a representative from Faraday – Sinble shared.

![Team Collaboration](https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)
*A dynamic and friendly workspace.*

### Fitfood: "Meeting Every Need"

Fitfood is proud to be the chosen culinary partner for Faraday – Sinble. With extensive experience in organizing events of all sizes and flexible menu customization, Fitfood delivered a perfect afternoon snack event:

* **Varied Menu:** From healthy pastries and fresh fruits to mixed salads and detox drinks.
* **Guaranteed Quality:** Fresh, hygienic, and nutritious ingredients.
* **Professional Service:** A dedicated team with quick and tidy setup.

![Healthy Food Spread](https://images.unsplash.com/photo-1540189549336-e6e1ad2e242d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

*Healthy and appealing dishes prepared by Fitfood.*

### Results: "Absolute Satisfaction"

Faraday – Sinble’s afternoon snack event was a resounding success. Employees were thrilled and delighted with the delicious and nutritious treats. The workplace atmosphere became noticeably more relaxed and cheerful.

"Fitfood truly helped us turn an ordinary Friday afternoon into the most anticipated time of the week. We are extremely satisfied with the service quality and look forward to continued collaboration," a Faraday – Sinble representative affirmed.

> **Would you like to organize a similar afternoon snack event for your company?**
>
> Contact Fitfood today for consultation and detailed quotes! We are committed to providing culinary solutions tailored to your needs and budget.
`
}
export const relatedNews = [
  {
    id: 'foody-review-event',
    image: 'https://storage.googleapis.com/a1aa/image/ee346eb9-9fd5-4200-d074-e7745bef9e33.jpg',
    title: 'ORGANIZING AN EVENT FOR 300+ GUESTS? HERE\'S HOW FITFOOD HELPED THALLO HANDLE LUNCH AND BRAND IMAGE FLAWLESSLY',
    date: '10/05/2025'
  },
  {
    id: 'birthday-promotion',
    image: 'https://storage.googleapis.com/a1aa/image/77519fcc-2213-459e-196f-687a74c018d8.jpg',
    title: 'BLOW OUT 10TH BIRTHDAY CANDLES - FITFOOD GIVES YOU 20% OFF',
    date: '02/05/2025'
  },
  {
    id: 'foody-review-event-2',
    image: 'https://storage.googleapis.com/a1aa/image/ee346eb9-9fd5-4200-d074-e7745bef9e33.jpg',
    title: 'FITFOOD X VADP - MORE THAN A HEALTHY LUNCH, A SUSTAINABLE LIFESTYLE PARTNERSHIP',
    date: '16/04/2025'
  }
]

export const mealPackages = [
  {
    id: 'fit-3-package',
    title: 'Half beef steak, sweet potato, cauliflower, pickles',
    price: '650,000đ',
    image: 'https://res.cloudinary.com/quyendev/image/upload/v1752552841/L1-300x300_mgdje8.png',
    calories: 650,
    protein: 40,
    carbs: 50,
    fat: 20,
    slug: 'fit-3-package',
    size: 'low'
  },
  {
    id: 'fit-3-package',
    title: 'Half beef steak, sweet potato, cauliflower, pickles',
    price: '650,000đ',
    image: 'https://res.cloudinary.com/quyendev/image/upload/v1752552841/L1-300x300_mgdje8.png',
    calories: 650,
    protein: 40,
    carbs: 50,
    fat: 20,
    slug: 'fit-3-package',
    size: 'high'
  },
  {
    id: 'fit-3-package',
    title: 'Half beef steak, sweet potato, cauliflower, pickles',
    price: '650,000đ',
    image: 'https://res.cloudinary.com/quyendev/image/upload/v1752552841/L1-300x300_mgdje8.png',
    calories: 650,
    protein: 40,
    carbs: 50,
    fat: 20,
    slug: 'fit-3-package',
    size: 'balance'
  },
  {
    id: 'fit-3-package',
    title: 'Half beef steak, sweet potato, cauliflower, pickles',
    price: '650,000đ',
    image: 'https://res.cloudinary.com/quyendev/image/upload/v1752552841/L1-300x300_mgdje8.png',
    calories: 650,
    protein: 40,
    carbs: 50,
    fat: 20,
    slug: 'fit-3-package',
    size: 'vegetarian'
  },
  {
    id: 'fit-3-package',
    title: 'Half beef steak, sweet potato, cauliflower, pickles',
    price: '650,000đ',
    image: 'https://res.cloudinary.com/quyendev/image/upload/v1752552841/L1-300x300_mgdje8.png',
    calories: 650,
    protein: 40,
    carbs: 50,
    fat: 20,
    slug: 'fit-3-package',
    size: 'low'
  },
  {
    id: 'fit-3-package',
    title: 'Half beef steak, sweet potato, cauliflower, pickles',
    price: '650,000đ',
    image: 'https://res.cloudinary.com/quyendev/image/upload/v1752552841/L1-300x300_mgdje8.png',
    calories: 650,
    protein: 40,
    carbs: 50,
    fat: 20,
    slug: 'fit-3-package',
    size: 'low'
  }
]

export const ItemHealthy = {
  protein: [
    {
      id: 1,
      title: 'Grilled Chicken Breast',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      type: 'protein'
    },
    {
      id: 2,
      title: 'Salmon Fillet',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png',
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 13,
      type: 'protein'
    },
    {
      id: 3,
      title: 'Tofu Scramble',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png',
      calories: 144,
      protein: 15,
      carbs: 5,
      fat: 8,
      type: 'protein'
    },
    {
      id: 4,
      title: 'Grilled Shrimp',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png',
      calories: 99,
      protein: 24,
      carbs: 0,
      fat: 1,
      type: 'protein'
    }
  ],
  carbs: [
    {
      id: 5,
      title: 'Quinoa Bowl',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      calories: 222,
      protein: 8,
      carbs: 39,
      fat: 4,
      type: 'carbs'
    },
    {
      id: 6,
      title: 'Sweet Potato Mash',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      calories: 180,
      protein: 3,
      carbs: 41,
      fat: 0.2,
      type: 'carbs'
    },
    {
      id: 7,
      title: 'Brown Rice',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      calories: 215,
      protein: 5,
      carbs: 45,
      fat: 1.8,
      type: 'carbs'
    },
    {
      id: 8,
      title: 'Whole Wheat Pasta',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      calories: 174,
      protein: 7.5,
      carbs: 37,
      fat: 0.8,
      type: 'carbs'
    },
    {
      id: 9,
      title: 'Whole Wheat Pasta',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      calories: 174,
      protein: 7.5,
      carbs: 37,
      fat: 0.8,
      type: 'carbs'
    },
    {
      id: 10,
      title: 'Whole Wheat Pasta',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      calories: 174,
      protein: 7.5,
      carbs: 37,
      fat: 0.8,
      type: 'carbs'
    }
  ],
  side: [
    {
      id: 11,
      title: 'Roasted Vegetables',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      calories: 80,
      protein: 3,
      carbs: 12,
      fat: 3,
      type: 'side'
    },
    {
      id: 12,
      title: 'Steamed Broccoli',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      calories: 55,
      protein: 3.7,
      carbs: 11,
      fat: 0.6,
      type: 'side'
    },
    {
      id: 13,
      title: 'Avocado Salad',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
      type: 'side'
    },
    {
      id: 14,
      title: 'Grilled Asparagus',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      calories: 40,
      protein: 3,
      carbs: 6,
      fat: 1,
      type: 'side'
    }
  ],
  sauce: [
    {
      id: 15,
      title: 'Pesto',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      calories: 80,
      protein: 2,
      carbs: 2,
      fat: 8,
      type: 'sauce'
    },
    {
      id: 16,
      title: 'Tahini Dressing',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      calories: 89,
      protein: 2.6,
      carbs: 3.2,
      fat: 8,
      type: 'sauce'
    },
    {
      id: 17,
      title: 'Greek Yogurt Sauce',
      image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      calories: 30,
      protein: 3,
      carbs: 2,
      fat: 1.5,
      type: 'sauce'
    }
  ]
}

export const menuSuggest = [
  {
    id: 1,
    calories: 100,
    protein: 10,
    carbs: 10,
    fat: 10,
    image: [
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png'
    ],
    description: 'Sous vide duck breast, Baked baby potato, Cold soba, French bean, Wasabi mayos'
  },
  {
    id: 2,
    calories: 100,
    protein: 10,
    carbs: 10,
    fat: 10,
    image: [
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png'
    ],
    description: 'Sous vide duck breast, Baked baby potato, Cold soba, French bean, Wasabi mayos'
  },
  {
    id: 3,
    calories: 100,
    protein: 10,
    carbs: 10,
    fat: 10,
    image: [
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png'
    ],
    description: 'Sous vide duck breast, Baked baby potato, Cold soba, French bean, Wasabi mayos dddddddddddddddddđssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss'
  },
  {
    id: 4,
    calories: 100,
    protein: 10,
    carbs: 10,
    fat: 10,
    image: [
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
      'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png'
    ],
    description: 'Sous vide duck breast, Baked baby potato, Cold soba, French bean, Wasabi mayos'
  }
]

export const itemCart = [
  // Custom meal item (bowl tự tạo)
  {
    id: 1,
    isCustom: true,
    type: 'custom',
    mealItem: {
      protein: [
        {
          id: 1,
          title: 'Grilled Chicken Breast',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/Top-blade-beef-steak-300x300_fvv3fj.png',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
          type: 'protein'
        }
      ],
      carbs: [
        {
          id: 5,
          title: 'Quinoa Bowl',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Donburi-white-rice--300x300_nszum2.png',
          calories: 222,
          protein: 8,
          carbs: 39,
          fat: 4,
          type: 'carbs'
        }
      ],
      side: [
        {
          id: 11,
          title: 'Roasted Vegetables',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Salad-and-nuts-300x300_rqk6ub.png',
          calories: 80,
          protein: 3,
          carbs: 12,
          fat: 3,
          type: 'side'
        }
      ],
      sauce: [
        {
          id: 15,
          title: 'Pesto',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/Cilantro-lime-300x300_sf78nk.png',
          calories: 80,
          protein: 2,
          carbs: 2,
          fat: 8,
          type: 'sauce'
        }
      ]
    },
    customer: {
      id: 1,
      name: 'Nguyen Van A',
      email: '0Vn0u@example.com'
    },
    quantity: 1,
    totalPrice: 1200
  },
  // Menu item có sẵn
  {
    id: 2,
    isCustom: false,
    type: 'menu',
    mealItem: {
      menu: [
        {
          id: 20,
          title: 'Mediterranean Salmon Bowl',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/mediterranean-salmon-bowl_tg4mxt.jpg',
          calories: 450,
          protein: 35,
          carbs: 25,
          fat: 22,
          type: 'menu',
          description: 'Grilled salmon with quinoa, cucumber, tomatoes, red onion, and tzatziki sauce'
        }
      ]
    },
    customer: {
      id: 2,
      name: 'Tran Thi B',
      email: 'tranb@example.com'
    },
    quantity: 1,
    totalPrice: 1500
  },
  // Custom meal khác
  {
    id: 3,
    isCustom: true,
    type: 'custom',
    mealItem: {
      protein: [
        {
          id: 2,
          title: 'Beef Sirloin',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1750922086/beef-sirloin-300x300_abc123.png',
          calories: 250,
          protein: 26,
          carbs: 0,
          fat: 15,
          type: 'protein'
        }
      ],
      carbs: [
        {
          id: 6,
          title: 'Sweet Potato',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/sweet-potato-300x300_def456.png',
          calories: 180,
          protein: 4,
          carbs: 41,
          fat: 0.3,
          type: 'carbs'
        }
      ],
      side: [
        {
          id: 12,
          title: 'Steamed Broccoli',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/broccoli-300x300_ghi789.png',
          calories: 55,
          protein: 6,
          carbs: 11,
          fat: 0.6,
          type: 'side'
        }
      ],
      sauce: [
        {
          id: 16,
          title: 'Teriyaki Sauce',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/teriyaki-300x300_jkl012.png',
          calories: 60,
          protein: 1,
          carbs: 14,
          fat: 0,
          type: 'sauce'
        }
      ]
    },
    customer: {
      id: 1,
      name: 'Nguyen Van A',
      email: '0Vn0u@example.com'
    },
    quantity: 2,
    totalPrice: 1300
  },
  // Menu item khác
  {
    id: 4,
    isCustom: false,
    type: 'menu',
    mealItem: {
      menu: [
        {
          id: 21,
          title: 'Asian Fusion Buddha Bowl',
          image: 'https://res.cloudinary.com/quyendev/image/upload/v1751107724/buddha-bowl-asian_mnb345.jpg',
          calories: 380,
          protein: 18,
          carbs: 45,
          fat: 16,
          type: 'menu',
          description: 'Tofu, edamame, brown rice, carrots, cucumber with sesame ginger dressing'
        }
      ]
    },
    customer: {
      id: 3,
      name: 'Le Van C',
      email: 'lec@example.com'
    },
    quantity: 3,
    totalPrice: 1100
  }
]

export const weekMenus = {
  low: {
    start: '25.08',
    end: '29.08',
    days: [
      {
        day: 'T2',
        date: '25.08',
        meal1: { title: 'ỨC GÀ ÁP CHẢO + RAU CỦ', desc: 'Grilled chicken breast + vegetables' },
        meal2: { title: 'CÁ HỒI HẤP + BÔNG CẢI', desc: 'Steamed salmon + broccoli' }
      },
      {
        day: 'T3',
        date: '26.08',
        meal1: { title: 'THỊT BÒ XÀO MĂNG TÂY', desc: 'Beef stir-fried with asparagus' },
        meal2: { title: 'CANH BÍ ĐỎ + ĐẬU PHỤ', desc: 'Pumpkin soup + tofu' }
      },
      {
        day: 'T4',
        date: '27.08',
        meal1: { title: 'CÁ THU NƯỚNG + RAU LUỘC', desc: 'Grilled mackerel + boiled veggies' },
        meal2: { title: 'ỨC GÀ LÁ CHANH + SALAD', desc: 'Chicken breast with lime leaves + salad' }
      },
      {
        day: 'T5',
        date: '28.08',
        meal1: { title: 'THỊT HEO LUỘC + CẢI THÌA', desc: 'Boiled pork + bok choy' },
        meal2: { title: 'CÁ NGỪ ÁP CHẢO + RAU CỦ', desc: 'Seared tuna + vegetables' }
      },
      {
        day: 'T6',
        date: '29.08',
        meal1: { title: 'TRỨNG HẤP + RAU CỦ', desc: 'Steamed egg + vegetables' },
        meal2: { title: 'THỊT GÀ XÉ + SALAD', desc: 'Shredded chicken + salad' }
      }
    ]
  },
  balance: {
    start: '25.08',
    end: '29.08',
    days: [
      {
        day: 'T2',
        date: '25.08',
        meal1: { title: 'CƠM GÀ XỐI MỠ', desc: 'Fried chicken rice' },
        meal2: { title: 'THỊT KHO TRỨNG + RAU', desc: 'Braised pork with egg + veggies' }
      },
      {
        day: 'T3',
        date: '26.08',
        meal1: { title: 'CÁ KHO TỘ + CẢI NGỌT', desc: 'Braised fish + choy sum' },
        meal2: { title: 'THỊT BÒ XÀO BÔNG CẢI', desc: 'Beef stir-fried with broccoli' }
      },
      {
        day: 'T4',
        date: '27.08',
        meal1: { title: 'GÀ NƯỚNG MẬT ONG', desc: 'Honey grilled chicken' },
        meal2: { title: 'CANH CHUA CÁ + RAU', desc: 'Sour fish soup + veggies' }
      },
      {
        day: 'T5',
        date: '28.08',
        meal1: { title: 'CƠM SƯỜN NƯỚNG', desc: 'Grilled pork rib rice' },
        meal2: { title: 'TÔM XÀO RAU CỦ', desc: 'Shrimp stir-fried with vegetables' }
      },
      {
        day: 'T6',
        date: '29.08',
        meal1: { title: 'BÒ LÚC LẮC + KHOAI TÂY', desc: 'Shaking beef + potatoes' },
        meal2: { title: 'CANH RAU NGÓT THỊT BẰM', desc: 'Malabar spinach soup with minced pork' }
      }
    ]
  },
  high: {
    start: '25.08',
    end: '29.08',
    days: [
      {
        day: 'T2',
        date: '25.08',
        meal1: { title: 'CƠM TẤM SƯỜN BÌ CHẢ', desc: 'Broken rice with pork chop, shredded pork, egg cake' },
        meal2: { title: 'BÒ KHO + BÁNH MÌ', desc: 'Beef stew + bread' }
      },
      {
        day: 'T3',
        date: '26.08',
        meal1: { title: 'MÌ Ý BÒ BẰM', desc: 'Spaghetti with minced beef' },
        meal2: { title: 'GÀ CHIÊN GIÒN + KHOAI TÂY', desc: 'Fried chicken + fries' }
      },
      {
        day: 'T4',
        date: '27.08',
        meal1: { title: 'CƠM CHIÊN DƯƠNG CHÂU', desc: 'Yangzhou fried rice' },
        meal2: { title: 'THỊT KHO TÀU + TRỨNG', desc: 'Caramelized pork and eggs' }
      },
      {
        day: 'T5',
        date: '28.08',
        meal1: { title: 'BÚN BÒ HUẾ', desc: 'Hue beef noodle soup' },
        meal2: { title: 'CƠM GÀ HẢI NAM', desc: 'Hainanese chicken rice' }
      },
      {
        day: 'T6',
        date: '29.08',
        meal1: { title: 'PHỞ BÒ', desc: 'Beef noodle soup' },
        meal2: { title: 'CƠM SƯỜN NƯỚNG', desc: 'Grilled pork rib rice' }
      }
    ]
  },
  vegetarian: {
    start: '25.08',
    end: '29.08',
    days: [
      {
        day: 'T2',
        date: '25.08',
        meal1: { title: 'BÚN CHẢ CHAY + RAU CỦ', desc: 'Vegetarian noodles + vegetables' },
        meal2: { title: 'ĐÙI GÀ NƯỚNG MẬT ONG + BÚN RAU CỦ', desc: 'Vegetarian roasted chicken w veggie noodles' }
      },
      {
        day: 'T3',
        date: '26.08',
        meal1: { title: 'HEO NẤU CAM GẠO LỨC', desc: 'Vegetarian Pork With Oranges + Brown Rice' },
        meal2: { title: 'MÌ Ý CHAY SỐT RƯỢU VANG', desc: 'Vegetarian spaghetti with wine sauce' }
      },
      {
        day: 'T4',
        date: '27.08',
        meal1: { title: 'CƠM CHIÊN DƯA GÀ CHAY', desc: 'Vegetarian chicken fried rice with pickles' },
        meal2: { title: 'BÁNH MÌ CHẢ CHAY', desc: 'Vegetarian Vietnamese sandwich' }
      },
      {
        day: 'T5',
        date: '28.08',
        meal1: { title: 'PHỞ CHAY', desc: 'Vegetarian pho noodles' },
        meal2: { title: 'CƠM TẤM CHAY', desc: 'Vegetarian broken rice' }
      },
      {
        day: 'T6',
        date: '29.08',
        meal1: { title: 'BÁNH CUỐN CHAY', desc: 'Vegetarian steamed rice rolls' },
        meal2: { title: 'BÚN RIÊU CHAY', desc: 'Vegetarian crab noodle soup' }
      }
    ]
  }
}


