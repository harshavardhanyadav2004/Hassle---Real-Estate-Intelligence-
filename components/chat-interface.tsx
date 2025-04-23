"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, ImageIcon, X, Clock } from "lucide-react"
import ChatSession from "@/components/chat-session"
import type { ChatMessage, Session } from "@/lib/types"
import LoadingIndicator from "@/components/loading-indicator"

// Inside your message rendering logic

interface ChatInterfaceProps {
  sessions: Session[]
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>
  activeSessionId: string
  setActiveSessionId: React.Dispatch<React.SetStateAction<string>>
}

// Update your API_ENDPOINT to use the proxy route instead
const API_ENDPOINT = "/api/proxy"

export default function ChatInterface({
  sessions,
  setSessions,
  activeSessionId,
  setActiveSessionId,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [imageUpload, setImageUpload] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewingImage, setViewingImage] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState<string>("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [initialized, setInitialized] = useState(false)

  const activeSession = sessions.find((session) => session.id === activeSessionId)

  // Time updating function
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      setCurrentTime(timeString)
    }
    // Update time immediately
    updateTime()

    // Update time every second
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load sessions from localStorage on initial mount
  useEffect(() => {
    // This should only run on initial mount
    if (initialized) return

    const savedSessions = localStorage.getItem("chatSessions")
    const savedActiveSessionId = localStorage.getItem("activeSessionId")

    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)

        // Process the sessions to ensure all dates are proper Date objects
        const processedSessions = parsedSessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastUpdated: new Date(session.lastUpdated),
          messages: session.messages.map((message: any) => ({
            ...message,
            timestamp: new Date(message.timestamp),
          })),
        }))

        if (processedSessions.length > 0) {
          const mostRecentSession = processedSessions.reduce(
            (latest, session) => (new Date(session.lastUpdated) > new Date(latest.lastUpdated) ? session : latest),
            processedSessions[0],
          )
          setSessions(processedSessions)
          setActiveSessionId(mostRecentSession.id)
        }
      } catch (error) {
        console.error("Error loading sessions from localStorage:", error)
      }
    }

    setInitialized(true)
  }, [setSessions, setActiveSessionId, initialized])

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!initialized) return

    if (sessions.length > 0) {
      try {
        localStorage.setItem("chatSessions", JSON.stringify(sessions))
      } catch (error) {
        console.error("Error saving sessions to localStorage:", error)
      }
    }

    if (activeSessionId) {
      localStorage.setItem("activeSessionId", activeSessionId)
    }
  }, [sessions, activeSessionId, initialized])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current
      container.scrollTop = container.scrollHeight
    }
  }, [activeSession?.messages])

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setViewingImage(null)
      }
    }

    window.addEventListener("keydown", handleEscapeKey)
    return () => window.removeEventListener("keydown", handleEscapeKey)
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim() && !imageUpload) return
    setIsLoading(true)

    const messageTimestamp = new Date()

    const newMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: input,
      timestamp: messageTimestamp,
      hasImage: !!imageUpload,
      imagePreview: imageUpload ? URL.createObjectURL(imageUpload) : undefined,
    }

    // Update sessions with the new message
    const updatedSessions = sessions.map((session) =>
      session.id === activeSessionId
        ? {
          ...session,
          messages: [...session.messages, newMessage],
          title:
            session.title === "New Conversation"
              ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
              : session.title,
          lastUpdated: messageTimestamp,
        }
        : session,
    )

    setSessions(updatedSessions)

    // Save to localStorage immediately to prevent loss
    try {
      localStorage.setItem("chatSessions", JSON.stringify(updatedSessions))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }

    // Prepare data for the API request
    const formData = new FormData()
    formData.append("prompt", input) // Match parameter name from your FastAPI backend

    // If there's an image, add it to the request
    if (imageUpload) {
      formData.append("file", imageUpload) // Match parameter name from your FastAPI backend
    }

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }
      

      const data = await response.json()
      const responseMessage: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: data?.response || "Sorry, I couldn't process your request.",
        timestamp: new Date(),
        agent: data?.agent || "Unknown",
      }

      // Update sessions with AI response
      const finalSessions = updatedSessions.map((session) =>
        session.id === activeSessionId
          ? {
            ...session,
            messages: [...session.messages, responseMessage],
            lastUpdated: new Date(),
          }
          : session,
      )

      setSessions(finalSessions)

      // Save to localStorage to prevent loss
      try {
        localStorage.setItem("chatSessions", JSON.stringify(finalSessions))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    } catch (error) {
      console.error("Error sending message:", error)

      // Add an error message to the chat
      const errorMessage: ChatMessage = {
        id: "error-" + Date.now(),
        role: "system",
        content: "Failed to communicate with the server. Please try again later.",
        timestamp: new Date(),
      }

      const errorSessions = updatedSessions.map((session) =>
        session.id === activeSessionId
          ? {
            ...session,
            messages: [...session.messages, errorMessage],
          }
          : session,
      )

      setSessions(errorSessions)
      try {
        localStorage.setItem("chatSessions", JSON.stringify(errorSessions))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    } finally {
      setIsLoading(false)
    }

    setInput("")
    setImageUpload(null)
  }

  // Handle image click for viewing full-size
  const handleImageClick = (imageUrl: string) => {
    setViewingImage(imageUrl)
  }

  if (!activeSession) {
    return <div className="flex items-center justify-center h-full text-gray-400">No active session</div>
  }

  return (
    <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-md overflow-hidden h-full flex flex-col">
      <div className="p-2 border-b border-gray-800 bg-gray-900/50 flex justify-between items-center">
        <div className="text-sm font-medium text-white">{activeSession.title}</div>
        <div className="text-sm text-gray-400 flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {currentTime}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
          {/* Pass the image click handler to the ChatSession component */}
          <ChatSession session={activeSession} onImageClick={handleImageClick} />
        </div>
        {isLoading && (
          <div className="px-4">
            <LoadingIndicator isLoading={isLoading} />
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            size="icon"
            className={`border-gray-700 ${imageUpload ? "bg-blue-900/50 text-blue-300" : "text-gray-400 hover:text-white"}`}
            onClick={() => {
              document.getElementById("imageInput")?.click()
            }}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                setImageUpload(file)
              }
            }}
          />
          <div className="flex-1 relative">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="bg-gray-800 border-gray-700 text-white pr-10"
              disabled={isLoading}
            />
            {imageUpload && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-xs px-2 py-1 rounded-full bg-blue-900/70 text-blue-200">Image ready</span>
              </div>
            )}
          </div>
          <Button
            className="btn-white bg-white text-black hover:bg-gray-300 hover:text-black"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Image viewing modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-2 right-2 bg-black bg-opacity-50 border-gray-700 text-white hover:bg-opacity-70 z-10"
              onClick={(e) => {
                e.stopPropagation()
                setViewingImage(null)
              }}
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={viewingImage || "/placeholder.svg"}
              alt="Enlarged view"
              className="max-h-screen max-w-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Card>
  )
}
