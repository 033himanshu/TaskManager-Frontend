"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MyForm from "../components/forms/FormLayout"
import { z } from "zod"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import User from "@/api/user"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const schema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

export default function ResetPassword() {
  const { paramToken } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")

  // Extract email from token when component mounts
  useEffect(() => {
    if (paramToken) {
      try {
        // Token format: email-token
        const [email, token] = paramToken.split('-')
        setEmail(decodeURIComponent(email))
        setToken(decodeURIComponent(token))
        setValidToken(true)
      } catch (err) {
        setError("Invalid reset link")
        setValidToken(false)
      }
    }
  }, [paramToken])

  const handleSubmit = async ({ password }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await User.resetPassword({ email, token, password })
      if (response?.error) {
        setError(response.error)
      } else {
        navigate('/auth', { state: { passwordReset: true } })
      }
    } catch (err) {
      setError(err.message || "Failed to reset password")
    } finally {
      setLoading(false)
    }
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Card className="w-full max-w-md p-8 shadow-lg rounded-xl">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900">Invalid Link</h1>
            <p className="text-gray-600">
              The password reset link is invalid or has expired.
            </p>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button asChild className="w-full mt-4">
              <a href="/auth">Go to Login</a>
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter a new password for {email}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <MyForm
          schema={schema}
          fields={[
            {
              name: "password",
              label: "New Password",
              placeholder: "••••••••",
              type: "password",
              description: "8+ characters with uppercase, number, and special character"
            },
            {
              name: "confirmPassword",
              label: "Confirm New Password",
              placeholder: "••••••••",
              type: "password"
            }
          ]}
          onSubmit={handleSubmit}
          buttonText={loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting Password...
            </>
          ) : "Reset Password"}
          disabled={loading}
        />
      </Card>
    </div>
  )
}