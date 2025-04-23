import { type NextRequest, NextResponse } from "next/server"

// Create a proxy route handler to avoid CORS issues
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // Forward the request to your FastAPI backend
        const response = await fetch("http://20.84.56.193:8000/chat", {
            method: "POST",
            body: formData,
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error("Proxy error:", error)
        return NextResponse.json({ error: "Failed to communicate with the backend server" }, { status: 500 })
    }
}
