/**
 * Utility functions for cleaning up chat-related data
 */

/**
 * Clear all chat-related data from localStorage
 * This should be called when user logs out
 */
export const clearChatData = () => {
  try {
    // Clear conversationId for guest users
    localStorage.removeItem('conversationId')
    
    // Clear any other chat-related localStorage items if they exist
    // Add more items here as needed
    const chatKeys = [
      'conversationId',
      'chatMessages',
      'chatStatus',
      'lastChatActivity'
    ]
    
    chatKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key)
      }
    })
    
    console.log('Chat data cleared from localStorage')
  } catch (error) {
    console.error('Error clearing chat data:', error)
  }
}

/**
 * Clear chat data and reset chat state
 * This is a more comprehensive cleanup that can be used in components
 */
export const resetChatState = () => {
  clearChatData()
  
  // Additional cleanup can be added here
  // For example, clearing any cached chat data in memory
  return true
}
