import Header from "@/components/header"
import LoginForm from "@/components/login-form"

export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </div>
    </main>
  )
}
