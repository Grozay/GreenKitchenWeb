import { useEffect, useRef } from 'react'
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'
import { API_ROOT } from '~/utils/constants'

// FIX: Global connection pool để tránh duplicate connections
const connectionPool = new Map()
let globalConnectionId = 0

export function useChatWebSocket(topic, onMessage) {
  const clientRef = useRef(null)
  const onMessageRef = useRef(onMessage)
  const topicRef = useRef(topic)
  const isConnectingRef = useRef(false)
  const connectionIdRef = useRef(null)
  const isActiveRef = useRef(true)
  
  useEffect(() => { onMessageRef.current = onMessage }, [onMessage])
  useEffect(() => { topicRef.current = topic }, [topic])

  useEffect(() => {
    if (!topic || (Array.isArray(topic) && topic.length === 0)) {
      // Cleanup existing connection if no topic
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
        connectionIdRef.current = null
        isConnectingRef.current = false
      }
      return
    }

    // FIX: Check if connection already exists in pool
    const existingConnection = connectionPool.get(topic)
    if (existingConnection && existingConnection.client?.connected) {
      console.log('Reusing existing WebSocket connection for topic:', topic)
      clientRef.current = existingConnection.client
      connectionIdRef.current = existingConnection.id
      return
    }

    // FIX: Prevent duplicate connections
    if (isConnectingRef.current || clientRef.current?.connected) {
      console.log('WebSocket already connecting or connected, skipping:', topic)
      return
    }

    // FIX: Generate unique connection ID để track connections
    const connectionId = `ws-${++globalConnectionId}-${Date.now()}`
    connectionIdRef.current = connectionId
    
    console.log('Creating new WebSocket connection:', connectionId, 'for topic:', topic)
    isConnectingRef.current = true

    const sock = new SockJS(`${API_ROOT}/apis/v1/ws`)
    const client = new Client({
      webSocketFactory: () => sock,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      debug: () => {},
      onConnect: () => {
        console.log('WebSocket connected:', connectionId)
        isConnectingRef.current = false
        
        // FIX: Verify this is still the current connection
        if (connectionIdRef.current !== connectionId || !isActiveRef.current) {
          console.log('Connection outdated or inactive, disconnecting:', connectionId)
          client.deactivate()
          return
        }
        
        const topics = Array.isArray(topicRef.current) ? topicRef.current : [topicRef.current]
        topics.forEach((t) => {
          client.subscribe(t, (msg) => {
            try {
              // FIX: Verify connection is still valid before processing message
              if (connectionIdRef.current !== connectionId || !isActiveRef.current) {
                console.log('Skipping message from outdated connection:', connectionId)
                return
              }
              
              const data = JSON.parse(msg.body)
              onMessageRef.current && onMessageRef.current(data)
            } catch (error) {
              console.error('Error processing WebSocket message:', error)
            }
          })
        })
        
        // FIX: Add connection to pool
        connectionPool.set(topic, { client, id: connectionId })
      },
      onStompError: (error) => {
        console.error('STOMP error:', error)
        isConnectingRef.current = false
        connectionPool.delete(topic)
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error)
        isConnectingRef.current = false
        connectionPool.delete(topic)
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected:', connectionId)
        isConnectingRef.current = false
        connectionPool.delete(topic)
        
        // FIX: Only cleanup if this is the current connection
        if (connectionIdRef.current === connectionId) {
          connectionIdRef.current = null
        }
      }
    })

    clientRef.current = client
    client.activate()

    return () => {
      // FIX: Cleanup function với connection verification
      if (clientRef.current && connectionIdRef.current === connectionId) {
        console.log('Cleaning up WebSocket connection:', connectionId)
        clientRef.current.deactivate()
        clientRef.current = null
        connectionIdRef.current = null
        isConnectingRef.current = false
        connectionPool.delete(topic)
      }
    }
  }, [topic])
  
  // FIX: Cleanup khi component unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false
      if (clientRef.current) {
        clientRef.current.deactivate()
        clientRef.current = null
        connectionIdRef.current = null
        isConnectingRef.current = false
      }
    }
  }, [])
}

