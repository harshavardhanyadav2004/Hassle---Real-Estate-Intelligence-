import Header from "@/components/header"
import SignupForm from "@/components/signup-form"

export default function Signup() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <SignupForm />
        </div>
      </div>
    </main>
  )
}
