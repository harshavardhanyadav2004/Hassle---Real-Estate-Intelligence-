import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Session } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatSessionProps {
  session: Session
}

export default function ChatSession({ session }: ChatSessionProps) {
  const [viewingImage, setViewingImage] = useState<string | null>(null)

  // Handle image click to show the full-screen view
  const handleImageClick = (imageUrl: string) => {
    setViewingImage(imageUrl)
  }

  return (
    <>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {session.messages.map((message) => {
            if (message.role === "system") {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="inline-block px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 text-sm max-w-[80%]">
                    {message.content}
                  </div>
                </div>
              )
            }

            const isUser = message.role === "user"

            return (
              <div key={message.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-3 rounded-lg max-w-[80%] ${isUser ? "bg-gray-700 text-white" : "bg-gray-800 text-white"
                    }`}
                >
                  {message.hasImage && message.imagePreview && (
                    <div className="mb-3">
                      <img
                        src={message.imagePreview || "/placeholder.svg"}
                        alt="Uploaded"
                        className="rounded-lg max-w-xs border border-gray-700 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => handleImageClick(message.imagePreview as string)}
                      />
                    </div>
                  )}
                  <p>{message.content}</p>
                </div>
                <div className="text-xs text-gray-500 mt-1 px-2">{formatTime(message.timestamp)}</div>
              </div>
            )
          })}
        </div>
      </ScrollArea>

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
    </>
  )
}