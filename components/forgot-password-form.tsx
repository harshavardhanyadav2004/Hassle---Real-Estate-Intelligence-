"use client"

import React, { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter
} from "@/components/ui/card"

export default function ForgotPasswordForm() {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            await sendPasswordResetEmail(auth, email)
            toast.success("Password reset link sent.")
            setEmailSent(true)
        } catch (err: any) {
            setError(err.message || "Failed to send password reset email.")
            toast.error(err.message || "Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-gray-800 bg-gray-900/50 backdrop-blur-md">
            <CardHeader>
                <CardTitle className="text-2xl text-white">Forgot Password</CardTitle>
                <CardDescription className="text-gray-400">
                    Enter your email to receive a password reset link.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleResetPassword}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                className="bg-gray-800 border-gray-700 text-white"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                readOnly={emailSent}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        {!emailSent && (
                            <Button
                                type="submit"
                                disabled={loading}
                                className="btn-white w-full bg-white text-black hover:bg-gray-300 hover:text-black"
                            >
                                {loading ? "Sending..." : "Send reset link"}
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="text-sm text-gray-400 text-center">
                You’ll get an email if the address is registered.
            </CardFooter>
        </Card>
    )
}
