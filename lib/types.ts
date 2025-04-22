export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  agent?: string
  hasImage?: boolean
  imagePreview?: string
}

export interface Session {
  id: string
  title: string
  createdAt: Date
  messages: ChatMessage[]
  agentType: "property-detective" | "tenancy-advisor" | null
}
