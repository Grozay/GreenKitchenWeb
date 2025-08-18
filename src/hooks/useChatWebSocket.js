import {
  useEffect,
  useRef
} from 'react'
import SockJS from 'sockjs-client'
import {
  Client
} from '@stomp/stompjs'
import {
  API_ROOT
} from '~/utils/constants'

export function useChatWebSocket(topic, onMessage) {
  const clientRef = useRef(null)

  useEffect(() => {
    if (!topic) return

    const sock = new SockJS(`${API_ROOT}/apis/v1/ws`)
    const client = new Client({
      webSocketFactory: () => sock,
      onConnect: () => {
        (Array.isArray(topic) ? topic : [topic]).forEach((t) => {
          client.subscribe(t, (msg) => {
            const data = JSON.parse(msg.body)
            onMessage(data)
          })
        })
      },
      onStompError: (frame) => {
      },
      onWebSocketError: (event) => {
      },
      onDisconnect: (frame) => {
      },
      debug: (str) => {

            onMessage(data)
          })
        })
      }
    })

    client.activate()
    clientRef.current = client

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
      }
    }
  }, [topic, onMessage])
}