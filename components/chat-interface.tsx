"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, ImageIcon, X } from "lucide-react"
import ChatSession from "@/components/chat-session"
import type { ChatMessage, Session } from "@/lib/types"
import LoadingIndicator from "@/components/loading-indicator"

interface ChatInterfaceProps {
  sessions: Session[]
  setSessions: React.Dispatch<React.SetStateAction<Session[]>>
  activeSessionId: string
}

export default function ChatInterface({ sessions, setSessions, activeSessionId }: ChatInterfaceProps) {
  const [input, setInput] = useState("")
  const [imageUpload, setImageUpload] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  const activeSession = sessions.find((session) => session.id === activeSessionId)

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

  const handleSendMessage = () => {
    if (!input.trim() && !imageUpload) return
    setIsLoading(true)

    const newMessage: ChatMessage = {
      id: "user-" + Date.now(),
      role: "user",
      content: input,
      timestamp: new Date(),
      hasImage: !!imageUpload,
      imagePreview: imageUpload ? URL.createObjectURL(imageUpload) : undefined,
    }

    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === activeSessionId
          ? {
            ...session,
            messages: [...session.messages, newMessage],
            title:
              session.title === "New Conversation"
                ? input.slice(0, 30) + (input.length > 30 ? "..." : "")
                : session.title,

          }
          : session,
      ),
    )

    // Simulate AI response and agent routing
    setTimeout(() => {
      let responseMessage: ChatMessage
      let updatedAgentType = activeSession?.agentType

      if (imageUpload || input.toLowerCase().includes("issue") || input.toLowerCase().includes("problem")) {
        updatedAgentType = "property-detective"
        responseMessage = {
          id: "ai-" + Date.now(),
          role: "assistant",
          content:
            "I'm the Property Issue Detective. I can help analyze property issues from your description and images. Could you provide more details about the problem you're experiencing?",
          timestamp: new Date(),
          agent: "Property Issue Detective",
        }
      } else if (
        input.toLowerCase().includes("rent") ||
        input.toLowerCase().includes("lease") ||
        input.toLowerCase().includes("tenant")
      ) {
        updatedAgentType = "tenancy-advisor"
        responseMessage = {
          id: "ai-" + Date.now(),
          role: "assistant",
          content:
            "I'm the Tenancy Advisor. I can help with questions about your lease, tenant rights, and rental agreements. What specific information are you looking for?",
          timestamp: new Date(),
          agent: "Tenancy Advisor",
        }
      } else if (!updatedAgentType) {
        responseMessage = {
          id: "ai-" + Date.now(),
          role: "assistant",
          content:
            "Thank you for your message. To better assist you, could you clarify if you're asking about a property issue (maintenance, repairs, etc.) or a tenancy question (lease, rights, etc.)?",
          timestamp: new Date(),
        }
      } else {
        responseMessage = {
          id: "ai-" + Date.now(),
          role: "assistant",
          content:
            updatedAgentType === "property-detective"
              ? "I'll continue analyzing your property issue. Is there anything specific about the problem you'd like me to focus on?"
              : "I'll help with your tenancy question. Is there any specific aspect of your tenancy agreement you're concerned about?",
          timestamp: new Date(),
          agent: updatedAgentType === "property-detective" ? "Property Issue Detective" : "Tenancy Advisor",
        }
      }

      setSessions((prevSessions) =>
        prevSessions.map((session) =>
          session.id === activeSessionId
            ? {
              ...session,
              messages: [...session.messages, responseMessage],
              agentType: updatedAgentType,
            }
            : session,
        ),
      )

      setIsLoading(false)
    }, 2000) // Increased timeout to show loading state longer

    setInput("")
    setImageUpload(null)
  }

  // You'll need to modify the ChatSession component to use this function
  const handleImageClick = (imageUrl: string) => {
    setViewingImage(imageUrl)
  }

  if (!activeSession) {
    return <div className="flex items-center justify-center h-full text-gray-400">No active session</div>
  }

  return (
    <Card className="border-gray-800 bg-gray-900/30 backdrop-blur-md overflow-hidden h-full flex flex-col">
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
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
              src={viewingImage}
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