"use client"

import MyForm from "../components/forms/FormLayout"
import { z } from "zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import User from "@/api/user"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MailCheck } from "lucide-react"

const schema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .transform((val) => val.toLowerCase()),
})

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async ({ email }) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await User.forgotPassword({email})
      if (response?.error) {
        setError(response.error)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message || "Failed to send reset instructions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">
            {success
              ? "Check your email for reset instructions"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <MailCheck className="h-12 w-12 text-green-500" />
            </div>
            <Alert variant="success" className="mb-4">
              <AlertDescription>
                We've sent password reset instructions to your email address.
              </AlertDescription>
            </Alert>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Back to Login</Link>
            </Button>
          </div>
        ) : (
          <>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <MyForm
              schema={schema}
              fields={[
                {
                  name: "email",
                  label: "Email Address",
                  placeholder: "your@email.com",
                  type: "email",
                },
              ]}
              onSubmit={handleSubmit}
              buttonText={isLoading ? "Sending..." : "Send Reset Link"}
              disabled={isLoading}
            />

            <div className="mt-4 text-center text-sm">
              Remember your password?{" "}
              <Link
                to="/auth"
                className="font-medium text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}