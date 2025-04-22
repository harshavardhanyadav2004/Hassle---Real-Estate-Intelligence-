import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Hero() {
  return (
    <div className="relative py-24 overflow-hidden" style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* Glassmorphism background elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-6xl md:text-7xl font-extrabold text-white mb-6"
            style={{ fontSize: "3rem", fontWeight: "bold", marginBottom: "1rem" }}
          >
            Hassle
          </h2>

          <p
            className="text-xl text-gray-300 mb-4"
            style={{ fontSize: "1.25rem", color: "#d1d5db", marginBottom: "1rem" }}
          >
            Real estate intelligence that works for you, not against you
          </p>
          <div className="flex justify-center">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800 px-8 py-6 text-lg"
                style={{
                  border: "1px solid #374151",
                  color: "#fff",
                  padding: "1rem 2rem",
                  fontSize: "1.125rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "#1f2937",
                }}
              >
                Chat with an Agent <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
