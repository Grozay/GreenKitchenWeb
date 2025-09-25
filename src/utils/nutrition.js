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

  // 3. Check if the meal is already balanced within the threshold
  const isBalanced =
    Math.abs(needs.protein) < BALANCE_THRESHOLD &&
    Math.abs(needs.carbs) < BALANCE_THRESHOLD &&
    Math.abs(needs.fat) < BALANCE_THRESHOLD

  if (isBalanced && customTotal.calories > 0) {
    return [] // Meal is balanced, no suggestions needed
  }

  // 4. Flatten all available items and filter out items already selected
  const selectedIds = new Set(Object.values(selectedItems).flat().map((item) => item.id))
  const availableItems = Object.values(allItems)
    .flat()
    .filter((item) => !selectedIds.has(item.id))

  // 5. Determine priority based on what's missing most
  const priorities = {
    protein: Math.abs(needs.protein) > BALANCE_THRESHOLD * 2 ? 3 : (Math.abs(needs.protein) > BALANCE_THRESHOLD ? 2 : 1),
    carbs: Math.abs(needs.carbs) > BALANCE_THRESHOLD * 2 ? 3 : (Math.abs(needs.carbs) > BALANCE_THRESHOLD ? 2 : 1),
    fat: Math.abs(needs.fat) > BALANCE_THRESHOLD * 2 ? 3 : (Math.abs(needs.fat) > BALANCE_THRESHOLD ? 2 : 1)
  }

  // 6. Score each available item based on multiple factors
  const scoredItems = availableItems.map((item) => {
    if (item.calories === 0) return { ...item, score: -Infinity }

    // Basic balance impact
    const balanceImpact =
      item.protein * CALORIES_PER_GRAM.protein * needs.protein +
      item.carbs * CALORIES_PER_GRAM.carbs * needs.carbs +
      item.fat * CALORIES_PER_GRAM.fat * needs.fat

    // Determine item type based on nutritional profile
    let itemType = 'side' // default
    const totalMacro = item.protein + item.carbs + item.fat

    if (item.protein > totalMacro * 0.4) itemType = 'protein'
    else if (item.carbs > totalMacro * 0.4) itemType = 'carbs'
    else if (item.fat > totalMacro * 0.3) itemType = 'fat'

    // Priority bonus based on what's needed most
    let priorityBonus = 0
    if (itemType === 'protein' && needs.protein > BALANCE_THRESHOLD) priorityBonus = priorities.protein * 0.3
    else if (itemType === 'carbs' && needs.carbs > BALANCE_THRESHOLD) priorityBonus = priorities.carbs * 0.3
    else if (itemType === 'fat' && needs.fat > BALANCE_THRESHOLD) priorityBonus = priorities.fat * 0.3

    // Size appropriateness - prefer items that add reasonable amount of calories (50-200 kcal)
    const sizeScore = item.calories >= 50 && item.calories <= 200 ? 0.2 :
      item.calories >= 25 && item.calories <= 300 ? 0.1 : 0

    // Diversity bonus - slightly prefer items that add variety
    const hasProtein = selectedItems.protein?.length > 0
    const hasCarbs = selectedItems.carbs?.length > 0
    const hasSides = selectedItems.side?.length > 0

    let diversityBonus = 0
    if (itemType === 'protein' && !hasProtein) diversityBonus = 0.1
    else if (itemType === 'carbs' && !hasCarbs) diversityBonus = 0.1
    else if (itemType === 'side' && !hasSides) diversityBonus = 0.05

    // Efficiency score (balance impact per calorie)
    const efficiencyScore = balanceImpact / item.calories

    // Total score combines all factors
    const totalScore = efficiencyScore + priorityBonus + sizeScore + diversityBonus

    return {
      ...item,
      score: totalScore,
      itemType,
      debugInfo: {
        efficiencyScore: efficiencyScore.toFixed(3),
        priorityBonus: priorityBonus.toFixed(3),
        sizeScore: sizeScore.toFixed(3),
        diversityBonus: diversityBonus.toFixed(3)
      }
    }
  })

  // 7. Sort by score in descending order and return the top 4 suggestions
  const topSuggestions = scoredItems
    .filter(item => item.score !== -Infinity)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)

  // 8. Ensure variety by preferring different types if possible
  if (topSuggestions.length >= 2) {
    const types = topSuggestions.map(item => item.itemType)
    const uniqueTypes = [...new Set(types)]
    if (uniqueTypes.length >= 2) {
      // Good variety, keep as is
    } else {
      // Try to find alternative suggestions for variety
      const alternativeSuggestions = scoredItems
        .filter(item => !topSuggestions.some(s => s.id === item.id))
        .filter(item => item.score > -0.1) // Still somewhat useful
        .sort((a, b) => b.score - a.score)
        .slice(0, 2)

      // Replace some items to ensure variety
      if (alternativeSuggestions.length > 0) {
        const typeCount = {}
        topSuggestions.forEach(item => {
          typeCount[item.itemType] = (typeCount[item.itemType] || 0) + 1
        })

        // If we have 3+ items of same type, replace one with different type
        const maxType = Object.keys(typeCount).reduce((a, b) =>
          typeCount[a] > typeCount[b] ? a : b
        )

        if (typeCount[maxType] >= 3) {
          const alternativeOfDifferentType = alternativeSuggestions.find(item =>
            item.itemType !== maxType && item.score > 0
          )
          if (alternativeOfDifferentType) {
            // Replace the lowest scoring item of the dominant type
            const toReplaceIndex = topSuggestions.findIndex(item =>
              item.itemType === maxType && item.score === Math.min(
                ...topSuggestions.filter(i => i.itemType === maxType).map(i => i.score)
              )
            )
            if (toReplaceIndex !== -1) {
              topSuggestions[toReplaceIndex] = alternativeOfDifferentType
            }
          }
        }
      }
    }
  }

  return topSuggestions
}

export const getNutritionalAdvice = (customTotal) => {
  if (customTotal.calories === 0) {
    return 'Start building your meal!'
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
  if (needs.protein > BALANCE_THRESHOLD) deficient.push('protein')
  if (needs.carbs > BALANCE_THRESHOLD) deficient.push('carbs')
  if (needs.fat > BALANCE_THRESHOLD) deficient.push('fat')

  const surplus = []
  if (needs.protein < -BALANCE_THRESHOLD) surplus.push('protein')
  if (needs.carbs < -BALANCE_THRESHOLD) surplus.push('carbs')
  if (needs.fat < -BALANCE_THRESHOLD) surplus.push('fat')

  // 4. Construct the advice message
  if (deficient.length === 0 && surplus.length > 0) {
    return `Your meal has too much ${surplus.join(' and ')}. Consider reducing some.`
  }

  if (deficient.length > 0) {
    let advice = `To balance better, your meal needs more ${deficient.join(' and ')}`
    if (surplus.length > 0) {
      advice += `, while reducing ${surplus.join(' and ')}`
    }
    advice += '.'
    return advice
  }

  return 'Keep selecting to balance your meal.'
}

// Function to explain suggestion logic
export const getSuggestionExplanation = (suggestedMeals, customTotal) => {
  if (suggestedMeals.length === 0) {
    return 'Your meal is perfectly balanced! No suggestions needed.'
  }

  let explanation = '🤖 **How I suggest meals:**\n\n'

  // Calculate current ratios
  const currentRatios = {
    protein: (customTotal.protein * CALORIES_PER_GRAM.protein) / customTotal.calories,
    carbs: (customTotal.carbs * CALORIES_PER_GRAM.carbs) / customTotal.calories,
    fat: (customTotal.fat * CALORIES_PER_GRAM.fat) / customTotal.calories
  }

  // Determine nutritional needs
  const needs = {
    protein: IDEAL_RATIOS.protein - currentRatios.protein,
    carbs: IDEAL_RATIOS.carbs - currentRatios.carbs,
    fat: IDEAL_RATIOS.fat - currentRatios.fat
  }

  explanation += '📊 **Current meal analysis:**\n'
  explanation += `• Nutritional ratios: ${Math.round(currentRatios.protein * 100)}% Protein, ${Math.round(currentRatios.carbs * 100)}% Carbs, ${Math.round(currentRatios.fat * 100)}% Fat\n`
  explanation += `• Ideal targets: ${Math.round(IDEAL_RATIOS.protein * 100)}% Protein, ${Math.round(IDEAL_RATIOS.carbs * 100)}% Carbs, ${Math.round(IDEAL_RATIOS.fat * 100)}% Fat\n\n`

  // Identify main issues
  const issues = []
  if (Math.abs(needs.protein) > BALANCE_THRESHOLD) {
    const status = needs.protein > 0 ? 'low' : 'high'
    issues.push(`${status} protein`)
  }
  if (Math.abs(needs.carbs) > BALANCE_THRESHOLD) {
    const status = needs.carbs > 0 ? 'low' : 'high'
    issues.push(`${status} carbs`)
  }
  if (Math.abs(needs.fat) > BALANCE_THRESHOLD) {
    const status = needs.fat > 0 ? 'low' : 'high'
    issues.push(`${status} fat`)
  }

  if (issues.length > 0) {
    explanation += '🎯 **Issues to address:**\n'
    explanation += `• Your meal has ${issues.join(', ')}\n\n`
  }

  explanation += '🧠 **Smart suggestion criteria:**\n'
  explanation += '• Prioritize foods that best balance nutrition\n'
  explanation += '• Choose appropriate portion sizes (50-200 calories)\n'
  explanation += '• Encourage food variety\n'
  explanation += '• Avoid repeating selected items\n\n'

  explanation += '🍽️ **Suggested items:**\n'
  suggestedMeals.forEach((meal, index) => {
    const itemType = meal.itemType === 'protein' ? '🥩 Protein' :
      meal.itemType === 'carbs' ? '🍚 Carbs' :
        meal.itemType === 'fat' ? '🧈 Fat' : '🥗 Veggies'

    explanation += `${index + 1}. **${meal.title}** (${itemType})\n`
    explanation += `   • ${Math.round(meal.calories)} kcal | ${Math.round(meal.protein)}g Protein | ${Math.round(meal.carbs)}g Carbs | ${Math.round(meal.fat)}g Fat\n`
  })

  return explanation
}

// Smart sauce recommendation system based on nutritional analysis
// No more hard-coded mappings - uses real nutritional data instead


// Get suggested sauces for a single protein based on nutritional analysis
export const getSuggestedSauces = (protein, allSauces) => {
  if (!protein || !allSauces) return []

  // Tính toán profile dinh dưỡng của protein
  const proteinCalories = protein.calories || 0
  const proteinMacros = {
    protein: proteinCalories > 0 ? (protein.protein || 0) * 4 / proteinCalories : 0, // % calo từ protein
    carbs: proteinCalories > 0 ? (protein.carbs || 0) * 4 / proteinCalories : 0, // % calo từ carbs
    fat: proteinCalories > 0 ? (protein.fat || 0) * 9 / proteinCalories : 0 // % calo từ fat
  }

  // Xác định "nhu cầu" của protein này
  const needs = {
    // Nếu protein ít calo (< 200), cần sốt bổ sung calo
    calories: proteinCalories < 200 ? 'more' : 'less',

    // Nếu protein ít chất béo (< 30% calo), cần sốt bổ sung chất béo
    fat: proteinMacros.fat < 0.3 ? 'more_fat' : 'less_fat',

    // Nếu protein ít carbs (< 20% calo), cần sốt bổ sung carbs
    carbs: proteinMacros.carbs < 0.2 ? 'more_carbs' : 'less_carbs',

    // Nếu protein ít protein (< 50% calo), cần sốt bổ sung protein
    protein: proteinMacros.protein < 0.5 ? 'more_protein' : 'less_protein'
  }

  // Score từng sốt dựa trên việc đáp ứng nhu cầu
  const scoredSauces = allSauces.map(sauce => {
    const sauceCalories = sauce.calories || 0
    if (sauceCalories === 0) return { ...sauce, score: -Infinity }

    const sauceMacros = {
      protein: (sauce.protein || 0) * 4 / sauceCalories,
      carbs: (sauce.carbs || 0) * 4 / sauceCalories,
      fat: (sauce.fat || 0) * 9 / sauceCalories
    }

    let score = 0

    // Điểm cho calo
    if (needs.calories === 'more' && sauceCalories >= 50) score += 0.3
    else if (needs.calories === 'less' && sauceCalories <= 30) score += 0.2

    // Điểm cho chất béo
    if (needs.fat === 'more_fat' && sauceMacros.fat > 0.4) score += 0.4
    else if (needs.fat === 'less_fat' && sauceMacros.fat < 0.2) score += 0.2

    // Điểm cho carbs
    if (needs.carbs === 'more_carbs' && sauceMacros.carbs > 0.5) score += 0.3
    else if (needs.carbs === 'less_carbs' && sauceMacros.carbs < 0.3) score += 0.2

    // Điểm cho protein
    if (needs.protein === 'more_protein' && sauceMacros.protein > 0.3) score += 0.3
    else if (needs.protein === 'less_protein' && sauceMacros.protein < 0.2) score += 0.2

    // Ưu tiên sốt vừa phải (30-80 calo)
    if (sauceCalories >= 30 && sauceCalories <= 80) score += 0.2

    return {
      ...sauce,
      score,
      debugInfo: {
        needs,
        sauceMacros: {
          protein: Math.round(sauceMacros.protein * 100) + '%',
          carbs: Math.round(sauceMacros.carbs * 100) + '%',
          fat: Math.round(sauceMacros.fat * 100) + '%'
        }
      }
    }
  })

  // Sắp xếp theo điểm và trả về top 3
  return scoredSauces
    .filter(sauce => sauce.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

// Get suggested sauces for multiple proteins - combines suggestions from all proteins
export const getSuggestedSaucesForMeal = (selectedProteins, allSauces) => {
  if (!selectedProteins || !allSauces || selectedProteins.length === 0) return []

  // Mỗi protein gợi ý sốt riêng dựa trên nhu cầu dinh dưỡng
  const allSuggestions = []
  selectedProteins.forEach(protein => {
    const proteinSuggestions = getSuggestedSauces(protein, allSauces)
    allSuggestions.push(...proteinSuggestions)
  })

  // Loại bỏ trùng lặp và sắp xếp theo điểm cao nhất
  const uniqueSuggestions = allSuggestions
      .filter((sauce, index, arr) =>
        arr.findIndex(s => s.id === sauce.id) === index
      )
      .sort((a, b) => b.score - a.score)

  // Giới hạn 4 gợi ý tốt nhất
  return uniqueSuggestions.slice(0, 4)
}