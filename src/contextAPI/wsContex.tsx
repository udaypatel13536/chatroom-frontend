import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import { Backend_URL } from "../../config"

export interface WSEvent {
  type:    string
  group_id?: string
  message?: object;
  error? : string;
  
}

type RoomHandler = (event: WSEvent) => void
 
interface WSCtxValue {
  subscribe:   (roomId: string, cb: RoomHandler) => () => void
  send:        (payload: object) => void
  isConnected: boolean
}
 
const WSCtx = createContext<WSCtxValue>(null!)
export const useWS = () => useContext(WSCtx)
 
export function WSProvider({ token, children }: { token: string; children: ReactNode }) {
  const wsRef        = useRef<WebSocket | null>(null)
  const retryDelay   = useRef(1000)
  const shouldRetry  = useRef(true)
  const [isConnected, setIsConnected] = useState(false)
 
  // roomId → Set<handler> — the routing table
  const listeners = useRef<Map<string, Set<RoomHandler>>>(new Map())
 
  const connect = useCallback(() => {
    // ← No roomId in URL. Server loads all rooms for this user from DB.
    const ws = new WebSocket(`${Backend_URL}?token=${token}`)
    wsRef.current = ws
 
    ws.onopen = () => {
      setIsConnected(true)
    }
 
    ws.onmessage = ({ data }: MessageEvent<string>) => {
      try {
        const event = JSON.parse(data) 
        // Route by roomId — only the subscribed ChatPanel gets this event
        if (event.roomId) {
          listeners.current.get(event.roomId)?.forEach(cb => cb(event))
        }
        // Global events (no roomId) → '*' channel
        listeners.current.get('*')?.forEach(cb => cb(event))
      } catch { /* ignore malformed */ }
    }
 
    ws.onclose = () => {
      setIsConnected(false)
      if (!shouldRetry.current) return
      setTimeout(connect, retryDelay.current)
      retryDelay.current = Math.min(retryDelay.current * 2, 30_000)
    }
 
    ws.onerror = () => ws.close()
  }, [token])
 
  useEffect(() => {
    shouldRetry.current = true
    connect()
    return () => {
      shouldRetry.current = false
      wsRef.current?.close()
    }
  }, [connect])
 
  const subscribe = useCallback((roomId: string, cb: RoomHandler) => {
    if (!listeners.current.has(roomId)) listeners.current.set(roomId, new Set())
    listeners.current.get(roomId)!.add(cb)
    return () => listeners.current.get(roomId)?.delete(cb)
  }, [])
 
  const send = useCallback((payload: object) => {
    wsRef.current?.readyState === WebSocket.OPEN &&
      wsRef.current.send(JSON.stringify(payload))
  }, [])
 
  return (
    <WSCtx.Provider value={{ subscribe, send, isConnected }}>
      {children}
    </WSCtx.Provider>
  )
}