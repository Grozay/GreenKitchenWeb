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
    title: 'FIT 3 Package',
    description: 'Lunch - Dinner Package. Weight loss',
    price: '650,000đ',
    image: 'https://storage.googleapis.com/a1aa/image/90d96b02-9e0e-4225-b651-42d553a5558f.jpg',
    alt: 'Fit3 Meal Package with shrimp and vegetables in black containers on red background',
    slug: 'fit-3-package'
  },
  {
    id: 'fit-3-package',
    title: 'FIT 3 Package',
    description: 'Lunch - Dinner Package. Weight loss',
    price: '650,000đ',
    image: 'https://storage.googleapis.com/a1aa/image/90d96b02-9e0e-4225-b651-42d553a5558f.jpg',
    alt: 'Fit3 Meal Package with shrimp and vegetables in black containers on red background',
    slug: 'fit-3-package'
  },
  {
    id: 'lunch-package',
    title: 'LUNCH Package',
    description: '1 lunch meal package. Delivered hot',
    price: '349,000đ',
    image: 'https://storage.googleapis.com/a1aa/image/c9e5d67d-de94-4423-2a25-3833ccbe8158.jpg',
    alt: 'Lunch Meal Package with broccoli and detox drink in white container on red background',
    slug: 'lunch-package'
  },
  {
    id: 'slim-package',
    title: 'SLIM Package (*NO STARCH)',
    description: 'Double vegetables, NO starch',
    price: '600,000đ',
    image: 'https://storage.googleapis.com/a1aa/image/7b07eae7-bee1-410e-9a2a-b8b6942699d0.jpg',
    alt: 'Slim Meal Package with double vegetables no starch in black containers on green background',
    slug: 'slim-package'
  },
  {
    id: 'full-package',
    title: 'FULL Package',
    description: '3 meals/day package. Healthy weight maintenance',
    price: '825,000đ',
    image: 'https://storage.googleapis.com/a1aa/image/3eefa773-af94-4cdd-4789-974b1d6d0970.jpg',
    alt: 'Full Meal Package with three black containers of vegetables and protein on red background',
    slug: 'full-package'
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
