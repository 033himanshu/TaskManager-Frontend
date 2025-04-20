// src/components/forms/RegisterForm.jsx
"use client"

import MyForm from "./FormLayout"
import { z } from "zod"
// import Image from "next/image" // For Logo if needed
import { Button } from "@/components/ui/button"

const schema = z.object({
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Email is invalid" }),

  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .toLowerCase({ message: "Username must be lowercase" })
    .min(3, { message: "Username must be at least 3 characters long" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character" }),

  fullName: z
    .string()
    .nonempty({ message: "Full name is required" }),
})

const fields = [
  { name: "username", label: "Username", placeholder: "e.g. john_doe" },
  { name: "fullName", label: "Full Name", placeholder: "e.g. John Doe" },
  { name: "email", label: "Email", placeholder: "e.g. john@example.com", type: "email" },
  { name: "password", label: "Password", placeholder: "••••••", type: "password" },
]
const defaultValues = {
  email: '',
  username: '',
  password: '',
  fullName: '',
}

import Auth from "@/api/auth"
import { useNavigate } from "react-router-dom"
export default function RegisterForm() {
  const navigate = useNavigate()
  const handleSubmit = async (data) => {
    return await Auth.register(data)
  }
  const handleGoogleRegister = () => {
    // Placeholder function for Google login integration
    alert("Google Register not implemented yet.")
  }
  return (
    <div className="bg-gray-50 flex justify-center items-center">    
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-lg flex flex-col">
        {/* Heading */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Register</h2>

        {/* Register Form */}
        <MyForm
          schema={schema}
          fields={fields}
          onSubmit={handleSubmit}
          afterSubmit = {()=>navigate("/")}
          buttonText="Register"
          defaultValues={defaultValues}
        />
        <Button
          className="bg-red-600 text-white mt-4 justify-center hover:bg-red-500"
          onClick={handleGoogleRegister}
        >
          Continue With Google
        </Button>
      </div>
    </div>
  )
}
