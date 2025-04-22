"use client"

import { useState, useEffect } from "react"
import AuthenticatedHeader from "@/components/authenticated-header"
import ChatInterface from "@/components/chat-interface"
import SessionSidebar from "@/components/session-sidebar"
import type { Session } from "@/lib/types"

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  // Initialize with a default session
  useEffect(() => {
    if (sessions.length === 0) {
      const newSession: Session = {
        id: "session-" + Date.now(),
        title: "New Conversation",
        createdAt: new Date(),
        messages: [
          {
            id: "welcome-msg",
            role: "system",
            content: "Welcome to Hassle! How can I assist you with your property needs today?",
            timestamp: new Date(),
          },
        ],
        agentType: null,
      }
      setSessions([newSession])
      setActiveSessionId(newSession.id)
    }
  }, [sessions])

  const createNewSession = () => {
    const newSession: Session = {
      id: "session-" + Date.now(),
      title: "New Conversation",
      createdAt: new Date(),
      messages: [
        {
          id: "welcome-msg",
          role: "system",
          content: "Welcome to Hassle! How can I assist you with your property needs today?",
          timestamp: new Date(),
        },
      ],
      agentType: null,
    }
    setSessions([...sessions, newSession])
    setActiveSessionId(newSession.id)
  }

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter((session) => session.id !== sessionId)
    setSessions(updatedSessions)

    if (activeSessionId === sessionId) {
      setActiveSessionId(updatedSessions.length > 0 ? updatedSessions[0].id : null)
    }
  }

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) => (session.id === sessionId ? { ...session, title: newTitle } : session)),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <AuthenticatedHeader />
      <div className="flex h-[calc(100vh-73px)]">
        <SessionSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          createNewSession={createNewSession}
          deleteSession={deleteSession}
          updateSessionTitle={updateSessionTitle}
        />
        <div className="flex-1 p-4">
          {activeSessionId && (
            <ChatInterface sessions={sessions} setSessions={setSessions} activeSessionId={activeSessionId} />
          )}
        </div>
      </div>
    </div>
  )
}
