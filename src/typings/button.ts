type customButtonT = { custom_button_id: string; custom_button_name: string } & (
  | { custom_button_type: "run_app"; app_path: string }
  | { custom_button_type: "run_command"; cli: "cmd" | "powershell"; command: string }
)
export type { customButtonT }
