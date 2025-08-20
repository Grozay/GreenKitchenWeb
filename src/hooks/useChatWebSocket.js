import { useEffect, useRef } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { API_ROOT } from '~/utils/constants'

export function useChatWebSocket(topic, onMessage) {
  const clientRef = useRef(null)
  const onMessageRef = useRef(onMessage)
  useEffect(() => { onMessageRef.current = onMessage }, [onMessage])

  useEffect(() => {
    if (!topic || (Array.isArray(topic) && topic.length === 0)) return

    const sock = new SockJS(`${API_ROOT}/apis/v1/ws`)
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
      onConnect: () => {
        const topics = Array.isArray(topic) ? topic : [topic]
        topics.forEach((t) => {
          client.subscribe(t, (msg) => {
            try {
              const data = JSON.parse(msg.body)
              onMessageRef.current && onMessageRef.current(data)
            } catch {
              // Silently ignore malformed messages
            }
          })
        })
      },
      onStompError: () => {},
      onWebSocketError: () => {},
      onDisconnect: () => {}
    })

    clientRef.current = client
    client.activate()

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
      }
    }
  }, [topic])
}

