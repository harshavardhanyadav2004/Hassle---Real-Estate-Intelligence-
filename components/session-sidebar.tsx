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

  useEffect(() => {
    if (!activeSessionId && sessions.length > 0) {
      const mostRecent = sessions.reduce(
        (a, b) => new Date(b.lastUpdated) > new Date(a.lastUpdated) ? b : a,
        sessions[0]
      )
      setActiveSessionId(mostRecent.id)
    } else if (sessions.length === 0) {
      createNewSession()
    }
  }, [sessions, activeSessionId, setActiveSessionId, createNewSession])

  const startEditing = (s: Session) => {
    setEditingSessionId(s.id)
    setEditTitle(s.title)
  }

  const saveTitle = (id: string) => {
    if (!editTitle.trim()) return cancelEditing()
    updateSessionTitle(id, editTitle.trim())
    setEditingSessionId(null)
  }

  const cancelEditing = () => setEditingSessionId(null)

  const handleDeleteSession = (id: string) => {
    deleteSession(id)
  }

  return (
    <div className="w-64 border-r border-gray-800 bg-gray-900/50 flex flex-col h-full">
      <div className="p-4 border-b border-gray-800">
        <Button
          onClick={createNewSession}
          className="btn-white w-full bg-white text-black hover:bg-gray-300 hover:text-black"
        >
          <Plus className="h-4 w-4 mr-2" /> New Chat
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
                  localStorage.setItem("activeSessionId", session.id)
                }
              }}
            >
              <div className="flex items-center gap-2 max-w-[70%] overflow-hidden min-w-0">
                <MessageSquare className="h-4 w-4 flex-shrink-0" />

                {editingSessionId === session.id ? (
                  <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-8 text-sm bg-gray-700 border-gray-600 w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTitle(session.id)
                        if (e.key === "Escape") cancelEditing()
                      }}
                    />
                    <Button variant="ghost" size="icon" onClick={() => saveTitle(session.id)}>
                      <Check className="h-4 w-4 text-green-400" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={cancelEditing}>
                      <X className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <div className="truncate text-sm font-medium">{session.title}</div>
                    <div className="text-xs text-gray-500">{formatDistanceToNow(session.createdAt)}</div>
                  </div>
                )}
              </div>

              {/* Action buttons that only show on hover */}
              {editingSessionId !== session.id && (
                <div
                  className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-blue-400 hover:bg-transparent"
                    onClick={() => startEditing(session)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-400 hover:bg-transparent"
                    onClick={() => handleDeleteSession(session.id)}
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
