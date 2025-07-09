export const calcCustomTotal = (selected) => {
  let total = { calories: 0, protein: 0, carbs: 0, fat: 0 }
  Object.keys(selected).forEach(type => {
    selected[type].forEach(item => {
      total.calories += (item.calories || 0) * (item.quantity || 1)
      total.protein += (item.protein || 0) * (item.quantity || 1)
      total.carbs += (item.carbs || 0) * (item.quantity || 1)
      total.fat += (item.fat || 0) * (item.quantity || 1)
    })
  })
  return total
}

// Recommended macronutrient distribution for a balanced meal (as a percentage of total calories)
const IDEAL_RATIOS = {
  protein: 0.3,
  carbs: 0.45,
  fat: 0.25
}

// Caloric values per gram for each macronutrient
const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9
}

const BALANCE_THRESHOLD = 0.05 // 5% tolerance for each macronutrient ratio

export const getSuggestedMeals = (customTotal, allItems, selectedItems) => {
  // Return empty if the meal is empty
  if (customTotal.calories === 0) {
    return []
  }

  // 1. Calculate the current meal's macronutrient ratios
  const currentRatios = {
    protein: (customTotal.protein * CALORIES_PER_GRAM.protein) / customTotal.calories,
    carbs: (customTotal.carbs * CALORIES_PER_GRAM.carbs) / customTotal.calories,
    fat: (customTotal.fat * CALORIES_PER_GRAM.fat) / customTotal.calories
  }

  // 2. Determine the nutritional "need" by comparing current ratios to ideal ratios
  const needs = {
    protein: IDEAL_RATIOS.protein - currentRatios.protein,
    carbs: IDEAL_RATIOS.carbs - currentRatios.carbs,
    fat: IDEAL_RATIOS.fat - currentRatios.fat
  }

  // NEW: Check if the meal is already balanced within the threshold
  const isBalanced =
    Math.abs(needs.protein) < BALANCE_THRESHOLD &&
    Math.abs(needs.carbs) < BALANCE_THRESHOLD &&
    Math.abs(needs.fat) < BALANCE_THRESHOLD

  if (isBalanced && customTotal.calories > 0) {
    return [] // Meal is balanced, no suggestions needed
  }

  // 3. Flatten all available items and filter out items already selected
  const selectedIds = new Set(Object.values(selectedItems).flat().map((item) => item.id))
  const availableItems = Object.values(allItems)
    .flat()
    .filter((item) => !selectedIds.has(item.id))

  // 4. Score each available item based on how well it helps balance the meal
  const scoredItems = availableItems.map((item) => {
    if (item.calories === 0) return { ...item, score: -Infinity }

    const balanceImpact =
      item.protein * CALORIES_PER_GRAM.protein * needs.protein +
      item.carbs * CALORIES_PER_GRAM.carbs * needs.carbs +
      item.fat * CALORIES_PER_GRAM.fat * needs.fat

    // The score is the balance impact per calorie, to find the most "efficient" items.
    const score = balanceImpact / item.calories

    return { ...item, score }
  })

  // 5. Sort by score in descending order and return the top 4 suggestions
  return scoredItems.sort((a, b) => b.score - a.score).slice(0, 4)
}

export const getNutritionalAdvice = (customTotal) => {
  if (customTotal.calories === 0) {
    return 'Hãy bắt đầu xây dựng bữa ăn của bạn!'
  }

  // 1. Calculate ratios and needs
  const currentRatios = {
    protein: (customTotal.protein * CALORIES_PER_GRAM.protein) / customTotal.calories,
    carbs: (customTotal.carbs * CALORIES_PER_GRAM.carbs) / customTotal.calories,
    fat: (customTotal.fat * CALORIES_PER_GRAM.fat) / customTotal.calories
  }

  const needs = {
    protein: IDEAL_RATIOS.protein - currentRatios.protein,
    carbs: IDEAL_RATIOS.carbs - currentRatios.carbs,
    fat: IDEAL_RATIOS.fat - currentRatios.fat
  }

  // 2. Check if balanced
  const isBalanced =
    Math.abs(needs.protein) < BALANCE_THRESHOLD &&
    Math.abs(needs.carbs) < BALANCE_THRESHOLD &&
    Math.abs(needs.fat) < BALANCE_THRESHOLD

  if (isBalanced) {
    return '' // Return empty if balanced, so we can hide the message
  }

  // 3. Identify deficient and surplus nutrients
  const deficient = []
  if (needs.protein > BALANCE_THRESHOLD) deficient.push('Đạm')
  if (needs.carbs > BALANCE_THRESHOLD) deficient.push('Tinh bột')
  if (needs.fat > BALANCE_THRESHOLD) deficient.push('Chất béo')

  const surplus = []
  if (needs.protein < -BALANCE_THRESHOLD) surplus.push('Đạm')
  if (needs.carbs < -BALANCE_THRESHOLD) surplus.push('Tinh bột')
  if (needs.fat < -BALANCE_THRESHOLD) surplus.push('Chất béo')

  // 4. Construct the advice message
  if (deficient.length === 0 && surplus.length > 0) {
    return `Bữa ăn của bạn đang hơi nhiều ${surplus.join(' và ')}. Hãy cân nhắc giảm bớt nhé.`
  }

  if (deficient.length > 0) {
    let advice = `Để cân bằng hơn, bữa ăn của bạn cần thêm ${deficient.join(' và ')}`
    if (surplus.length > 0) {
      advice += `, đồng thời giảm bớt ${surplus.join(' và ')}`
    }
    advice += '.'
    return advice
  }

  return 'Hãy tiếp tục lựa chọn để cân bằng bữa ăn nhé.'
}