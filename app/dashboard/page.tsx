"use client"

import { useState, useEffect } from "react"
import AuthenticatedHeader from "@/components/authenticated-header"
import ChatInterface from "@/components/chat-interface"
import SessionSidebar from "@/components/session-sidebar"
import type { Session } from "@/lib/types"

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Load sessions from localStorage or initialize with a default session
  useEffect(() => {
    if (initialized) return

    // Try to load from localStorage first
    const savedSessions = localStorage.getItem('chatSessions')
    const savedActiveSessionId = localStorage.getItem('activeSessionId')

    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)
        // Process dates to ensure they're Date objects
        const processedSessions = parsedSessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastUpdated: new Date(session.lastUpdated || session.createdAt),
          messages: session.messages.map((message: any) => ({
            ...message,
            timestamp: new Date(message.timestamp)
          }))
        }))

        setSessions(processedSessions)

        // Set active session - either saved one or most recent
        if (savedActiveSessionId && processedSessions.some((s: any) => s.id === savedActiveSessionId)) {
          setActiveSessionId(savedActiveSessionId)
        } else if (processedSessions.length > 0) {
          // Find most recent session
          const mostRecentSession = processedSessions.reduce(
            (latest: any, session: any) => {
              const latestDate = latest.lastUpdated || latest.createdAt
              const sessionDate = session.lastUpdated || session.createdAt
              return new Date(sessionDate) > new Date(latestDate) ? session : latest
            },
            processedSessions[0]
          )
          setActiveSessionId(mostRecentSession.id)
        }
      } catch (error) {
        console.error("Error loading sessions from localStorage:", error)
        createDefaultSession()
      }
    } else {
      // No saved sessions, create default
      createDefaultSession()
    }

    setInitialized(true)
  }, [initialized]) // Only depend on initialized, not sessions

  // Function to create default session
  const createDefaultSession = () => {
    const newSession: Session = {
      id: "session-" + Date.now(),
      title: "New Conversation",
      createdAt: new Date(),
      lastUpdated: new Date(),
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

    // Save to localStorage
    try {
      localStorage.setItem('chatSessions', JSON.stringify([newSession]))
      localStorage.setItem('activeSessionId', newSession.id)
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }

  // Save to localStorage whenever sessions or activeSessionId changes
  useEffect(() => {
    if (!initialized) return

    try {
      localStorage.setItem('chatSessions', JSON.stringify(sessions))
      if (activeSessionId) {
        localStorage.setItem('activeSessionId', activeSessionId)
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  }, [sessions, activeSessionId, initialized])

  const createNewSession = () => {
    const newSession: Session = {
      id: "session-" + Date.now(),
      title: "New Conversation",
      createdAt: new Date(),
      lastUpdated: new Date(),
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

    return newSession // Return the new session for potential use
  }

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter((session) => session.id !== sessionId)
    setSessions(updatedSessions)

    if (activeSessionId === sessionId) {
      // If we deleted the active session, select the most recent one
      if (updatedSessions.length > 0) {
        const mostRecentSession = updatedSessions.reduce(
          (latest, session) => {
            const latestDate = latest.lastUpdated || latest.createdAt
            const sessionDate = session.lastUpdated || session.createdAt
            return new Date(sessionDate) > new Date(latestDate) ? session : latest
          },
          updatedSessions[0]
        )
        setActiveSessionId(mostRecentSession.id)
      } else {
        setActiveSessionId(null)
      }
    }
  }

  const updateSessionTitle = (sessionId: string, newTitle: string) => {
    setSessions((prevSessions) =>
      prevSessions.map((session) =>
        session.id === sessionId
          ? { ...session, title: newTitle, lastUpdated: new Date() }
          : session
      ),
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
            <ChatInterface
              sessions={sessions}
              setSessions={setSessions}
              activeSessionId={activeSessionId}
            />
          )}
        </div>
      </div>
    </div>
  )
}