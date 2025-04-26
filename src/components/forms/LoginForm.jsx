
"use client"

import { useState } from "react"
import MyForm from "./FormLayout"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Auth from "@/api/auth"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
// import { GoogleLogo } from "@/components/icons"
import { Link } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginForm() {
  const [loginMethod, setLoginMethod] = useState("email")
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const schema = z.object({
    [loginMethod]: loginMethod === "email"
      ? z.string().nonempty("Email is required").email("Invalid email format")
      : z.string().nonempty("Username is required").min(3, "Username must be at least 3 characters"),
    password: z.string().nonempty("Password is required")
  })

  const fields = [
    {
      name: loginMethod,
      label: loginMethod === "email" ? "Email" : "Username",
      placeholder: loginMethod === "email" ? "your@email.com" : "your_username",
      type: loginMethod === "email" ? "email" : "text"
    },
    {
      name: "password",
      label: "Password",
      placeholder: "••••••••",
      type: "password"
    }
  ]
  const defaultValues ={
      email : "",
      password : "",
    }
  const handleSubmit = async (data) => {
    try {
      const payload = {
        [loginMethod]: data[loginMethod],
        password: data.password
      }
      const result = await Auth.login(payload)
      if (result?.error) {
        setError(result.error)
      } else {
        navigate("/")
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    }
  }

  const handleGoogleLogin = () => {
    // Implement Google OAuth
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to continue to your account</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          variant="outline"
          className="w-full mb-6"
          onClick={handleGoogleLogin}
        >
          {/* <GoogleLogo className="w-5 h-5 mr-2" /> */}
          Continue with Google
        </Button>

        <div className="flex items-center my-6">
          <Separator className="flex-1" />
          <span className="px-4 text-sm text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <Tabs 
          value={loginMethod} 
          onValueChange={setLoginMethod}
          className="mb-6"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="username">Username</TabsTrigger>
          </TabsList>
        </Tabs>

        <MyForm
        defaultValues = {defaultValues}
          key={loginMethod} // Important to reset form when switching methods
          schema={schema}
          fields={fields}
          onSubmit={handleSubmit}
          buttonText="Sign In"
        />

        <div className="mt-4 text-center text-sm">
          <Link
            to="/auth/forgot-password"
            className="text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  )
}