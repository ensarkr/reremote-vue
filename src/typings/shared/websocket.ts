import type { allResponsesT } from "../websocket"

type connectionStatusT = "error" | "loading" | "connected" | "closed"
type resolverItemT = {
  con_id: string
  resolver: (value: allResponsesT | PromiseLike<allResponsesT>) => void
}

export type { connectionStatusT, resolverItemT }
