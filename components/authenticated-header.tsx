"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"
import { LogOut } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useToast } from "@/components/hooks/use-toast"

export default function AuthenticatedHeader() {
  const router = useRouter()
  const { toast } = useToast()
  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Logout successful",
        description: "You have been logged out.",
      })
      router.replace("/login") // redirect to login page
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  return (
    <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-gray-200 hover:text-white flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
