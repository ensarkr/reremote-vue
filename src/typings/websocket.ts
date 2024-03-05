import type { customButtonT } from "./button"

type connectionStatusT = "error" | "loading" | "connected" | "closed"
type resolverItemT = {
  con_id: string
  resolver: (value: allResponsesT | PromiseLike<allResponsesT>) => void
}

type portsT = {
  ip: "loading" | string
  frontend: "loading" | number
  settings: "loading" | number
  actions: "loading" | number
}

type requestWithConIDT = { con_id: string } & requestT

type requestT =
  | { name: "get_logs" }
  | { name: "run_app"; app_path: string }
  | { name: "run_command"; cli: "cmd" | "powershell"; command: string }
  | { name: "add_custom_button"; custom_button_data: customButtonT }
  | { name: "get_custom_buttons" }
  | { name: "remove_custom_button"; custom_button_id: string }
  | { name: "get_ports" }

type updateT = {
  type: "update"
  custom_buttons?: customButtonT[]
  log?: string
  ports?: portsT
}

type responseT<T> = { type: "response"; con_id: string } & (
  | { status: false; error_message: string }
  | ({ status: true } & { value: T })
)

type allResponsesT = responseT<{
  logs?: string[]
  custom_buttons?: customButtonT[]
  ports?: portsT
  cli_response?: string
}>

export type {
  requestT,
  responseT,
  allResponsesT,
  updateT,
  portsT,
  requestWithConIDT,
  connectionStatusT,
  resolverItemT
}
