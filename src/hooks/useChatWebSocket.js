import {
  useEffect,
  useRef
} from 'react'
import SockJS from 'sockjs-client'
import {
  Client
} from '@stomp/stompjs'

export function useChatWebSocket(topic, onMessage) {
  const clientRef = useRef(null)

  useEffect(() => {
    if (!topic) return

    const sock = new SockJS('http://localhost:8080/apis/v1/ws')
    const client = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        (Array.isArray(topic) ? topic : [topic]).forEach((t) => {
          client.subscribe(t, (msg) => {
            const data = JSON.parse(msg.body)
            console.log('[WebSocket]', t, data)
            onMessage(data)
          })
        })
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP error:', frame)
      },
      onWebSocketError: (event) => {
        console.error('[WebSocket] Native WebSocket error:', event)
      },
      onDisconnect: (frame) => {
        console.warn('[WebSocket] Disconnected:', frame)
      },
      debug: (str) => {
        // Muốn debug tất cả, mở dòng này!
        console.debug('[WebSocket DEBUG]', str)
      }
    })

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        console.log('[WebSocket] Deactivate previous connection!')
        clientRef.current.deactivate()
        clientRef.current = null
      }
    }
  }, [topic, onMessage])
}
