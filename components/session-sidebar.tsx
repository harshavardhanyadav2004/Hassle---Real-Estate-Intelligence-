"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Trash2, Edit2, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { Session } from "@/lib/types"
import { formatDistanceToNow } from "@/lib/utils"

interface SessionSidebarProps {
  sessions: Session[]
  activeSessionId: string | null
  setActiveSessionId: (id: string) => void
  createNewSession: () => void
  deleteSession: (id: string) => void
  updateSessionTitle: (id: string, title: string) => void
}

export default function SessionSidebar({
  sessions,
  activeSessionId,
  setActiveSessionId,
  createNewSession,
  deleteSession,
  updateSessionTitle,
}: SessionSidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  // Check if we have sessions and an active session on mount
  useEffect(() => {
    // Only run this if we have NO active session but have sessions available
    if (!activeSessionId && sessions.length > 0) {
      // Find most recently updated session
      const mostRecentSession = sessions.reduce(
        (latest, session) =>
          new Date(session.lastUpdated) > new Date(latest.lastUpdated) ? session : latest
        , sessions[0]
      )
      setActiveSessionId(mostRecentSession.id)
    }
    // If no sessions at all, create one
    else if (sessions.length === 0) {
      createNewSession()
    }
  }, [sessions, activeSessionId, setActiveSessionId, createNewSession]);

  const startEditing = (session: Session) => {
    setEditingSessionId(session.id)
    setEditTitle(session.title)
  }

  const saveTitle = (sessionId: string) => {
    if (editTitle.trim()) {
      updateSessionTitle(sessionId, editTitle.trim())

      // Update in localStorage immediately
      try {
        const savedSessions = localStorage.getItem('chatSessions')
        if (savedSessions) {
          const parsedSessions = JSON.parse(savedSessions)
          const updatedSessions = parsedSessions.map((session: any) =>
            session.id === sessionId ? { ...session, title: editTitle.trim() } : session
          )
          localStorage.setItem('chatSessions', JSON.stringify(updatedSessions))
        }
      } catch (error) {
        console.error("Error updating title in localStorage:", error)
      }
    }
    setEditingSessionId(null)
  }

  const cancelEditing = () => {
    setEditingSessionId(null)
  }

  const handleDeleteSession = (id: string) => {
    deleteSession(id)

    // Update localStorage immediately
    try {
      const savedSessions = localStorage.getItem('chatSessions')
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions)
        const filteredSessions = parsedSessions.filter((session: any) => session.id !== id)
        localStorage.setItem('chatSessions', JSON.stringify(filteredSessions))

        // If this was the active session, update activeSessionId in localStorage
        const savedActiveSessionId = localStorage.getItem('activeSessionId')
        if (savedActiveSessionId === id && filteredSessions.length > 0) {
          const mostRecentSession = filteredSessions.reduce(
            (latest: any, session: any) =>
              new Date(session.lastUpdated) > new Date(latest.lastUpdated) ? session : latest
            , filteredSessions[0]
          )
          localStorage.setItem('activeSessionId', mostRecentSession.id)
        }
      }
    } catch (error) {
      console.error("Error updating localStorage after deletion:", error)
    }
  }

  return (
    <div className="w-64 border-r border-gray-800 bg-gray-900/50 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <Button
          onClick={() => {
            const newSession = createNewSession()
            // No need to add logic here as the parent component will handle localStorage
          }}
          className="btn-white w-full bg-white text-black hover:bg-gray-300 hover:text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center justify-between rounded-md p-2 cursor-pointer transition-colors ${activeSessionId === session.id
                ? "bg-gray-800 text-white"
                : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
                }`}
              onClick={() => {
                if (editingSessionId !== session.id) {
                  setActiveSessionId(session.id)
                  // Update localStorage immediately
                  localStorage.setItem('activeSessionId', session.id)
                }
              }}
            >
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />

                {editingSessionId === session.id ? (
                  <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-8 text-sm bg-gray-700 border-gray-600 w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          saveTitle(session.id)
                        } else if (e.key === "Escape") {
                          cancelEditing()
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-transparent"
                      onClick={() => saveTitle(session.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300 hover:bg-transparent"
                      onClick={cancelEditing}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="truncate text-sm font-medium">{session.title}</div>
                    <div className="text-xs text-gray-500">{formatDistanceToNow(session.createdAt)}</div>
                  </div>
                )}
              </div>

              {editingSessionId !== session.id && (
                <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-400 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      startEditing(session)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSession(session.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}