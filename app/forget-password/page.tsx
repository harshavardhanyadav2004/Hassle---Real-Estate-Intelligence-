import Header from "@/components/header"
import ForgotPasswordForm from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-black to-gray-900">
            <Header />
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-md mx-auto">
                    <ForgotPasswordForm />
                </div>
            </div>
        </main>
    )
}
