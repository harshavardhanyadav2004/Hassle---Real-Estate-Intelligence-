import Link from "next/link"
import { Button } from "@/components/ui/button"
import Logo from "@/components/logo"

export default function Header() {
  return (
    <header className="w-full border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-200 hover:text-white">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="btn-white w-full bg-white text-black hover:bg-gray-300 hover:text-black">Sign up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
