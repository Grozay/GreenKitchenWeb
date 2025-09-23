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

// Define sauce recommendations based on protein characteristics
const PROTEIN_TYPE_SAUCES = {
  // Lean proteins (high protein, low fat)
  'lean_meat': ['Teriyaki Sauce', 'Sriracha Mayo'], // chicken, turkey

  // Red meats (high protein, medium-high fat)
  'red_meat': ['Basil Pesto', 'Teriyaki Sauce'], // beef, lamb

  // Fatty fish (high protein, high fat - omega 3)
  'fatty_fish': ['Cilantro Lime Sauce'], // salmon, mackerel

  // White fish (high protein, low fat)
  'white_fish': ['Cilantro Lime Sauce'], // cod, tilapia, halibut

  // Shellfish (high protein, varies fat)
  'shellfish': ['Cilantro Lime Sauce', 'Sriracha Mayo'], // shrimp, crab, lobster

  // Pork (high protein, varies fat)
  'pork': ['Teriyaki Sauce', 'Basil Pesto'], // pork, bacon, ham

  // Plant-based (lower protein, varies fat)
  'plant_based': ['Sriracha Mayo', 'Cilantro Lime Sauce'] // tofu, tempeh, seitan
}

// Classification rules based on nutritional profile and name patterns
const classifyProteinType = (protein) => {
  const title = protein.title?.toLowerCase() || ''
  const proteinPer100g = protein.protein || 0
  const fatPer100g = protein.fat || 0

  // First, try name-based classification for specific cases
  if (title.includes('salmon') || title.includes('mackerel') || title.includes('sardine')) {
    return 'fatty_fish'
  }

  if (title.includes('shrimp') || title.includes('prawn') || title.includes('crab') || title.includes('lobster')) {
    return 'shellfish'
  }

  if (title.includes('tofu') || title.includes('tempeh') || title.includes('seitan') || title.includes('soy')) {
    return 'plant_based'
  }

  if (title.includes('chicken') || title.includes('turkey')) {
    return 'lean_meat'
  }

  if (title.includes('beef') || title.includes('lamb') || title.includes('veal')) {
    return 'red_meat'
  }

  if (title.includes('pork') || title.includes('bacon') || title.includes('ham') || title.includes('sausage')) {
    return 'pork'
  }

  if (title.includes('fish') || title.includes('cod') || title.includes('tilapia') || title.includes('halibut') ||
      title.includes('tuna') || title.includes('sea bass') || title.includes('mahi mahi')) {
    return 'white_fish'
  }

  // Fallback: Use nutritional profile for classification
  if (proteinPer100g >= 20) { // High protein
    if (fatPer100g >= 10) { // High fat
      return 'fatty_fish' // Likely fatty fish
    } else if (fatPer100g >= 5) { // Medium fat
      return 'red_meat' // Likely red meat
    } else { // Low fat
      return 'lean_meat' // Likely lean meat or white fish
    }
  } else if (proteinPer100g >= 10) { // Medium protein
    return 'pork' // Likely pork or processed meat
  } else { // Low protein
    return 'plant_based' // Likely plant-based
  }
}

// Get suggested sauces for a single protein
export const getSuggestedSauces = (protein, allSauces) => {
  if (!protein || !allSauces) return []

  // Automatically classify protein type based on name and nutritional profile
  const proteinType = classifyProteinType(protein)

  // Get recommended sauces for this protein type
  const suggestedSauceNames = PROTEIN_TYPE_SAUCES[proteinType] || []

  // Filter available sauces that match recommendations
  return allSauces.filter(sauce => suggestedSauceNames.includes(sauce.title))
}

// Get suggested sauces for multiple proteins - each protein gets its own suggestions
export const getSuggestedSaucesForMeal = (selectedProteins, allSauces) => {
  if (!selectedProteins || !allSauces || selectedProteins.length === 0) return []

  // Each protein gets suggestions based on its own characteristics
  const allSuggestions = []
  selectedProteins.forEach(protein => {
    const proteinSuggestions = getSuggestedSauces(protein, allSauces)
    allSuggestions.push(...proteinSuggestions)
  })

  // Remove duplicates (same sauce suggested for multiple proteins)
  const uniqueSuggestions = allSuggestions.filter((sauce, index, arr) =>
    arr.findIndex(s => s.id === sauce.id) === index
  )

  // Limit to top 4 suggestions
  return uniqueSuggestions.slice(0, 4)
}