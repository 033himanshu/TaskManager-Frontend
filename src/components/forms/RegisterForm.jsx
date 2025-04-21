
"use client"

import MyForm from "./FormLayout"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import Auth from "@/api/auth"
import { useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
// import { GoogleLogo } from "@/components/icons"
import {Link} from "react-router"

const schema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Email is invalid" })
    .transform((val) => val.toLowerCase()),

  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^[a-z0-9_]+$/, {
      message: "Username can only contain lowercase letters, numbers, and underscores",
    })
    .transform((val) => val.toLowerCase()),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
      message: "Password must contain at least one special character",
    }),

  fullName: z.string().nonempty({ message: "Full name is required" }),
})

const fields = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "John Doe",
  },
  {
    name: "username",
    label: "Username",
    placeholder: "john_doe",
    description: "Only lowercase letters, numbers, and underscores",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "john@example.com",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "••••••••",
    type: "password",
    description: "8+ characters with uppercase, number, and special character",
  },
]

export default function RegisterForm() {
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    return await Auth.register(data)
  }

  const handleGoogleRegister = () => {
    // Implement Google OAuth
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">
            Join us to get started with your projects
          </p>
        </div>

        <Button
          variant="outline"
          className="w-full mb-6"
          onClick={handleGoogleRegister}
        >
          {/* <GoogleLogo className="w-5 h-5 mr-2" /> */}
          Continue with Google
        </Button>

        <div className="flex items-center my-6">
          <Separator className="flex-1" />
          <span className="px-4 text-sm text-muted-foreground">OR</span>
          <Separator className="flex-1" />
        </div>

        <MyForm
          schema={schema}
          fields={fields}
          onSubmit={handleSubmit}
          afterSubmit={() => navigate("/")}
          buttonText="Create Account"
          showResetAfterSubmit={false}
        />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  )
}
