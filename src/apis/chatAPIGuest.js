import axios from 'axios'
import {
  API_ROOT
} from '~/utils/constants'

const CHAT_URL = `${API_ROOT}/apis/v1/chat`

export async function initGuestConversation() {
  try {
    const { data } = await axios.post(`${CHAT_URL}/init-guest`)
    if (!data) throw new Error('initGuestConversation: No conversationId')
    return data
  } catch (error) {
    console.error('initGuestConversation error:', error)
    throw error
  }
}

/**
 * Lấy tin nhắn theo conversationId, có hỗ trợ phân trang
 */
export async function fetchAllMessages (conversationId, limit, before) {
  try {
    const params = {
      conversationId
    }
    if (limit) params.limit = limit
    if (before) params.before = before
    const {
      data
    } = await axios.get(`${CHAT_URL}/messages`, {
      params
    })
    return data
  } catch (error) {
    console.error('fetchAllMessages error:', error)
    throw error
  }
}

/**
 * Gửi tin nhắn (cho AI hoặc EMP)
 * @param {Object} args
 * @param {number|string} args.conversationId
 * @param {'CUSTOMER'|'EMP'} args.senderRole
 * @param {string} args.content
 * @param {string} [args.lang]
 * @param {string} [args.idempotencyKey]
 * @param {number} [args.customerId]
 * @param {number} [args.employeeId]
 *  * Lấy phân trang tin nhắn (mặc định page=0, size=20)
 * @param {number} conversationId
 * @param {number} page - trang, mặc định 0 (tin mới nhất)
 * @param {number} size - số tin nhắn/trang, mặc định 20
 */
export async function sendMessage({
  conversationId,
  senderRole,
  content,
  lang,
  idempotencyKey,
  customerId,
  employeeId
}) {
  try {
    const url = new URL(`${CHAT_URL}/send`)
    if (senderRole === 'CUSTOMER' && customerId) url.searchParams.append('customerId', customerId)
    if (senderRole === 'EMP' && employeeId) url.searchParams.append('employeeId', employeeId)
    const body = {
      conversationId,
      senderRole,
      content,
      lang,
      idempotencyKey: idempotencyKey || `${Date.now()}-${Math.random()}`
    }
    const {
      data
    } = await axios.post(url.toString(), body)
    return data
  } catch (error) {
    console.error('sendMessage error:', error)
    throw error
  }
}

/**
 * Lấy danh sách conversation của nhân viên hiện tại (nếu là EMP)
 */
// Removed duplicate function declaration for fetchEmployeeConversations

/**
 * Lấy trạng thái conversation (AI hoặc EMP)
 */
export async function fetchConversationStatus(conversationId) {
  try {
    const {
      data
    } = await axios.get(
      `${CHAT_URL}/status`, {
        params: {
          conversationId
        }
      }
    )
    return data // "AI" | "EMP" | "WAITING_EMP"
  } catch (error) {
    console.error('fetchConversationStatus error:', error)
    throw error
  }
}
// Lấy tất cả conversation cho nhân viên
export async function fetchEmployeeConversations() {
  // GET /apis/v1/chat/employee/conversations
  try {
    const {
      data
    } = await axios.get(`${CHAT_URL}/employee/conversations`)
    return data
  } catch (error) {
    console.error('fetchEmployeeConversations error:', error)
    throw error
  }
}

export const chatApis = {
  // Common
  getMessagesPaged: async (conversationId, page = 0, size = 20) => {
    try {
      const response = await axios.get(
        `${CHAT_URL}/chat/messages-paged?conversationId=${conversationId}&page=${page}&size=${size}`
      )
      return response.data // response là Page<ChatResponse>
    } catch (error) {
      console.error('getMessagesPaged error:', error)
      throw error
    }
  },

  // Customer chat
  sendCustomerMessage: async ({ conversationId, content, customerId, senderRole = 'CUSTOMER', lang = 'vi' }) => {
    try {
      const response = await axios.post(`${CHAT_URL}/send`, {
        conversationId,
        content,
        customerId,
        senderRole,
        lang
      })
      return response.data
    } catch (error) {
      console.error('sendCustomerMessage error:', error)
      throw error
    }
  }
}


// Lấy tin nhắn phân trang, tin mới nhất trước (page=0)
export async function fetchMessagesPaged(conversationId, page = 0, size = 20) {
  try {
    const { data } = await axios.get(
      `${CHAT_URL}/messages-paged`,
      { params: { conversationId, page, size } }
    )
    return data
  } catch (error) {
    console.error('fetchMessagesPaged error:', error)
    throw error
  }
}
